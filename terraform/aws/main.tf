provider "aws" {
	region = var.aws_region
	version = "~> 2.64"
}

locals {
	//Put all common tags here
	common_tags = {
		Project = "Startup Sample"
		Environment = "Development"

	}

	create_ecs_service = var.client_app_image == "" ? 0 : 1
}

//module "ecr" {
//	source = "./ecr"
//	tags = local.common_tags
//	repository_name = var.repository_name
//}
//
////module "app" {
////	source = "../app"
////	repository_path = module.ecr.repository_path
////}
////
