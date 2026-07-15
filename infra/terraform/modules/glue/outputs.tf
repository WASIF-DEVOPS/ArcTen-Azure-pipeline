# ============================================================
# Glue Module — Outputs
# ============================================================

output "catalog_database_name" {
  description = "Name of the Glue catalog database"
  value       = aws_glue_catalog_database.main.name
}

output "docdb_to_rds_job_name" {
  description = "Name of the DocumentDB to RDS Glue ETL job"
  value       = aws_glue_job.docdb_to_rds.name
}

output "s3_to_rds_job_name" {
  description = "Name of the S3 to RDS Glue ETL job"
  value       = aws_glue_job.s3_to_rds.name
}
