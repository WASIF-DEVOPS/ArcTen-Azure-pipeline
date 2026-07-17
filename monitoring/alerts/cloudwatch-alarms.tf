# ============================================================
# CloudWatch Alarm Rules (AWS)
# Provisions alerts for EKS cluster, RDS, and DocumentDB
# ============================================================

variable "resource_group_name" {
  description = "Kept for interface compatibility — not used in AWS"
  type        = string
  default     = ""
}

variable "alert_email" {
  description = "Email address for alert notifications"
  type        = string
  default     = "admin@arcten.com"
}

variable "eks_cluster_name" {
  description = "Name of the EKS cluster to monitor"
  type        = string
}

variable "rds_instance_id" {
  description = "Identifier of the RDS instance to monitor"
  type        = string
}

variable "docdb_cluster_id" {
  description = "Identifier of the DocumentDB cluster to monitor"
  type        = string
}

# ── SNS Topic ────────────────────────────────────────────────
resource "aws_sns_topic" "devops_alerts" {
  name = "devops-action-group"
}

resource "aws_sns_topic_subscription" "email_admin" {
  topic_arn = aws_sns_topic.devops_alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

# ── 1. EKS Node CPU Alert ───────────────────────────────────
resource "aws_cloudwatch_metric_alarm" "eks_node_cpu" {
  alarm_name          = "alert-eks-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "node_cpu_utilization"
  namespace           = "ContainerInsights"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Triggers when average EKS node CPU usage exceeds 80%"

  dimensions = {
    ClusterName = var.eks_cluster_name
  }

  alarm_actions = [aws_sns_topic.devops_alerts.arn]
}

# ── 2. RDS SQL DW CPU Alert ─────────────────────────────────
resource "aws_cloudwatch_metric_alarm" "rds_cpu" {
  alarm_name          = "alert-rds-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 90
  alarm_description   = "Triggers when RDS Data Warehouse CPU usage is high"

  dimensions = {
    DBInstanceIdentifier = var.rds_instance_id
  }

  alarm_actions = [aws_sns_topic.devops_alerts.arn]
}

# ── 3. DocumentDB Connections Alert ──────────────────────────
resource "aws_cloudwatch_metric_alarm" "docdb_connections" {
  alarm_name          = "alert-docdb-connections-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "DatabaseConnections"
  namespace           = "AWS/DocDB"
  period              = 300
  statistic           = "Average"
  threshold           = 100
  alarm_description   = "Triggers when DocumentDB connection count is high"

  dimensions = {
    DBClusterIdentifier = var.docdb_cluster_id
  }

  alarm_actions = [aws_sns_topic.devops_alerts.arn]
}
