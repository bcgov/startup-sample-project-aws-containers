

resource "random_integer" "cf_origin_id" {
  min = 1
  max = 100
}

data "aws_cloudfront_cache_policy" "default" {
  # Docs for the manged cache policy
  # https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/managed-cache-policies.html
  name = "Managed-CachingDisabled"
}

data "aws_cloudfront_origin_request_policy" "default" {
  # Docs for the manged origin request policy
  # https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/managed-origin-request-policies.html
  name = "Managed-AllViewerExceptHostHeader"
}

resource "aws_cloudfront_distribution" "geofencing" {

  count = var.cloudfront ? 1 : 0

  origin {
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }

    domain_name = trimprefix(aws_apigatewayv2_api.app.api_endpoint, "https://")
    origin_id   = random_integer.cf_origin_id.result
  }

  enabled         = true
  is_ipv6_enabled = true
  comment         = "geofencing"

  //	- logging should probably be in a central location (centralized-logging account?) - in an aggregated/shared bucket and perhaps also synced into a bucket within the account where the aws-login app is deployed
  //	- prefix should follow SEA convention like <account>/<region>/<service name> eg. 12345678/ca-central-1/cloudfront
  //
  //  logging_config {
  //    include_cookies = false
  //    bucket          = "<mylogs>.s3.amazonaws.com"
  //    prefix          = "geofencing"
  //  }

  default_cache_behavior {
    allowed_methods = [
      "DELETE",
      "GET",
      "HEAD",
      "OPTIONS",
      "PATCH",
      "POST",
      "PUT"
    ]
    cached_methods = [
      "GET",
      "HEAD"
    ]

    target_origin_id         = random_integer.cf_origin_id.result
    cache_policy_id          = data.aws_cloudfront_cache_policy.default.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.default.id

    viewer_protocol_policy = "redirect-to-https"

    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400
  }

  ordered_cache_behavior {
    path_pattern    = "/static/*"
    allowed_methods = ["GET", "HEAD"]
    cached_methods  = ["GET", "HEAD"]

    target_origin_id = random_integer.cf_origin_id.result

    forwarded_values {
      query_string = false
      headers      = ["Origin"]

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations = [
      "CA"]
    }
  }

  tags = local.common_tags

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
