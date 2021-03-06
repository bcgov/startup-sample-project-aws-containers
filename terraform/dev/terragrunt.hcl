terraform {
  source = "git::https://github.com/bcgov/startup-sample-project-terraform-modules.git//?ref=v0.0.3"
}

include {
  path = find_in_parent_folders()
}

inputs = {
  alb_name = "ssp"
}
