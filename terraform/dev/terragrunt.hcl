terraform {
  source = "git::https://github.com/bcgov/startup-sample-project-aws-containers-terraform-modules.git//?ref=v0.1"
}

include {
  path = find_in_parent_folders()
}

# Will need to change the license plate value td5cou
generate "dev_td5cou" {
  path              = "dev.auto.td5cou"
  if_exists         = "overwrite"
  disable_signature = true
  contents          = <<-EOF
    alb_name = "default"
    cloudfront = true
    cloudfront_origin_domain = "startup-sample-project.td5cou-dev.nimbus.cloud.gov.bc.ca" 
    service_names = ["startup-sample-project"]
  EOF
}
