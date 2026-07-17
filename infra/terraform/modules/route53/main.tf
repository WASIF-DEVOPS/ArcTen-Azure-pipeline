# ============================================================
# ARCTen — Route 53 Module (AWS)
# Provisions Route 53 Hosted Zone for public domain names
# ============================================================

resource "aws_route53_zone" "main" {
  name          = var.domain_name
  force_destroy = var.environment == "dev" ? true : false

  tags = merge(var.tags, {
    Name = "${var.project}-hosted-zone-${var.environment}"
  })
}
