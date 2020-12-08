# ecs.tf

resource "aws_ecs_cluster" "main" {
  name               = "sample-cluster"
  capacity_providers = ["FARGATE_SPOT"]

  default_capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"a
    weight            = 100
  }

  tags = local.common_tags
}

data "template_file" "sample_app" {
  template = file("${path.module}/templates/ecs/sample.json.tpl")

  vars = {
    app_name       = "sample-app"
    app_image      = var.client_app_image
    app_port       = var.client_app_port
    fargate_cpu    = var.fargate_cpu
    fargate_memory = var.fargate_memory
    aws_region     = var.aws_region
    container_name = var.client_container_name
    db_name        = var.db_name
  }
}

resource "aws_ecs_task_definition" "app" {
  count                    = local.create_ecs_service
  family                   = "sample-app-task"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.sample_app_container_role.arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.fargate_cpu
  memory                   = var.fargate_memory
  container_definitions    = data.template_file.sample_app.rendered

  tags = local.common_tags
}

resource "aws_ecs_service" "main" {
  count                             = local.create_ecs_service
  name                              = "sample-service"
  cluster                           = aws_ecs_cluster.main.id
  task_definition                   = aws_ecs_task_definition.app[count.index].arn
  desired_count                     = var.client_app_count
  enable_ecs_managed_tags           = true
  propagate_tags                    = "TASK_DEFINITION"
  health_check_grace_period_seconds = 60


  capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"
    weight            = 100
  }


  network_configuration {
    security_groups  = [aws_security_group.ecs_tasks.id]
    subnets          = data.aws_subnet_ids.privateapp.ids
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.app.id
    container_name   = var.client_container_name
    container_port   = var.client_app_port
  }

  depends_on = [aws_alb_listener.front_end, aws_iam_role_policy_attachment.ecs_task_execution_role]

  tags = local.common_tags
}
