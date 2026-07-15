# ============================================================
# Secrets Manager Module — Outputs
# ============================================================

output "mongodb_uri_arn" {
  description = "ARN of the MongoDB URI secret"
  value       = aws_secretsmanager_secret.mongodb_uri.arn
}

output "jwt_secret_arn" {
  description = "ARN of the JWT secret"
  value       = aws_secretsmanager_secret.jwt_secret.arn
}

output "admin_password_arn" {
  description = "ARN of the admin password secret"
  value       = aws_secretsmanager_secret.admin_password.arn
}

output "rds_password_arn" {
  description = "ARN of the RDS password secret"
  value       = aws_secretsmanager_secret.rds_password.arn
}
