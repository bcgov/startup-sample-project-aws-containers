terraform {
  # source = "git::https://github.com/bcgov/startup-sample-project-aws-containers-terraform-modules.git//?ref=v0.0.4"
  source = "git::https://github.com/kdesao-devops/startup-sample-project-aws-containers-terraform-modules.git//.?ref=OIDC_integration"
}

include {
  path = find_in_parent_folders()
}

generate "test_tfvars" {
  path              = "test.auto.tfvars"
  if_exists         = "overwrite"
  disable_signature = true
  contents          = <<-EOF
service_names = ["ssp"]
EOF
}
