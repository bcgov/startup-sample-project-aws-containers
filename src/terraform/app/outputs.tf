# outputs.tf

output "apigw_url" {
  description = "Base URL for API Gateway stage."
  value       = aws_apigatewayv2_api.app.api_endpoint
}

output "cloudfront" {
  description = "CloudFront distribution."
  value = {
    domain_name     = aws_cloudfront_distribution.s3_distribution.domain_name
    distribution_id = aws_cloudfront_distribution.s3_distribution.id
  }
}

output "s3_bucket_arn" {
  description = "ARN of S3 bucket for storing static assets."
  value       = aws_s3_bucket.site.arn
}
