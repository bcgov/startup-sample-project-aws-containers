terraform {
  source = "git::https://github.com/bcgov/startup-sample-project-terraform-modules.git//?ref=v0.0.5"
}

include {
  path = find_in_parent_folders()
}

generate "dev_tfvars" {
  path              = "dev.auto.tfvars"
  if_exists         = "overwrite"
  disable_signature = true
  cloudfront_origin_domain = "https://startup-sample-project.tnfhhm-dev.nimbus.cloud.gov.bc.ca/"
  contents          = <<-EOF
    alb_name = "default"
    cloudfront = true
    service_names = ["startup-sample-project"]
  EOF
}
