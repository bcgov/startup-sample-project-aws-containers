terraform {
  source = "git::https://github.com/bcgov/startup-sample-project-aws-containers-terraform-modules.git//?ref=v0.4"
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
    cloudfront = true
  EOF
}
