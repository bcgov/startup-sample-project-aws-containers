terraform {
  # source = "git::https://github.com/bcgov/startup-sample-project-terraform-modules.git//?ref=v0.0.1"
  source = "../../../terraform-octk-aws-workload-ecr//."
}

locals {
  tfc_hostname     = "app.terraform.io"
  tfc_organization = "bcgov"
  project          = "tnfhhm"
  environment      = reverse(split("/", get_terragrunt_dir()))[0]
  repository_name  = "tnfhhm"
  read_principals  = ["arn:aws:iam::813318847992:root", "arn:aws:iam::287566111173:root"]
}

generate "tfvars" {
  path              = "terragrunt.${local.environment}.auto.tfvars"
  if_exists         = "overwrite"
  disable_signature = true
  contents          = <<-EOF
repository_name = "${local.repository_name}"
read_principals = ${jsonencode(local.read_principals)}
EOF
}

generate "remote_state" {
  path      = "backend.tf"
  if_exists = "overwrite"
  contents  = <<EOF
terraform {
  backend "remote" {
    hostname = "${local.tfc_hostname}"
    organization = "${local.tfc_organization}"
    workspaces {
      name = "${local.project}-${local.environment}"
    }
  }
}
EOF
}

generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite"
  contents  = <<EOF
provider "aws" {
  region  = var.aws_region

  assume_role {
    role_arn = "arn:aws:iam::$${var.target_aws_account_id}:role/BCGOV_$${var.target_env}_Automation_Admin_Role"
  }
}
EOF
}
