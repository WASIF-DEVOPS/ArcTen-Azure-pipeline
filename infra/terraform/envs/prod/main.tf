# ============================================================
# ARCTen — Prod Environment Main Configuration
# Wires up all AWS modules with production-grade sizing
# ============================================================

locals {
  environment = "prod"
  project     = "arcten"
  common_tags = {
    Project     = local.project
    Environment = local.environment
  }
}

# ── 1. VPC ───────────────────────────────────────────────────
module "vpc" {
  source = "../../modules/vpc"

  project            = local.project
  environment        = local.environment
  vpc_cidr           = "10.0.0.0/16"
  public_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnet_cidrs = ["10.0.10.0/24", "10.0.20.0/24"]
  availability_zones   = ["${var.aws_region}a", "${var.aws_region}b"]
  tags                 = local.common_tags
}

# ── 2. IAM Roles ─────────────────────────────────────────────
module "iam" {
  source = "../../modules/iam"

  project             = local.project
  environment         = local.environment
  datalake_bucket_arn = module.s3.bucket_arn
  tags                = local.common_tags
}

# ── 3. EKS Cluster ──────────────────────────────────────────
module "eks" {
  source = "../../modules/eks"

  project            = local.project
  environment        = local.environment
  vpc_id             = module.vpc.vpc_id
  public_subnet_ids  = module.vpc.public_subnet_ids
  private_subnet_ids = module.vpc.private_subnet_ids
  cluster_role_arn   = module.iam.eks_cluster_role_arn
  node_role_arn      = module.iam.eks_node_role_arn

  # Prod sizing — larger nodes, more capacity
  kubernetes_version = "1.31"
  node_instance_type = "t3.large"
  node_desired_count = 2
  node_min_count     = 2
  node_max_count     = 4

  tags = local.common_tags
}

# ── 4. ECR Repositories ─────────────────────────────────────
module "ecr" {
  source = "../../modules/ecr"

  project              = local.project
  image_retention_count = 50
  force_delete          = false
  tags                  = local.common_tags
}

# ── 5. DocumentDB (MongoDB) — High Availability ─────────────
module "documentdb" {
  source = "../../modules/documentdb"

  project                    = local.project
  environment                = local.environment
  vpc_id                     = module.vpc.vpc_id
  private_subnet_ids         = module.vpc.private_subnet_ids
  allowed_security_group_ids = [module.eks.cluster_security_group_id]
  master_password            = var.docdb_master_password

  # Prod sizing — 2 instances for HA (Multi-AZ)
  instance_class        = "db.r5.large"
  instance_count        = 2
  backup_retention_days = 14

  tags = local.common_tags
}

# ── 6. S3 Data Lake ─────────────────────────────────────────
module "s3" {
  source = "../../modules/s3"

  project       = local.project
  environment   = local.environment
  unique_suffix = var.unique_suffix
  tags          = local.common_tags
}

# ── 7. RDS SQL Server (Data Warehouse) — High Availability ──
module "rds" {
  source = "../../modules/rds"

  project                    = local.project
  environment                = local.environment
  vpc_id                     = module.vpc.vpc_id
  private_subnet_ids         = module.vpc.private_subnet_ids
  allowed_security_group_ids = [module.eks.cluster_security_group_id]
  admin_password             = var.rds_admin_password

  # Prod sizing — larger instance, Multi-AZ
  instance_class        = "db.r5.large"
  allocated_storage     = 100
  max_allocated_storage = 500
  multi_az              = true
  backup_retention_days = 14

  tags = local.common_tags
}

# ── 8. AWS Glue (ETL) ───────────────────────────────────────
module "glue" {
  source = "../../modules/glue"

  project                 = local.project
  environment             = local.environment
  glue_role_arn           = module.iam.glue_role_arn
  glue_scripts_bucket     = module.s3.bucket_id
  datalake_bucket_name    = module.s3.bucket_id
  docdb_connection_string = module.documentdb.connection_string
  rds_jdbc_url            = "jdbc:sqlserver://${module.rds.endpoint};databaseName=arctendw"
  rds_username            = "sqladmin"
  rds_password            = var.rds_admin_password
  tags                    = local.common_tags
}

# ── 9. Secrets Manager ──────────────────────────────────────
module "secrets" {
  source = "../../modules/secrets_manager"

  project        = local.project
  environment    = local.environment
  mongodb_uri    = module.documentdb.connection_string
  jwt_secret     = var.jwt_secret
  admin_password = var.admin_password
  rds_password   = var.rds_admin_password
  tags           = local.common_tags
}

# ── 10. CloudWatch Monitoring ────────────────────────────────
module "cloudwatch" {
  source = "../../modules/cloudwatch"

  project                    = local.project
  environment                = local.environment
  alert_email                = "admin@arcten.com"
  log_retention_days         = 90
  cpu_alarm_threshold        = 80
  rds_cpu_alarm_threshold    = 85
  docdb_connections_threshold = 200
  tags                       = local.common_tags
}
