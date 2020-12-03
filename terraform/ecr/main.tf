provider "aws" {
  region  = var.aws_region
  version = "~> 2.64"
}

resource "aws_ecr_repository" "container_registry" {
  name                 = var.repository_name
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  //	tags = var.tags
}
