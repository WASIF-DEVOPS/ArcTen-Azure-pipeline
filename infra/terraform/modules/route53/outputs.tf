# ============================================================
# ARCTen — Route 53 Module Outputs
# ============================================================

output "zone_id" {
  description = "The Hosted Zone ID"
  value       = aws_route53_zone.main.zone_id
}

output "name_servers" {
  description = "The Name Servers to configure at your domain registrar"
  value       = aws_route53_zone.main.name_servers
}
