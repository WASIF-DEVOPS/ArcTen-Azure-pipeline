# ============================================================
# Glue Module — Variables
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

variable "glue_role_arn" {
  description = "IAM role ARN for Glue jobs"
  type        = string
}

variable "glue_scripts_bucket" {
  description = "S3 bucket name where Glue job scripts are stored"
  type        = string
}

variable "datalake_bucket_name" {
  description = "Name of the S3 data lake bucket"
  type        = string
}

variable "docdb_connection_string" {
  description = "DocumentDB MongoDB connection string"
  type        = string
  sensitive   = true
}

variable "rds_jdbc_url" {
  description = "JDBC URL for RDS SQL Server"
  type        = string
}

variable "rds_username" {
  description = "RDS admin username"
  type        = string
}

variable "rds_password" {
  description = "RDS admin password"
  type        = string
  sensitive   = true
}

variable "tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default     = {}
}
