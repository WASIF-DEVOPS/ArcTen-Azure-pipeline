# ============================================================
# ARCTen — Dev Environment Remote Backend (S3 + DynamoDB)
# ============================================================

terraform {
  backend "s3" {
    bucket         = "arcten-terraform-state"
    key            = "dev/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "arcten-terraform-locks"
    encrypt        = true
  }
}
