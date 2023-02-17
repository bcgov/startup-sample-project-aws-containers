terraform {
  source = "git::https://github.com/bcgov/startup-sample-project-aws-containers-terraform-modules.git//?ref=v0.2"
}

include {
  path = find_in_parent_folders()
}

locals {
  project = get_env("LICENSE_PLATE")
}

generate "dev_tfvars" {
  path              = "dev.auto.tfvars"
  if_exists         = "overwrite"
  disable_signature = true
  contents          = <<-EOF
    alb_name = "default"
    cloudfront = true

    cloudfront_origin_domain = "startup-sample-project.${local.project}-dev.lz0.nimbus.cloud.gov.bc.ca"

    service_names = ["startup-sample-project"]
  EOF
}
