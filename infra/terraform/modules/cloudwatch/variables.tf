# ============================================================
# CloudWatch Module — Variables
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

variable "alert_email" {
  description = "Email address for alarm notifications"
  type        = string
  default     = "admin@arcten.com"
}

variable "log_retention_days" {
  description = "Number of days to retain CloudWatch logs"
  type        = number
  default     = 30
}

variable "cpu_alarm_threshold" {
  description = "CPU utilization threshold (%) for EKS node alarm"
  type        = number
  default     = 80
}

variable "rds_cpu_alarm_threshold" {
  description = "CPU utilization threshold (%) for RDS alarm"
  type        = number
  default     = 90
}

variable "docdb_connections_threshold" {
  description = "DocumentDB connection count threshold for alarm"
  type        = number
  default     = 100
}

variable "tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default     = {}
}
