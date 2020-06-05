# logs.tf

# Set up CloudWatch group and log stream and retain logs for 30 days
resource "aws_cloudwatch_log_group" "sample_log_group" {
  name              = "/ecs/sample-app"
  retention_in_days = 30

  tags = {
    Name = "sample-log-group"
  }
}


resource "aws_cloudwatch_log_group" "sample_logs" {
  name = "/ecs/sample-client-app"
  retention_in_days = 30  
}

resource "aws_cloudwatch_log_stream" "sample_log_stream" {
  name           = "sample-log-stream"
  log_group_name = aws_cloudwatch_log_group.sample_log_group.name
}