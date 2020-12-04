provider "aws" {
  alias   = "main"
  region  = var.aws_region
  version = "~> 3.11"
}

data "aws_caller_identity" "main" {
  provider = aws.main
}

provider "aws" {
  region  = var.aws_region
  version = "~> 3.11"

  assume_role {
    role_arn = "arn:aws:iam::${local.account_id}:role/BCGOV_${var.account_name}_Automation_Admin_Role"
  }
}

locals {
  account_id = data.aws_caller_identity.main.account_id

  //Put all common tags here
  common_tags = {
    Project     = "Startup Sample"
    Environment = "Development"
  }
  create_ecs_service = var.client_app_image == "" ? 0 : 1
}
