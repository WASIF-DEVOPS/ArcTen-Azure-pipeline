# ============================================================
# ARCTen — S3 Module (AWS)
# Creates S3 bucket for Data Lake storage
# Replaces: Azure Storage Account (ADLS Gen2)
# ============================================================

resource "aws_s3_bucket" "datalake" {
  bucket        = "${var.project}-datalake-${var.environment}-${var.unique_suffix}"
  force_destroy = var.environment == "dev" ? true : false

  tags = merge(var.tags, {
    Name = "${var.project}-datalake-${var.environment}"
  })
}

# ── Versioning ───────────────────────────────────────────────
resource "aws_s3_bucket_versioning" "datalake" {
  bucket = aws_s3_bucket.datalake.id

  versioning_configuration {
    status = var.environment == "prod" ? "Enabled" : "Suspended"
  }
}

# ── Server-Side Encryption ───────────────────────────────────
resource "aws_s3_bucket_server_side_encryption_configuration" "datalake" {
  bucket = aws_s3_bucket.datalake.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
    }
    bucket_key_enabled = true
  }
}

# ── Block Public Access ──────────────────────────────────────
resource "aws_s3_bucket_public_access_block" "datalake" {
  bucket = aws_s3_bucket.datalake.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ── Lifecycle Rules ──────────────────────────────────────────
resource "aws_s3_bucket_lifecycle_configuration" "datalake" {
  bucket = aws_s3_bucket.datalake.id

  rule {
    id     = "archive-old-raw-data"
    status = "Enabled"

    filter {
      prefix = "raw/"
    }

    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 365
      storage_class = "GLACIER"
    }
  }
}

# ── Create folder structure ──────────────────────────────────
resource "aws_s3_object" "raw_folder" {
  bucket  = aws_s3_bucket.datalake.id
  key     = "raw/"
  content = ""
}

resource "aws_s3_object" "processed_folder" {
  bucket  = aws_s3_bucket.datalake.id
  key     = "processed/"
  content = ""
}

resource "aws_s3_object" "curated_folder" {
  bucket  = aws_s3_bucket.datalake.id
  key     = "curated/"
  content = ""
}
