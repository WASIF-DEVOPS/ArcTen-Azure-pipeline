output "resource_group_name" {
  value = module.resource_group.name
}

output "acr_login_server" {
  value = module.acr.login_server
}

output "aks_cluster_name" {
  value = module.aks.cluster_name
}

output "cosmosdb_connection_string" {
  value     = module.cosmosdb.connection_string
  sensitive = true
}

output "storage_account_name" {
  value = module.storage_account.name
}

output "sql_server_fqdn" {
  value = module.sql_database.server_fqdn
}

output "sql_database_connection_string" {
  value     = module.sql_database.connection_string
  sensitive = true
}

output "data_factory_name" {
  value = module.data_factory.name
}

output "key_vault_uri" {
  value = module.key_vault.vault_uri
}
