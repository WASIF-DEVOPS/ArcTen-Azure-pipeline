# ============================================================
# ARCTen — EKS Module (AWS)
# Creates EKS cluster and managed node group
# ============================================================

# ── EKS Cluster Security Group ───────────────────────────────
resource "aws_security_group" "eks_cluster" {
  name_prefix = "${var.project}-eks-cluster-"
  vpc_id      = var.vpc_id
  description = "Security group for EKS cluster control plane"

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow HTTPS to Kubernetes API server"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = merge(var.tags, {
    Name = "${var.project}-eks-cluster-sg-${var.environment}"
  })
}

# ── EKS Cluster ──────────────────────────────────────────────
resource "aws_eks_cluster" "main" {
  name     = "${var.project}-eks-${var.environment}"
  role_arn = var.cluster_role_arn
  version  = var.kubernetes_version

  vpc_config {
    subnet_ids              = concat(var.public_subnet_ids, var.private_subnet_ids)
    security_group_ids      = [aws_security_group.eks_cluster.id]
    endpoint_public_access  = true
    endpoint_private_access = true
  }

  tags = merge(var.tags, {
    Name = "${var.project}-eks-${var.environment}"
  })
}

# ── EKS Managed Node Group ──────────────────────────────────
resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "${var.project}-nodes-${var.environment}"
  node_role_arn   = var.node_role_arn
  subnet_ids      = var.private_subnet_ids

  instance_types = [var.node_instance_type]
  capacity_type  = var.capacity_type

  scaling_config {
    desired_size = var.node_desired_count
    min_size     = var.node_min_count
    max_size     = var.node_max_count
  }

  update_config {
    max_unavailable = 1
  }

  labels = {
    environment = var.environment
  }

  tags = merge(var.tags, {
    Name = "${var.project}-nodes-${var.environment}"
  })
}

# ── OIDC Provider (for IRSA — IAM Roles for Service Accounts)
data "tls_certificate" "eks" {
  url = aws_eks_cluster.main.identity[0].oidc[0].issuer
}

resource "aws_iam_openid_connect_provider" "eks" {
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.eks.certificates[0].sha1_fingerprint]
  url             = aws_eks_cluster.main.identity[0].oidc[0].issuer

  tags = merge(var.tags, {
    Name = "${var.project}-eks-oidc-${var.environment}"
  })
}

# ── EKS Addons ────────────────────────────────────────────────
# depends_on ensures node group is ACTIVE before addon is installed.
# Without this the addon enters DEGRADED state because no nodes are ready.
resource "aws_eks_addon" "ebs_csi" {
  cluster_name             = aws_eks_cluster.main.name
  addon_name               = "aws-ebs-csi-driver"
  resolve_conflicts_on_create = "OVERWRITE"
  resolve_conflicts_on_update = "OVERWRITE"

  depends_on = [aws_eks_node_group.main]

  tags = merge(var.tags, {
    Name = "${var.project}-eks-ebs-csi-${var.environment}"
  })
}
