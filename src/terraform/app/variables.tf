# Required Variables

variable "target_env" {
  description = "The target environment"
  type        = string
}

# Optional Variables

variable "aws_region" {
  description = "The AWS region"
  type        = string
  default     = "ca-central-1"
}

variable "app_name" {
  description = "The name of the application"
  type        = string
  default     = "sample-app"
}

variable "app_image" {
  description = "The Docker image for the application"
  type        = string
  default     = ""
}

variable "app_port" {
  description = "The port on which the application listens"
  type        = number
  default     = 5000
}

variable "app_count" {
  description = "The number of instances of the application to run"
  type        = number
  default     = 1
}

variable "db_name" {
  description = "The name of the dynamodb table"
  type        = string
  default     = "greetings"
}

variable "health_check_path" {
  description = "The path for the health check endpoint"
  type        = string
  default     = "/"
}

variable "common_tags" {
  description = "Common tags to be applied to resources"
  type        = map(string)
  default     = {}
}

variable "fargate_cpu" {
  description = "The CPU units for the Fargate task"
  type        = number
  default     = 256
}

variable "fargate_memory" {
  description = "The memory for the Fargate task"
  type        = number
  default     = 512
}

variable "container_name" {
  description = "The name of the container"
  type        = string
  default     = "node-api"
}
