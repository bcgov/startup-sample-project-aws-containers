variable "aws_access_key" {
  description       = "Access Key to allows connection to AWS"
}

variable "aws_secret_key" {
  description       = "Secret Key to allows connection to AWS"
}

# Configure the AWS Provider
provider "aws" {
  version = "~> 2.0"
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  region  = "ca-central-1" 
  # us-east-1
}

# Create a EC2
#resource "aws_ec2" "example1" {
  #ami           = "ami-0054a87febcce8612"
  #instance_type = "t2.micro"

  # Adding tags for the second apply of the plan
  #
  #tags          = {
  #  Name        = "VM_Provisioned_with_Terraform"
  #  env = "TEST"
  #  charge_account_info_client_code = "999"
  #  charge_account_info_responsibility_code = "99999"
  #  charge_account_info_service_code = "99999"
  #}
#}

# Create a VPC
#resource "aws_vpc" "example2" {
  #cidr_block = "10.0.0.0/16"
#}