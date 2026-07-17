# ============================================================
# ARCTen — DocumentDB Module (AWS)
# Creates DocumentDB cluster (MongoDB-compatible)
# ============================================================

# ── Subnet Group ─────────────────────────────────────────────
resource "aws_docdb_subnet_group" "main" {
  name       = "${var.project}-docdb-subnet-${var.environment}"
  subnet_ids = var.private_subnet_ids

  tags = merge(var.tags, {
    Name = "${var.project}-docdb-subnet-${var.environment}"
  })
}

# ── Security Group ───────────────────────────────────────────
resource "aws_security_group" "docdb" {
  name_prefix = "${var.project}-docdb-"
  vpc_id      = var.vpc_id
  description = "Security group for DocumentDB cluster"

  ingress {
    from_port       = 27017
    to_port         = 27017
    protocol        = "tcp"
    security_groups = var.allowed_security_group_ids
    description     = "Allow MongoDB connections from EKS nodes"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "${var.project}-docdb-sg-${var.environment}"
  })
}

# ── Cluster Parameter Group ──────────────────────────────────
resource "aws_docdb_cluster_parameter_group" "main" {
  family      = "docdb5.0"
  name        = "${var.project}-docdb-params-${var.environment}"
  description = "ARCTen DocumentDB cluster parameter group"

  parameter {
    name  = "tls"
    value = "disabled"
  }

  tags = merge(var.tags, {
    Name = "${var.project}-docdb-params-${var.environment}"
  })
}

# ── DocumentDB Cluster ───────────────────────────────────────
resource "aws_docdb_cluster" "main" {
  cluster_identifier              = "${var.project}-docdb-${var.environment}"
  engine                          = "docdb"
  master_username                 = var.master_username
  master_password                 = var.master_password
  db_subnet_group_name            = aws_docdb_subnet_group.main.name
  vpc_security_group_ids          = [aws_security_group.docdb.id]
  db_cluster_parameter_group_name = aws_docdb_cluster_parameter_group.main.name
  backup_retention_period         = var.backup_retention_days
  preferred_backup_window         = "03:00-05:00"
  skip_final_snapshot             = var.environment == "dev" ? true : false
  final_snapshot_identifier       = var.environment == "prod" ? "${var.project}-docdb-final-snapshot" : null
  deletion_protection             = var.environment == "prod" ? true : false

  tags = merge(var.tags, {
    Name = "${var.project}-docdb-${var.environment}"
  })
}

# ── DocumentDB Instances ─────────────────────────────────────
resource "aws_docdb_cluster_instance" "main" {
  count              = var.instance_count
  identifier         = "${var.project}-docdb-${var.environment}-${count.index}"
  cluster_identifier = aws_docdb_cluster.main.id
  instance_class     = var.instance_class

  tags = merge(var.tags, {
    Name = "${var.project}-docdb-${var.environment}-${count.index}"
  })
}
