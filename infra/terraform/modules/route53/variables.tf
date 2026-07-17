# ============================================================
# ARCTen — Route 53 Module Variables
# ============================================================

variable "project" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Deployment environment (e.g. dev, prod)"
  type        = string
}

variable "domain_name" {
  description = "The domain name for the hosted zone (e.g. arcten-leather.com.pk)"
  type        = string
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
