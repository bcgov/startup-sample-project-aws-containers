variable "read_principals" {
  description = "List of AWS principals that can read from the ECR repository"
  type        = list(string)
  default     = []
}
