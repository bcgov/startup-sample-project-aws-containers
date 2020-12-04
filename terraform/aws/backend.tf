terraform {
  backend "remote" {
    organization = "bcgov"

    workspaces {
      prefix = "tnfhhm-"
    }
  }
}
