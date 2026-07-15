# ============================================================
# ECR Module — Outputs
# ============================================================

output "backend_repository_url" {
  description = "URL of the backend ECR repository"
  value       = aws_ecr_repository.backend.repository_url
}

output "frontend_repository_url" {
  description = "URL of the frontend ECR repository"
  value       = aws_ecr_repository.frontend.repository_url
}

output "registry_id" {
  description = "The registry ID (AWS account ID)"
  value       = aws_ecr_repository.backend.registry_id
}

output "registry_url" {
  description = "The ECR registry URL (without repository name)"
  value       = split("/", aws_ecr_repository.backend.repository_url)[0]
}
