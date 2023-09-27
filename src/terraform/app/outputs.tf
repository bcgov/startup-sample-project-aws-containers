# outputs.tf

output "api_gateway_url" {
  value = aws_apigatewayv2_api.app.api_endpoint
}

output "cloudfront_url" {
  value = "https://${aws_cloudfront_distribution.s3_distribution.domain_name}"

}
