#!/bin/bash
set -e

echo "1. Retrieving EKS OIDC details..."
OIDC_ID=$(aws eks describe-cluster \
  --name arcten-eks-dev \
  --region us-east-1 \
  --query "cluster.identity.oidc.issuer" \
  --output text | sed -e "s/^https:\/\///")

echo "OIDC Provider found: $OIDC_ID"

echo "2. Writing IAM trust policy to /tmp/ebs-csi-trust.json..."
cat > /tmp/ebs-csi-trust.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::311816465554:oidc-provider/${OIDC_ID}"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "${OIDC_ID}:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "${OIDC_ID}:sub": [
            "system:serviceaccount:kube-system:ebs-csi-controller-sa",
            "system:serviceaccount:kube-system:aws-ebs-csi-driver-controller"
          ]
        }
      }
    }
  ]
}
EOF

echo "3. Updating IAM Role trust policy in AWS..."
aws iam update-assume-role-policy \
  --role-name arcten-ebs-csi-role-dev \
  --policy-document file:///tmp/ebs-csi-trust.json

echo "3b. Attaching AmazonEBSCSIDriverPolicy to the role..."
aws iam attach-role-policy \
  --role-name arcten-ebs-csi-role-dev \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy

echo "4. Restarting the EBS CSI Controller deployment..."
kubectl rollout restart deployment/ebs-csi-controller -n kube-system

echo "SUCCESS! Watch the pods now: kubectl get pods -n kube-system | grep ebs"

