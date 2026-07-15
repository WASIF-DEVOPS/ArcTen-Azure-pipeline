# ============================================================
# DocumentDB Module — Outputs
# ============================================================

output "cluster_endpoint" {
  description = "Endpoint of the DocumentDB cluster"
  value       = aws_docdb_cluster.main.endpoint
}

output "cluster_reader_endpoint" {
  description = "Reader endpoint of the DocumentDB cluster"
  value       = aws_docdb_cluster.main.reader_endpoint
}

output "cluster_port" {
  description = "Port of the DocumentDB cluster"
  value       = aws_docdb_cluster.main.port
}

output "connection_string" {
  description = "MongoDB-compatible connection string for the application"
  value       = "mongodb://${var.master_username}:${var.master_password}@${aws_docdb_cluster.main.endpoint}:${aws_docdb_cluster.main.port}/arcten?replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false"
  sensitive   = true
}

output "security_group_id" {
  description = "Security group ID of the DocumentDB cluster"
  value       = aws_security_group.docdb.id
}
