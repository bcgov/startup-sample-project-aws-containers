# alb.tf
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
  name                 = "sample-target-group"
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



