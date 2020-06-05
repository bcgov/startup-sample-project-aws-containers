# ecs.tf

resource "aws_ecs_cluster" "main" {
  name                = "sample-cluster"
  capacity_providers  = ["FARGATE_SPOT"]
}

data "template_file" "sample_app" {
  template = file("./templates/ecs/sample.json.tpl")
  
  vars = {
    app_image         = var.client_app_image
    app_port          = var.client_app_port
    fargate_cpu       = var.fargate_cpu
    fargate_memory    = var.fargate_memory
    aws_region        = var.aws_region
    container_name    = var.client_container_name,
    db_server         = aws_docdb_cluster.docdb.endpoint,
    db_user           = var.db_masteruser_username,
    db_port           = var.db_port,
    db_name           = var.db_name,
    db_tls            = var.db_tls_enabled,
    log_group         = aws_cloudwatch_log_group.sample_logs.name,
    secret_key        = aws_secretsmanager_secret_version.db_user_password.arn
  }
}

resource "aws_ecs_task_definition" "app" {
  family                   = "sample-app-task"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.sample_app_container_role.arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.fargate_cpu
  memory                   = var.fargate_memory
  container_definitions    = data.template_file.sample_app.rendered
}





resource "aws_ecs_service" "main" {
  name            = "sample-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = var.client_app_count
  launch_type     = "FARGATE"

  network_configuration {
    security_groups  = [aws_security_group.ecs_tasks.id]
    subnets          = aws_subnet.private.*.id
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.app.id
    container_name   = var.client_container_name
    container_port   = var.client_app_port
  }

  depends_on = [aws_alb_listener.front_end, aws_iam_role_policy_attachment.ecs_task_execution_role]
}

