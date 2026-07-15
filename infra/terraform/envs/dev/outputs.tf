# ============================================================
# ARCTen — Dev Environment Outputs
# ============================================================

output "eks_cluster_name" {
  description = "EKS cluster name"
  value       = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  description = "EKS cluster API endpoint"
  value       = module.eks.cluster_endpoint
}

output "ecr_registry_url" {
  description = "ECR registry URL"
  value       = module.ecr.registry_url
}

output "ecr_backend_url" {
  description = "ECR backend repository URL"
  value       = module.ecr.backend_repository_url
}

output "ecr_frontend_url" {
  description = "ECR frontend repository URL"
  value       = module.ecr.frontend_repository_url
}

output "documentdb_endpoint" {
  description = "DocumentDB cluster endpoint"
  value       = module.documentdb.cluster_endpoint
}

output "rds_endpoint" {
  description = "RDS SQL Server endpoint"
  value       = module.rds.endpoint
}

output "s3_datalake_bucket" {
  description = "S3 data lake bucket name"
  value       = module.s3.bucket_id
}
