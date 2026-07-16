# ============================================================
# Secrets Manager Module — Variables
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

variable "mongodb_uri" {
  description = "DocumentDB MongoDB connection string"
  type        = string
  sensitive   = true
}

variable "mongodb_password" {
  description = "MongoDB password for root authentication"
  type        = string
  sensitive   = true
  default     = ""
}

variable "jwt_secret" {
  description = "JWT signing secret"
  type        = string
  sensitive   = true
}

variable "admin_password" {
  description = "Admin dashboard password"
  type        = string
  sensitive   = true
}

variable "rds_password" {
  description = "RDS SQL Server admin password"
  type        = string
  sensitive   = true
}

variable "rds_host" {
  description = "RDS SQL Server endpoint (host:port)"
  type        = string
  default     = ""
}

variable "datalake_bucket" {
  description = "S3 data lake bucket name"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default     = {}
}
