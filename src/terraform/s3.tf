resource "random_pet" "upload_bucket_name" {
  prefix = "upload-bucket"
  length = 2
}

resource "aws_s3_bucket" "upload_bucket" {
  bucket        = random_pet.upload_bucket_name.id
  force_destroy = true
}
