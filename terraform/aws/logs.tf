# logs.tf

# Set up CloudWatch group and retain logs for 30 days
resource "aws_cloudwatch_log_group" "sample_log_group" {
  name              = "/ecs/sample-app"
  retention_in_days = 30

  tags = local.common_tags
}

resource "aws_cloudwatch_log_group" "sample_logs" {
  name = "/ecs/sample-client-app"
  retention_in_days = 30

  tags = local.common_tags
}

//I don't think we need this, as a stream seems to be created automagically for each container instance/task or...?
//resource "aws_cloudwatch_log_stream" "sample_log_stream" {
//  name           = "sample-log-stream"
//  log_group_name = aws_cloudwatch_log_group.sample_log_group.name
//}
