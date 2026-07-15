# ============================================================
# DocumentDB Module — Variables
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

variable "vpc_id" {
  description = "VPC ID for the DocumentDB security group"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs for the DocumentDB subnet group"
  type        = list(string)
}

variable "allowed_security_group_ids" {
  description = "Security group IDs allowed to access DocumentDB (e.g., EKS node SG)"
  type        = list(string)
}

variable "master_username" {
  description = "Master username for DocumentDB"
  type        = string
  default     = "arctendba"
}

variable "master_password" {
  description = "Master password for DocumentDB"
  type        = string
  sensitive   = true
}

variable "instance_class" {
  description = "DocumentDB instance class"
  type        = string
  default     = "db.t3.medium"
}

variable "instance_count" {
  description = "Number of DocumentDB instances (1 for dev, 2+ for prod HA)"
  type        = number
  default     = 1
}

variable "backup_retention_days" {
  description = "Number of days to retain backups"
  type        = number
  default     = 7
}

variable "tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default     = {}
}
