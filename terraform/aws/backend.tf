terraform {
  backend "remote" {
    organization = "bcgov"

    workspaces {
      name = var.workspace
    }
  }
}
