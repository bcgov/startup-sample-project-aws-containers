terraform {
  source = "git::https://github.com/bcgov/startup-sample-project-aws-containers-terraform-modules.git//?ref=v0.3"
}

include {
  path = find_in_parent_folders()
}
