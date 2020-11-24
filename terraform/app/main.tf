resource "null_resource" "build_image" {
  provisioner "local-exec" {
    working_dir = "../../"
    command     = "make pipeline-build"
  }
}

resource "null_resource" "profile" {
  provisioner "local-exec" {
    working_dir = "../../"
    command     = "make setup-aws-profile"
  }
}

resource "null_resource" "push_image" {

  provisioner "local-exec" {
    //		the data elements below are hacks to ensure order of execution, without using "depends_on"
    environment = {
      REPOSITORY_PATH = var.repository_path
      PROFILE         = null_resource.profile.id
      IMAGE           = null_resource.push_image.id
    }
    working_dir = "../../"
    command     = "make pipeline-push"
  }
}
