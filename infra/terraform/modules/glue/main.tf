# ============================================================
# ARCTen — Glue Module (AWS)
# Creates Glue catalog database and ETL jobs
# Replaces: Azure Data Factory
# ============================================================

# ── Glue Catalog Database ────────────────────────────────────
resource "aws_glue_catalog_database" "main" {
  name = "${var.project}_${var.environment}"

  description = "ARCTen data catalog for ${var.environment} environment"
}

# ── Glue ETL Job: DocumentDB → RDS ──────────────────────────
resource "aws_glue_job" "docdb_to_rds" {
  name     = "${var.project}-docdb-to-rds-${var.environment}"
  role_arn = var.glue_role_arn

  command {
    name            = "glueetl"
    script_location = "s3://${var.glue_scripts_bucket}/glue-jobs/glue_docdb_to_rds.py"
    python_version  = "3"
  }

  default_arguments = {
    "--job-language"               = "python"
    "--TempDir"                    = "s3://${var.glue_scripts_bucket}/tmp/"
    "--enable-continuous-cloudwatch-log" = "true"
    "--DOCDB_URI"                  = var.docdb_connection_string
    "--RDS_JDBC_URL"               = var.rds_jdbc_url
    "--RDS_USERNAME"               = var.rds_username
    "--RDS_PASSWORD"               = var.rds_password
  }

  max_retries       = 1
  timeout           = 60
  number_of_workers = 2
  worker_type       = "G.1X"
  glue_version      = "4.0"

  tags = merge(var.tags, {
    Name = "${var.project}-docdb-to-rds-${var.environment}"
  })
}

# ── Glue ETL Job: S3 → RDS ──────────────────────────────────
resource "aws_glue_job" "s3_to_rds" {
  name     = "${var.project}-s3-to-rds-${var.environment}"
  role_arn = var.glue_role_arn

  command {
    name            = "glueetl"
    script_location = "s3://${var.glue_scripts_bucket}/glue-jobs/glue_s3_to_rds.py"
    python_version  = "3"
  }

  default_arguments = {
    "--job-language"               = "python"
    "--TempDir"                    = "s3://${var.glue_scripts_bucket}/tmp/"
    "--enable-continuous-cloudwatch-log" = "true"
    "--S3_BUCKET"                  = var.datalake_bucket_name
    "--RDS_JDBC_URL"               = var.rds_jdbc_url
    "--RDS_USERNAME"               = var.rds_username
    "--RDS_PASSWORD"               = var.rds_password
  }

  max_retries       = 1
  timeout           = 60
  number_of_workers = 2
  worker_type       = "G.1X"
  glue_version      = "4.0"

  tags = merge(var.tags, {
    Name = "${var.project}-s3-to-rds-${var.environment}"
  })
}
