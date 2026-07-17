# ============================================================
# ARCTen — Secrets Manager Module (AWS)
# Creates secrets for application credentials
# ============================================================

# ── Consolidated Bootstrap Secret (used by GitHub Actions pipeline) ──
resource "aws_secretsmanager_secret" "bootstrap" {
  name                    = "${var.project}/${var.environment}/bootstrap-secrets"
  description             = "Consolidated JSON secret for ARCTen ${var.environment} — fetched by GitHub Actions"
  recovery_window_in_days = var.environment == "prod" ? 30 : 0

  tags = merge(var.tags, {
    Name = "${var.project}-bootstrap-secrets-${var.environment}"
  })
}

resource "aws_secretsmanager_secret_version" "bootstrap" {
  secret_id = aws_secretsmanager_secret.bootstrap.id
  secret_string = jsonencode({
    MONGODB_URI      = var.mongodb_uri
    MONGODB_PASSWORD = var.mongodb_password
    JWT_SECRET       = var.jwt_secret
    ADMIN_PASSWORD   = var.admin_password
    RDS_PASSWORD     = var.rds_password
    RDS_HOST         = var.rds_host
    DATALAKE_BUCKET   = var.datalake_bucket
  })
}

# ── Individual Secrets (for direct app code access) ──────────

resource "aws_secretsmanager_secret" "mongodb_uri" {
  name                    = "${var.project}/${var.environment}/mongodb-uri"
  description             = "DocumentDB connection string for ARCTen ${var.environment}"
  recovery_window_in_days = var.environment == "prod" ? 30 : 0

  tags = merge(var.tags, {
    Name = "${var.project}-mongodb-uri-${var.environment}"
  })
}

resource "aws_secretsmanager_secret_version" "mongodb_uri" {
  secret_id     = aws_secretsmanager_secret.mongodb_uri.id
  secret_string = var.mongodb_uri
}

resource "aws_secretsmanager_secret" "jwt_secret" {
  name                    = "${var.project}/${var.environment}/jwt-secret"
  description             = "JWT signing secret for ARCTen ${var.environment}"
  recovery_window_in_days = var.environment == "prod" ? 30 : 0

  tags = merge(var.tags, {
    Name = "${var.project}-jwt-secret-${var.environment}"
  })
}

resource "aws_secretsmanager_secret_version" "jwt_secret" {
  secret_id     = aws_secretsmanager_secret.jwt_secret.id
  secret_string = var.jwt_secret
}

resource "aws_secretsmanager_secret" "admin_password" {
  name                    = "${var.project}/${var.environment}/admin-password"
  description             = "Admin dashboard password for ARCTen ${var.environment}"
  recovery_window_in_days = var.environment == "prod" ? 30 : 0

  tags = merge(var.tags, {
    Name = "${var.project}-admin-password-${var.environment}"
  })
}

resource "aws_secretsmanager_secret_version" "admin_password" {
  secret_id     = aws_secretsmanager_secret.admin_password.id
  secret_string = var.admin_password
}

resource "aws_secretsmanager_secret" "rds_password" {
  name                    = "${var.project}/${var.environment}/rds-password"
  description             = "RDS SQL Server admin password for ARCTen ${var.environment}"
  recovery_window_in_days = var.environment == "prod" ? 30 : 0

  tags = merge(var.tags, {
    Name = "${var.project}-rds-password-${var.environment}"
  })
}

resource "aws_secretsmanager_secret_version" "rds_password" {
  secret_id     = aws_secretsmanager_secret.rds_password.id
  secret_string = var.rds_password
}

