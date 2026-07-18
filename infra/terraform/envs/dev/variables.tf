# ============================================================
# ARCTen — Dev Environment Variables
# ============================================================

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "unique_suffix" {
  description = "Unique suffix for globally unique resource names (S3 buckets)"
  type        = string
}

# ── Sensitive Variables (from terraform.tfvars or CI/CD) ─────
variable "docdb_master_password" {
  description = "Master password for DocumentDB"
  type        = string
  sensitive   = true
}

variable "rds_admin_password" {
  description = "Admin password for RDS SQL Server"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT signing secret for the application"
  type        = string
  sensitive   = true
}

variable "admin_password" {
  description = "Admin dashboard password"
  type        = string
  sensitive   = true
}

variable "domain_name" {
  description = "The public domain name for Route 53"
  type        = string
  default     = "dev.arcten-leather.volo.pk"
}


