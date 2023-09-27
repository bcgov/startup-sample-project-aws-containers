module "ecr" {
  source = "git::https://github.com/BCDevOps/terraform-octk-aws-workload-ecr.git?ref=v0.0.4"

  repository_names = ["startup-sample-app"]
  read_principals  = var.read_principals
}
