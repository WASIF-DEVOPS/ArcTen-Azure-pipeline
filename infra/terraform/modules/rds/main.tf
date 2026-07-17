# ============================================================
# ARCTen — RDS Module (AWS)
# Creates RDS SQL Server instance for Data Warehouse
# ============================================================

# ── Subnet Group ─────────────────────────────────────────────
resource "aws_db_subnet_group" "main" {
  name       = "${var.project}-rds-subnet-${var.environment}"
  subnet_ids = var.private_subnet_ids

  tags = merge(var.tags, {
    Name = "${var.project}-rds-subnet-${var.environment}"
  })
}

# ── Security Group ───────────────────────────────────────────
resource "aws_security_group" "rds" {
  name_prefix = "${var.project}-rds-"
  vpc_id      = var.vpc_id
  description = "Security group for RDS SQL Server"

  ingress {
    from_port       = 1433
    to_port         = 1433
    protocol        = "tcp"
    security_groups = var.allowed_security_group_ids
    description     = "Allow SQL Server connections from EKS nodes"
  }

  # Allow Power BI connections (if needed)
  dynamic "ingress" {
    for_each = length(var.powerbi_cidr_blocks) > 0 ? [1] : []
    content {
      from_port   = 1433
      to_port     = 1433
      protocol    = "tcp"
      cidr_blocks = var.powerbi_cidr_blocks
      description = "Allow SQL Server connections from Power BI"
    }
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "${var.project}-rds-sg-${var.environment}"
  })
}

# ── RDS Instance ─────────────────────────────────────────────
resource "aws_db_instance" "main" {
  identifier = "${var.project}-dw-${var.environment}"

  # Engine
  engine         = "sqlserver-ex"
  engine_version = var.engine_version
  license_model  = "license-included"

  # Sizing
  instance_class        = var.instance_class
  allocated_storage     = var.allocated_storage
  max_allocated_storage = var.max_allocated_storage
  storage_type          = "gp3"
  storage_encrypted     = true

  # Credentials
  username = var.admin_username
  password = var.admin_password

  # Network
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false
  multi_az               = var.multi_az

  # Backups
  backup_retention_period = var.backup_retention_days
  backup_window           = "03:00-05:00"
  maintenance_window      = "Mon:05:00-Mon:07:00"

  # Deletion
  skip_final_snapshot       = var.environment == "dev" ? true : false
  final_snapshot_identifier = var.environment == "prod" ? "${var.project}-dw-final-snapshot" : null
  deletion_protection       = var.environment == "prod" ? true : false

  tags = merge(var.tags, {
    Name = "${var.project}-dw-${var.environment}"
  })
}
