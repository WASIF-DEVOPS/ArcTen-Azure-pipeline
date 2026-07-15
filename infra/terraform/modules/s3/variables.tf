# ============================================================
# S3 Module — Variables
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

variable "unique_suffix" {
  description = "Unique suffix for globally unique S3 bucket name"
  type        = string
}

variable "tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default     = {}
}
