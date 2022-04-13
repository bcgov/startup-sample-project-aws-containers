terraform {
  source = "git::https://github.com/bcgov/startup-sample-project-aws-containers-terraform-modules.git//?ref=v0.1"
}

include {
  path = find_in_parent_folders()
}

locals {
  project = get_env("MY_LICENSE_PLATE")
}

generate "dev_tfvars" {
  path              = "dev.auto.tfvars"
  if_exists         = "overwrite"
  disable_signature = true
  contents          = <<-EOF
    alb_name = "default"
    cloudfront = true
    cloudfront_origin_domain = "startup-sample-project.${local.project}-dev.nimbus.cloud.gov.bc.ca"
    service_names = ["startup-sample-project"]
  EOF
}
