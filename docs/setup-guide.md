# Setup and Deployment Guide (AWS)

Follow this guide to manually deploy the entire infrastructure and data platform stack to Amazon Web Services (AWS).

## Prerequisites
- AWS CLI installed and configured (`aws configure`)
- Terraform CLI installed (`v1.5.0+`)
- Helm CLI installed (`v3.0.0+`)
- kubectl CLI installed
- Active AWS account with Administrator Access

---

## Step 1: Deploy Infrastructure (Terraform)

Before deploying, make sure you set your remote state S3 bucket and DynamoDB locking table in `backend.tf`, or run with local state for testing by commenting out the `backend "s3"` block.

Choose the environment you want to build (e.g. `dev`):

```bash
cd infra/terraform/envs/dev
terraform init
terraform plan
terraform apply -auto-approve
```

Take note of the Terraform output values:
- `ecr_registry_url`
- `eks_cluster_name`
- `documentdb_endpoint`
- `rds_endpoint`
- `s3_datalake_bucket`

---

## Step 2: Build & Push Containers

Authenticate your local Docker daemon with Amazon ECR:

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <your-account-id>.dkr.ecr.us-east-1.amazonaws.com
```

Build and push the backend & frontend containers:

```bash
# Build backend
docker build -f docker/backend.Dockerfile -t <ecr_registry_url>/arcten-backend:latest ./backend
docker push <ecr_registry_url>/arcten-backend:latest

# Build frontend
docker build -f docker/frontend.Dockerfile --build-arg NEXT_PUBLIC_API_URL=http://<alb-ingress-dns-or-ip> -t <ecr_registry_url>/arcten-frontend:latest ./frontend
docker push <ecr_registry_url>/arcten-frontend:latest
```

---

## Step 3: Deploy to Kubernetes (EKS) using Helm

1. Get Kubernetes credentials for your EKS cluster:
   ```bash
   aws eks update-kubeconfig --region us-east-1 --name arcten-eks-dev
   ```

2. Deploy the application chart:
   ```bash
   cd helm
   
   helm upgrade --install arcten . \
     --namespace dev-ns \
     --create-namespace \
     -f values-dev.yaml \
     --set imageCredentials.registry="<ecr_registry_url>" \
     --set backend.image.tag="latest" \
     --set frontend.image.tag="latest" \
     --set secrets.mongodbUri="mongodb://sqladmin:<docdb-password>@<documentdb-endpoint>:27017/arcten?replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false" \
     --set secrets.jwtSecret="supersecretkey" \
     --set secrets.adminPassword="adminpassword123"
   ```

3. Verify deployment:
   ```bash
   kubectl get pods -n dev-ns
   kubectl get ingress -n dev-ns
   ```
