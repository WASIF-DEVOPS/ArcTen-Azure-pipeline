# ============================================================
# ARCTen — Prod Environment Provider Configuration
# ============================================================

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "arcten"
      Environment = "prod"
      ManagedBy   = "terraform"
    }
  }
}
