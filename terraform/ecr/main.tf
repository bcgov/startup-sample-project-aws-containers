provider "aws" {
	version = "~> 2.64"
}

resource "aws_ecr_repository" "container_registry" {
	name                 = var.repository_name
	image_tag_mutability = "MUTABLE"

//	tags = var.tags
}
