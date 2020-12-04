terraform {
  backend "remote" {
    organization = "bcgov"

    workspaces {
      name = "tnfhhm-dev"
    }
  }
}
