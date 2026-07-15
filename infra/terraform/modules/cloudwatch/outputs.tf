# ============================================================
# CloudWatch Module — Outputs
# ============================================================

output "sns_topic_arn" {
  description = "ARN of the SNS topic for alerts"
  value       = aws_sns_topic.alerts.arn
}

output "eks_log_group_name" {
  description = "Name of the EKS CloudWatch log group"
  value       = aws_cloudwatch_log_group.eks.name
}

output "application_log_group_name" {
  description = "Name of the application CloudWatch log group"
  value       = aws_cloudwatch_log_group.application.name
}
