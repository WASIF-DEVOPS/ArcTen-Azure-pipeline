# ============================================================
# Prod Environment — Remote Backend Configuration
# ============================================================

terraform {
  backend "azurerm" {
    resource_group_name  = "rg-terraform-state"
    storage_account_name = "sttfstatewasif"
    container_name       = "tfstate-dataplatform"
    key                  = "prod.terraform.tfstate"
  }
}
