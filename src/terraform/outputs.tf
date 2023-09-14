# outputs.tf

output "sns_topic" {
  value       = aws_sns_topic.billing_alert_topic.arn
  description = "Subscribe to this topic using your email to receive email alerts from the budget."
}

output "api_gateway_url" {
  value = aws_apigatewayv2_api.app.api_endpoint
}

output "cloudfront_url" {
  value = "https://${aws_cloudfront_distribution.geofencing[0].domain_name}"

}
