
locals {
  common_tags        = var.common_tags
  create_ecs_service = var.app_image == "" ? 0 : 1
}

data "aws_caller_identity" "current" {}

# Gather VPC information from the network module

module "network" {
  source      = "git::https://github.com/BCDevOps/terraform-octk-aws-sea-network-info.git?ref=master"
  environment = var.target_env
}

# S3 bucket for static assets

resource "aws_s3_bucket" "site" {
  bucket = "${var.app_name}-site-${data.aws_caller_identity.current.account_id}-${var.aws_region}"
}

# CloudFront distribution for the S3 bucket
resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "OAI for ${var.app_name} site."
}

resource "aws_s3_bucket_policy" "site_policy" {
  bucket = aws_s3_bucket.site.bucket

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          "AWS" : "${aws_cloudfront_origin_access_identity.oai.iam_arn}"
        },
        Action   = "s3:GetObject",
        Resource = "arn:aws:s3:::${aws_s3_bucket.site.bucket}/*"
      }
    ]
  })
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Distribution for ${var.app_name} site."
  default_root_object = "index.html"

  origin {
    domain_name = aws_s3_bucket.site.bucket_regional_domain_name
    origin_id   = aws_s3_bucket.site.bucket

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = aws_s3_bucket.site.bucket

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name = "${var.app_name}-distribution"
  }
}

# API Gateway

resource "aws_apigatewayv2_vpc_link" "app" {
  name               = var.app_name
  subnet_ids         = module.network.aws_subnet_ids.web.ids
  security_group_ids = [module.network.aws_security_groups.web.id]
}

resource "aws_apigatewayv2_api" "app" {
  name          = var.app_name
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "app" {
  api_id             = aws_apigatewayv2_api.app.id
  integration_type   = "HTTP_PROXY"
  connection_id      = aws_apigatewayv2_vpc_link.app.id
  connection_type    = "VPC_LINK"
  integration_method = "ANY"
  integration_uri    = aws_alb_listener.internal.arn
}

resource "aws_apigatewayv2_route" "app" {
  api_id    = aws_apigatewayv2_api.app.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.app.id}"
}

resource "aws_apigatewayv2_stage" "app" {
  api_id      = aws_apigatewayv2_api.app.id
  name        = "$default"
  auto_deploy = true
}

# Internal ALB 

resource "aws_alb" "app-alb" {

  name                             = var.app_name
  internal                         = true
  subnets                          = module.network.aws_subnet_ids.web.ids
  security_groups                  = [module.network.aws_security_groups.web.id]
  enable_cross_zone_load_balancing = true
  tags                             = local.common_tags

  lifecycle {
    ignore_changes = [access_logs]
  }
}
resource "aws_alb_listener" "internal" {
  load_balancer_arn = aws_alb.app-alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.app.arn
  }

}
resource "aws_alb_target_group" "app" {
  name                 = "${var.app_name}-tg"
  port                 = var.app_port
  protocol             = "HTTP"
  vpc_id               = module.network.aws_vpc.id
  target_type          = "ip"
  deregistration_delay = 30

  health_check {
    healthy_threshold   = "2"
    interval            = "5"
    protocol            = "HTTP"
    matcher             = "200"
    timeout             = "3"
    path                = var.health_check_path
    unhealthy_threshold = "2"
  }

  tags = local.common_tags
}

# ECS 

resource "aws_ecs_cluster" "main" {
  name = "${var.app_name}-cluster"
  tags = local.common_tags
}

resource "aws_ecs_cluster_capacity_providers" "sample" {
  cluster_name = aws_ecs_cluster.main.name

  capacity_providers = ["FARGATE_SPOT"]

  default_capacity_provider_strategy {
    weight            = 100
    capacity_provider = "FARGATE_SPOT"
  }
}

