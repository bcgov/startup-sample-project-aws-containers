# variables.tf

variable "aws_region" {
  description = "The AWS region things are created in"
  default     = "ca-central-1"
}

variable "ecs_task_execution_role_name" {
  description = "ECS task execution role name"
  default = "startupSampleEcsTaskExecutionRole"
}

variable "ecs_auto_scale_role_name" {
  description = "ECS auto scale role Name"
  default = "startupSampleEcsAutoScaleRole"
}

variable "az_count" {
  description = "Number of AZs to cover in a given region"
  default     = "2"
}

variable "client_app_image" {
  description = "Docker image to run in the ECS cluster"  
}

variable "client_app_port" {
  description = "Port exposed by the docker image to redirect traffic to"
  default     = 80
}

variable "client_app_count" {
  description = "Number of docker containers to run"
  default     = 2
}

variable "client_container_name" {
    description = "Client container name"
    default = "sample-client-app"
}

variable "health_check_path" {
  default = "/"
}

variable "fargate_cpu" {
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units)"
  default     = "1024"
}

variable "fargate_memory" {
  description = "Fargate instance memory to provision (in MiB)"
  default     = "2048"
}

variable "db_masteruser_username" {
  description = "DocumentDB master username"
  default     = "svcdb"
}
variable "db_instance_type" {
  description = "DocumentDB instance type"
  default     = "db.r5.large"
}

variable "db_cluster_name" {
  description = "Name of the cluster"
  default     = "sample-db"
}

variable "db_port" {
  description  = "DocumentDB Port"
  default      = 27017
}

variable "db_name" {
  description  = "DocumentDB DB Name"
  default      = "sample"
}

variable "db_tls_enabled" {
  description  = "TLS Enabled"
  default      = true
}
