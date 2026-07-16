# ============================================================
# ARCTen — Prod Environment Remote Backend (S3 Native Locking)
# Uses Terraform v1.10+ native S3 state locking
# No DynamoDB required — locking handled by S3 conditional writes
# ============================================================

terraform {
  backend "s3" {
    bucket       = "arcten-terraform-state-311816465554"
    key          = "prod/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true # Native S3 locking (Terraform >= 1.10, no DynamoDB needed)
  }
}