resource "aws_ecs_task_definition" "app" {
  count                    = local.create_ecs_service
  family                   = var.app_name
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.sample_app_container_role.arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.fargate_cpu
  memory                   = var.fargate_memory
  tags                     = local.common_tags
  container_definitions = jsonencode([
    {
      essential   = true
      name        = var.container_name
      image       = var.app_image
      cpu         = var.fargate_cpu
      memory      = var.fargate_memory
      networkMode = "awsvpc"
      portMappings = [
        {
          protocol      = "tcp"
          containerPort = var.app_port
          hostPort      = var.app_port
        }
      ]
      environment = [
        {
          name  = "DYNAMODB_TABLE_NAME"
          value = var.db_name
        },
        {
          name  = "AWS_REGION",
          value = var.aws_region
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-create-group  = "true"
          awslogs-group         = "/ecs/${var.app_name}"
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs"
        }
      }
      mountPoints = []
      volumesFrom = []
    }
  ])
}

resource "aws_ecs_service" "main" {
  count                             = local.create_ecs_service
  name                              = var.app_name
  cluster                           = aws_ecs_cluster.main.id
  task_definition                   = aws_ecs_task_definition.app[count.index].arn
  desired_count                     = var.app_count
  enable_ecs_managed_tags           = true
  propagate_tags                    = "TASK_DEFINITION"
  health_check_grace_period_seconds = 60
  wait_for_steady_state             = false


  capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"
    weight            = 100
  }


  network_configuration {
    security_groups  = [module.network.aws_security_groups.app.id]
    subnets          = module.network.aws_subnet_ids.app.ids
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.app.id
    container_name   = var.container_name
    container_port   = var.app_port
  }

  depends_on = [aws_iam_role_policy_attachment.ecs_task_execution_role]

  tags = local.common_tags
}

# ECS task execution role data
data "aws_iam_policy_document" "ecs_task_execution_role" {
  version = "2012-10-17"
  statement {
    sid     = ""
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}
# ECS task execution role
resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "${var.app_name}_ecs_task_execution_role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_execution_role.json

  tags = local.common_tags
}

# ECS task execution role policy attachment
resource "aws_iam_role_policy_attachment" "ecs_task_execution_role" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "ecs_task_execution_cwlogs" {
  name = "${var.app_name}-ecs_task_execution_cwlogs"
  role = aws_iam_role.ecs_task_execution_role.id

  policy = <<-EOF
  {
      "Version": "2012-10-17",
      "Statement": [
          {
              "Effect": "Allow",
              "Action": [
                  "logs:CreateLogGroup"
              ],
              "Resource": [
                  "arn:aws:logs:*:*:*"
              ]
          }
      ]
  }
EOF
}

resource "aws_iam_role" "sample_app_container_role" {
  name = "${var.app_name}_container_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF

  tags = local.common_tags
}

resource "aws_iam_role_policy" "sample_app_container_cwlogs" {
  name = "${var.app_name}_container_cwlogs"
  role = aws_iam_role.sample_app_container_role.id

  policy = <<-EOF
  {
      "Version": "2012-10-17",
      "Statement": [
          {
              "Effect": "Allow",
              "Action": [
                  "logs:CreateLogGroup",
                  "logs:CreateLogStream",
                  "logs:PutLogEvents",
                  "logs:DescribeLogStreams"
              ],
              "Resource": [
                  "arn:aws:logs:*:*:*"
              ]
          }
      ]
  }
EOF
}


# DynamoDB


resource "aws_dynamodb_table" "startup_sample_table" {
  name           = var.db_name
  hash_key       = "id"
  range_key      = "createdAt"
  read_capacity  = 1
  write_capacity = 1

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "createdAt"
    type = "S"
  }

  tags = local.common_tags
}

resource "aws_iam_role_policy" "sample_app_dynamodb" {
  name = "${var.app_name}_dynamodb"
  role = aws_iam_role.sample_app_container_role.id

  policy = <<-EOF
  {
    "Version": "2012-10-17",
    "Statement": [
      {
          "Effect": "Allow",
          "Action": [
              "dynamodb:BatchGet*",
              "dynamodb:DescribeStream",
              "dynamodb:DescribeTable",
              "dynamodb:Get*",
              "dynamodb:Query",
              "dynamodb:Scan",
              "dynamodb:BatchWrite*",
              "dynamodb:CreateTable",
              "dynamodb:Delete*",
              "dynamodb:Update*",
              "dynamodb:PutItem"
          ],
          "Resource": "${aws_dynamodb_table.startup_sample_table.arn}"
        }
    ]
  }
  EOF  
}
