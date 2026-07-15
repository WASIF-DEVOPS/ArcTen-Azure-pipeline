# ============================================================
# IAM Module — Variables
# ============================================================

variable "project" {
  description = "Project name used for resource naming"
  type        = string
  default     = "arcten"
}

variable "environment" {
  description = "Environment name (dev, prod)"
  type        = string
}

variable "datalake_bucket_arn" {
  description = "ARN of the S3 data lake bucket (for Glue IAM policy)"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default     = {}
}
