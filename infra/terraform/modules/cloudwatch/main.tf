# ============================================================
# ARCTen — CloudWatch Module (AWS)
# Creates log groups, metric alarms, and SNS topic for alerts
# ============================================================

# ── SNS Topic for Alerts ─────────────────────────────────────
resource "aws_sns_topic" "alerts" {
  name = "${var.project}-alerts-${var.environment}"

  tags = merge(var.tags, {
    Name = "${var.project}-alerts-${var.environment}"
  })
}

resource "aws_sns_topic_subscription" "email" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

# ── CloudWatch Log Groups ────────────────────────────────────
resource "aws_cloudwatch_log_group" "eks" {
  name              = "/aws/eks/${var.project}-eks-${var.environment}/cluster"
  retention_in_days = var.log_retention_days

  tags = merge(var.tags, {
    Name = "${var.project}-eks-logs-${var.environment}"
  })
}

resource "aws_cloudwatch_log_group" "application" {
  name              = "/arcten/${var.environment}/application"
  retention_in_days = var.log_retention_days

  tags = merge(var.tags, {
    Name = "${var.project}-app-logs-${var.environment}"
  })
}

# ── EKS Node CPU Alarm ───────────────────────────────────────
resource "aws_cloudwatch_metric_alarm" "eks_node_cpu" {
  alarm_name          = "${var.project}-eks-cpu-high-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "node_cpu_utilization"
  namespace           = "ContainerInsights"
  period              = 300
  statistic           = "Average"
  threshold           = var.cpu_alarm_threshold
  alarm_description   = "EKS node CPU usage exceeds ${var.cpu_alarm_threshold}%"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    ClusterName = "${var.project}-eks-${var.environment}"
  }

  tags = merge(var.tags, {
    Name = "${var.project}-eks-cpu-alarm-${var.environment}"
  })
}

# ── RDS CPU Alarm ────────────────────────────────────────────
resource "aws_cloudwatch_metric_alarm" "rds_cpu" {
  alarm_name          = "${var.project}-rds-cpu-high-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = var.rds_cpu_alarm_threshold
  alarm_description   = "RDS CPU usage exceeds ${var.rds_cpu_alarm_threshold}%"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    DBInstanceIdentifier = "${var.project}-dw-${var.environment}"
  }

  tags = merge(var.tags, {
    Name = "${var.project}-rds-cpu-alarm-${var.environment}"
  })
}

# ── DocumentDB Connections Alarm ─────────────────────────────
resource "aws_cloudwatch_metric_alarm" "docdb_connections" {
  alarm_name          = "${var.project}-docdb-connections-high-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "DatabaseConnections"
  namespace           = "AWS/DocDB"
  period              = 300
  statistic           = "Average"
  threshold           = var.docdb_connections_threshold
  alarm_description   = "DocumentDB connections exceed ${var.docdb_connections_threshold}"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    DBClusterIdentifier = "${var.project}-docdb-${var.environment}"
  }

  tags = merge(var.tags, {
    Name = "${var.project}-docdb-connections-alarm-${var.environment}"
  })
}
