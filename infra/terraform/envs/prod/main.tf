# ============================================================
# Prod Environment — Main Orchestrator
# ============================================================

locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# 1. Resource Group
module "resource_group" {
  source   = "../../modules/resource_group"
  name     = "rg-${var.project_name}-${var.environment}"
  location = var.location
  tags     = local.common_tags
}

# 2. Monitoring
module "monitor" {
  source              = "../../modules/monitor"
  workspace_name      = "log-${var.project_name}-${var.environment}-${var.unique_suffix}"
  insights_name       = "appi-${var.project_name}-${var.environment}-${var.unique_suffix}"
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  retention_in_days   = 90 # Extended retention for prod auditing
  tags                = local.common_tags
}

# 3. AKS (Kubernetes Cluster)
module "aks" {
  source                     = "../../modules/aks"
  cluster_name               = "aks-${var.project_name}-${var.environment}"
  dns_prefix                 = "aks-${var.project_name}-${var.environment}"
  resource_group_name        = module.resource_group.name
  location                   = module.resource_group.location
  log_analytics_workspace_id = module.monitor.workspace_id

  # Prod Capacity (Production scale)
  node_count = 3
  vm_size    = "Standard_D2s_v3"

  tags = local.common_tags
}

# 4. ACR (Container Registry)
module "acr" {
  source              = "../../modules/acr"
  name                = "${var.project_name}acr${var.unique_suffix}"
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  sku                 = "Standard" # Standard tier supports larger limits/features
  aks_principal_id    = module.aks.kubelet_identity_object_id
  tags                = local.common_tags
}

# 5. Cosmos DB (MongoDB API)
module "cosmosdb" {
  source              = "../../modules/cosmosdb"
  name                = "cosmos-${var.project_name}-${var.environment}-${var.unique_suffix}"
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  db_name             = "arcten"
  enable_free_tier    = false # Free tier not allowed on prod
  tags                = local.common_tags
}

# 6. Storage Account (ADLS Gen2 Data Lake)
module "storage_account" {
  source              = "../../modules/storage_account"
  name                = "stlake${var.project_name}${var.environment}${var.unique_suffix}"
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  replication_type    = "GRS" # Geo-Redundancy (Prod durability)
  tags                = local.common_tags
}

# 7. Azure SQL (Data Warehouse Sink)
module "sql_database" {
  source              = "../../modules/sql_database"
  server_name         = "sql-${var.project_name}-${var.environment}-${var.unique_suffix}"
  database_name       = "arctendw"
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  admin_username      = var.sql_admin_username
  admin_password      = var.sql_admin_password
  sku_name            = "GP_S_Gen5_2" # Production DW Serverless SKU (2 vCores)
  tags                = local.common_tags
}

# 8. Data Factory (ADF Pipeline Orchestrator)
module "data_factory" {
  source              = "../../modules/data_factory"
  name                = "adf-${var.project_name}-${var.environment}-${var.unique_suffix}"
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  tags                = local.common_tags
}

# 9. Key Vault (Secrets Management)
module "key_vault" {
  source              = "../../modules/key_vault"
  name                = "kv-${var.project_name}-${var.environment}-${var.unique_suffix}"
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  tags                = local.common_tags
}
