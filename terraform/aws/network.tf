# network.tf

# Fetch AZs in the current region
data "aws_availability_zones" "available" {
}

data "aws_vpc" "main" {
  filter {
    name   = "tag:Name"
    values = ["Dev_vpc"] # insert values here
  }
}

data "aws_subnet_ids" "private" {
  vpc_id = data.aws_vpc.main.id
  filter {
    name   = "tag:Name"
    values = ["Web_Dev_aza_net", "Web_Dev_azb_net"] # insert values here
  }
}

data "aws_subnet_ids" "privateapp" {
  vpc_id = data.aws_vpc.main.id
  filter {
    name   = "tag:Name"
    values = ["App_Dev_aza_net", "App_Dev_azb_net"] # insert values here
  }
}
