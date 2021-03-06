terraform {
  source = "git::https://github.com/bcgov/startup-sample-project-terraform-modules.git//?ref=v0.0.3"
}

include {
  path = find_in_parent_folders()
}

locals {
  alb_name = "ssp"
}

generate "tfvars" {
  path              = "dev.auto.tfvars"
  if_exists         = "overwrite"
  disable_signature = true
  contents          = <<-EOF
alb_name = "${local.alb_name}"
EOF
}
