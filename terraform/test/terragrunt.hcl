terraform {
  source = "git::https://github.com/bcgov/startup-sample-project-aws-containers-terraform-modules.git//?ref=v0.0.4"
}

include {
  path = find_in_parent_folders()
}

generate "test_tfvars" {
  path              = "test.auto.td5cou"
  if_exists         = "overwrite"
  disable_signature = true
  contents          = <<-EOF
service_names = ["ssp"]
EOF
}
