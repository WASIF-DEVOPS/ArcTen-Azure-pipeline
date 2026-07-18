# 🏗️ ARCTen — AWS Architecture Document

> **Project**: ARCTen B2B Leather Manufacturing Cloud Data Platform  
> **Version**: 2.0 — AWS Architecture  
> **Date**: July 2026  
> **Cloud Provider**: Amazon Web Services (AWS)

---

## 1. High-Level Architecture

```
                                    ┌─────────────────────────────────────────────────────┐
                                    │             AWS DATA PLATFORM                        │
                                    │                                                      │
                                    │  ┌──────────────┐  Python    ┌───────────────────┐   │
                                    │  │ DocumentDB   │ ────────►  │ Amazon S3         │   │
                                    │  │ (MongoDB 5.0)│ (boto3)    │ (Data Lake - Raw) │   │
                                    │  └──────────────┘            └─────────┬─────────┘   │
                                    │                                        │              │
                                    │                                        │ AWS Glue     │
                                    │                                        ▼              │
 ┌────────────┐                     │  ┌──────────────┐  Star      ┌───────────────────┐   │
 │  Users     │                     │  │  Power BI    │ ◄───────── │ Amazon RDS        │   │
 │  & Clients │                     │  │  Dashboard   │  Schema    │ (SQL Server DW)   │   │
 └──────┬─────┘                     │  └──────────────┘            └───────────────────┘   │
        │                           └─────────────────────────────────────────────────────────┘
        │  Ingress (NGINX / ALB)
        ▼
 ┌──────────────────────────────────────────────────────────────────────────────────────────┐
 │                            AMAZON EKS CLUSTER                                            │
 │                         (VPC: 10.0.0.0/16)                                               │
 │                                                                                          │
 │   ┌─────────────────────────────────┐      ┌─────────────────────────────────┐           │
 │   │       dev-ns (Namespace)        │      │       prod-ns (Namespace)       │           │
 │   │  ┌───────────┐  ┌───────────┐   │      │  ┌───────────┐  ┌───────────┐   │           │
 │   │  │ Frontend  │  │ Backend   │   │      │  │ Frontend  │  │ Backend   │   │           │
 │   │  │ (1 Pod)   │  │ (1 Pod)   │   │      │  │ (2 Pods)  │  │ (3 Pods)  │   │           │
 │   │  └───────────┘  └───────────┘   │      │  └───────────┘  └───────────┘   │           │
 │   └─────────────────────────────────┘      └─────────────────────────────────┘           │
 │                                                                                          │
 │   ┌──────────────────────────────────────────────────────────────────────────┐           │
 │   │                    monitoring-ns (Namespace)                             │           │
 │   │             Prometheus  ←→  Grafana  ←→  Alertmanager                    │           │
 │   └──────────────────────────────────────────────────────────────────────────┘           │
 └──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. AWS Service Architecture Map

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AWS ACCOUNT                                     │
│                                                                        │
│  ┌─── VPC (10.0.0.0/16) ────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  ┌── Public Subnets ──────────────────────────────────────────┐   │ │
│  │  │  us-east-1a: 10.0.1.0/24    us-east-1b: 10.0.2.0/24      │   │ │
│  │  │  ┌─────────────┐            ┌─────────────┐               │   │ │
│  │  │  │ NAT Gateway │            │ ALB / NGINX │               │   │ │
│  │  │  │             │            │ (Ingress)   │               │   │ │
│  │  │  └─────────────┘            └─────────────┘               │   │ │
│  │  └────────────────────────────────────────────────────────────┘   │ │
│  │                                                                    │ │
│  │  ┌── Private Subnets ─────────────────────────────────────────┐   │ │
│  │  │  us-east-1a: 10.0.10.0/24   us-east-1b: 10.0.20.0/24     │   │ │
│  │  │                                                             │   │ │
│  │  │  ┌────────────────┐  ┌──────────────┐  ┌───────────────┐  │   │ │
│  │  │  │  EKS Nodes     │  │ DocumentDB   │  │  RDS SQL      │  │   │ │
│  │  │  │  (t3.medium/   │  │ Cluster      │  │  Server       │  │   │ │
│  │  │  │   t3.large)    │  │ (MongoDB)    │  │  (Warehouse)  │  │   │ │
│  │  │  └────────────────┘  └──────────────┘  └───────────────┘  │   │ │
│  │  └────────────────────────────────────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│  ┌── Serverless / Managed Services (outside VPC) ──────────────────┐  │
│  │                                                                   │  │
│  │  ┌───────────┐  ┌───────────────┐  ┌───────────────────────┐    │  │
│  │  │ Amazon    │  │ Amazon S3     │  │ AWS Secrets Manager   │    │  │
│  │  │ ECR       │  │ (Data Lake)   │  │ (MongoDB URI, JWT,    │    │  │
│  │  │ (Images)  │  │               │  │  Admin Creds)         │    │  │
│  │  └───────────┘  └───────────────┘  └───────────────────────┘    │  │
│  │                                                                   │  │
│  │  ┌───────────┐  ┌───────────────┐  ┌───────────────────────┐    │  │
│  │  │ AWS Glue  │  │ CloudWatch    │  │ S3 + DynamoDB         │    │  │
│  │  │ (ETL)     │  │ (Logs/Alarms) │  │ (Terraform State)     │    │  │
│  │  └───────────┘  └───────────────┘  └───────────────────────┘    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Architecture (Deep Dive)

### 3.1 Network Architecture (VPC)

```
VPC: 10.0.0.0/16
│
├── Public Subnet AZ-a: 10.0.1.0/24
│   ├── Internet Gateway (IGW)
│   ├── NAT Gateway
│   └── ALB / NGINX Ingress Controller
│
├── Public Subnet AZ-b: 10.0.2.0/24
│   └── (Redundancy for ALB)
│
├── Private Subnet AZ-a: 10.0.10.0/24
│   ├── EKS Worker Nodes (Node Group)
│   ├── DocumentDB Instance (Primary)
│   └── RDS SQL Server Instance (Primary)
│
└── Private Subnet AZ-b: 10.0.20.0/24
    ├── EKS Worker Nodes (Node Group)
    ├── DocumentDB Instance (Replica — prod only)
    └── RDS SQL Server Instance (Standby — prod only)
```

**Key Decisions:**
- All databases in **private subnets** — no public internet access
- **NAT Gateway** in public subnet — allows private nodes to pull images from ECR
- **Multi-AZ** deployment for production high availability
- **Security Groups** restrict DB access to only the EKS node group CIDR

---

### 3.2 Kubernetes (EKS) Architecture

```
EKS Cluster
│
├── Node Group (Managed)
│   ├── Dev:  1-2 nodes × t3.medium (2 vCPU, 4GB)
│   └── Prod: 2-4 nodes × t3.large  (2 vCPU, 8GB)
│
├── Namespace: dev-ns
│   ├── Deployment: arcten-backend  (1 replica)
│   ├── Deployment: arcten-frontend (1 replica)
│   ├── Service: arcten-backend     (ClusterIP, port 5000)
│   ├── Service: arcten-frontend    (ClusterIP, port 3000)
│   ├── ConfigMap: arcten-config
│   ├── Secret: arcten-secrets
│   └── Ingress: arcten-ingress     (NGINX → path-based routing)
│
├── Namespace: prod-ns
│   ├── Deployment: arcten-backend  (3 replicas, HPA 1→5)
│   ├── Deployment: arcten-frontend (2 replicas)
│   ├── Service: arcten-backend     (ClusterIP, port 5000)
│   ├── Service: arcten-frontend    (ClusterIP, port 3000)
│   ├── ConfigMap: arcten-config
│   ├── Secret: arcten-secrets
│   ├── Ingress: arcten-ingress     (host: arcten.com)
│   └── HPA: arcten-backend-hpa    (target CPU: 70%)
│
└── Namespace: monitoring
    ├── Prometheus (kube-prometheus-stack)
    ├── Grafana (dashboards)
    └── Alertmanager
```

**Ingress Routing Rules:**
```
arcten.com/api/*   →  arcten-backend:5000
arcten.com/*       →  arcten-frontend:3000
```

**IAM Integration:**
- EKS Cluster Role: `arn:aws:iam::role/arcten-eks-cluster-role`
- Node Group Role: `arn:aws:iam::role/arcten-eks-node-role`
  - Policies: `AmazonEKSWorkerNodePolicy`, `AmazonEKS_CNI_Policy`, `AmazonEC2ContainerRegistryReadOnly`

---

### 3.3 Database Architecture

#### DocumentDB (Application Database)
```
DocumentDB Cluster: arcten-docdb-{env}
├── Engine: MongoDB 5.0 compatible
├── Instance Class: db.t3.medium (dev) / db.r5.large (prod)
├── Instances:
│   ├── Primary (AZ-a)
│   └── Replica (AZ-b) — prod only
├── Subnet Group: arcten-docdb-subnet-group (private subnets)
├── Security Group: Allow port 27017 from EKS nodes only
└── Connection: mongodb://<user>:<pass>@<cluster-endpoint>:27017/arcten?tls=true&replicaSet=rs0
```

**Collections:**
- `quoterequests` — Customer quote submissions
- `products` — Product catalog (if dynamic)

#### RDS SQL Server (Data Warehouse)
```
RDS Instance: arcten-dw-{env}
├── Engine: SQL Server Express (dev) / SQL Server Standard (prod)
├── Instance Class: db.t3.small (dev) / db.r5.large (prod)
├── Storage: 20GB (dev) / 100GB (prod)
├── Multi-AZ: No (dev) / Yes (prod)
├── Database: arctendw
├── Subnet Group: arcten-rds-subnet-group (private subnets)
└── Security Group: Allow port 1433 from EKS nodes + Power BI IP
```

**Schema:**
```
arctendw
├── stg (Staging Schema)
│   ├── stg.quotes      — Raw quote data from DocumentDB
│   └── stg.products    — Raw product catalog
├── dw (Data Warehouse Schema)
│   ├── dw.dim_company          — Company dimension
│   ├── dw.dim_product_interest — Product category dimension
│   ├── dw.dim_date             — Date dimension
│   ├── dw.fact_quotes          — Quote transactions fact table
│   ├── dw.vw_quote_funnel      — Sales funnel view
│   ├── dw.vw_monthly_pipeline  — Monthly pipeline trend view
│   └── dw.vw_product_demand    — Product demand analysis view
```

---

### 3.4 Data Lake & ETL Architecture

```
                    ┌───────────────┐
                    │  DocumentDB   │
                    │  (MongoDB)    │
                    └───────┬───────┘
                            │
                    ┌───────▼───────┐
                    │ Python Script │  export-quotes-to-lake.py
                    │ (boto3 → S3)  │  export-products-to-lake.py
                    └───────┬───────┘
                            │
              ┌─────────────▼─────────────┐
              │      Amazon S3            │
              │  Bucket: arcten-datalake  │
              │                           │
              │  raw/                     │
              │  ├── quotes/              │
              │  │   └── 2026/07/         │
              │  │       └── quotes.csv   │
              │  └── products/            │
              │      └── products.csv     │
              └─────────────┬─────────────┘
                            │
                    ┌───────▼───────┐
                    │   AWS Glue    │  glue_s3_to_rds.py
                    │   ETL Job     │  (PySpark)
                    └───────┬───────┘
                            │
              ┌─────────────▼─────────────┐
              │      Amazon RDS           │
              │  (SQL Server — DW)        │
              │                           │
              │  stg.quotes  ──┐          │
              │  stg.products  │  SQL     │
              │                │  Scripts │
              │  dw.dim_*  ◄───┘          │
              │  dw.fact_*                │
              │  dw.vw_*  ──► Power BI    │
              └───────────────────────────┘
```

---

### 3.5 CI/CD Pipeline Architecture (GitHub Actions)

```
Developer
    │
    ├── Push to 'develop' branch
    │   │
    │   ▼
    │   ┌──────────────────────────────────────────────────────────┐
    │   │  GitHub Actions: app-pipeline.yml                        │
    │   │                                                          │
    │   │  Stage 1: BUILD                                          │
    │   │  ├── Login to ECR                                        │
    │   │  ├── Build backend Docker image (multi-stage)            │
    │   │  ├── Build frontend Docker image (multi-stage)           │
    │   │  ├── Tag with commit SHA + "latest"                      │
    │   │  └── Push both images to ECR                             │
    │   │                                                          │
    │   │  Stage 2: DEPLOY TO DEV                                  │
    │   │  ├── aws eks update-kubeconfig --name aks-arcten-dev     │
    │   │  └── helm upgrade --install arcten ./helm -f values-dev  │
    │   └──────────────────────────────────────────────────────────┘
    │
    └── Push to 'main' branch
        │
        ▼
        ┌──────────────────────────────────────────────────────────┐
        │  GitHub Actions: app-pipeline.yml                        │
        │                                                          │
        │  Stage 1: BUILD (same as above)                          │
        │                                                          │
        │  Stage 2: DEPLOY TO PROD                                 │
        │  ├── ⏸️  Manual Approval (GitHub Environment reviewers)   │
        │  ├── aws eks update-kubeconfig --name aks-arcten-prod    │
        │  └── helm upgrade --install arcten ./helm -f values-prod │
        └──────────────────────────────────────────────────────────┘
```

**Infrastructure Pipeline:**
```
Push to infra/terraform/**
    │
    ▼
┌──────────────────────────────────────┐
│  GitHub Actions: infra-pipeline.yml  │
│                                      │
│  1. terraform init (S3 backend)      │
│  2. terraform validate               │
│  3. terraform plan → output as PR    │
│  4. ⏸️  Manual Approval               │
│  5. terraform apply                  │
└──────────────────────────────────────┘
```

---

### 3.6 Secrets Architecture

```
AWS Secrets Manager
│
├── arcten/dev/mongodb-uri        → mongodb://user:pass@docdb-dev:27017/arcten
├── arcten/dev/jwt-secret         → <random-256bit>
├── arcten/dev/admin-password     → <admin-pass-dev>
│
├── arcten/prod/mongodb-uri       → mongodb://user:pass@docdb-prod:27017/arcten
├── arcten/prod/jwt-secret        → <random-256bit>
├── arcten/prod/admin-password    → <admin-pass-prod>
│
└── arcten/prod/rds-password      → <sql-admin-password>
```

**Flow:**
```
Secrets Manager → Terraform reads at plan time → Injects into Helm --set values
                                                → K8s Secrets in pods → env vars
```

---

### 3.7 Monitoring & Alerting Architecture

```
┌── In-Cluster (Kubernetes) ────────────────────────────────────────────┐
│                                                                        │
│  Prometheus ──scrape──► EKS Pods (metrics endpoint)                    │
│      │                  EKS Nodes (node-exporter)                      │
│      │                  kube-state-metrics                              │
│      │                                                                  │
│      └──────────► Grafana Dashboards                                   │
│                   ├── API Request Rate                                  │
│                   ├── Pod CPU/Memory                                    │
│                   ├── Response Latency (p99)                            │
│                   └── Node Health                                      │
│                                                                        │
│  Alertmanager ──► Email alerts (high latency, pod restarts)            │
└────────────────────────────────────────────────────────────────────────┘

┌── AWS-Native Monitoring ──────────────────────────────────────────────┐
│                                                                        │
│  CloudWatch Alarms                                                     │
│  ├── EKS Node CPU > 80%  ──► SNS Topic ──► admin@arcten.com          │
│  ├── RDS CPU > 90%        ──► SNS Topic ──► admin@arcten.com          │
│  └── DocumentDB Connections > threshold ──► SNS Topic                  │
│                                                                        │
│  CloudWatch Logs                                                       │
│  ├── /aws/eks/arcten-{env}/cluster                                     │
│  └── /aws/rds/arcten-dw-{env}                                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Terraform Module Architecture

```
infra/terraform/
│
├── modules/                              ← Reusable AWS modules
│   ├── vpc/                              ← NEW (AWS requires explicit VPC)
│   │   ├── main.tf                       VPC, Subnets, IGW, NAT, Route Tables
│   │   ├── variables.tf                  vpc_cidr, public/private subnet CIDRs, AZs
│   │   └── outputs.tf                    vpc_id, subnet_ids, security_group_ids
│   │
│   ├── iam/                              ← NEW (EKS requires IAM roles)
│   │   ├── main.tf                       EKS Cluster Role, Node Group Role, Policies
│   │   ├── variables.tf                  cluster_name, tags
│   │   └── outputs.tf                    role ARNs
│   │
│   ├── eks/                              ← Replaces aks/
│   │   ├── main.tf                       aws_eks_cluster, aws_eks_node_group
│   │   ├── variables.tf                  cluster_name, node_instance_type, node_count
│   │   └── outputs.tf                    cluster_endpoint, cluster_ca, oidc_url
│   │
│   ├── ecr/                              ← Replaces acr/
│   │   ├── main.tf                       aws_ecr_repository × 2 (frontend + backend)
│   │   ├── variables.tf                  repository_names
│   │   └── outputs.tf                    repository_urls
│   │
│   ├── documentdb/                       ← Replaces cosmosdb/
│   │   ├── main.tf                       aws_docdb_cluster, aws_docdb_cluster_instance
│   │   ├── variables.tf                  instance_class, instance_count, master_password
│   │   └── outputs.tf                    cluster_endpoint, connection_string
│   │
│   ├── s3/                               ← Replaces storage_account/
│   │   ├── main.tf                       aws_s3_bucket, versioning, lifecycle
│   │   ├── variables.tf                  bucket_name
│   │   └── outputs.tf                    bucket_arn, bucket_name
│   │
│   ├── rds/                              ← Replaces sql_database/
│   │   ├── main.tf                       aws_db_instance (SQL Server)
│   │   ├── variables.tf                  instance_class, storage, engine, multi_az
│   │   └── outputs.tf                    endpoint, port, database_name
│   │
│   ├── glue/                             ← Replaces data_factory/
│   │   ├── main.tf                       aws_glue_catalog_database, aws_glue_job
│   │   ├── variables.tf                  job_names, s3_script_location
│   │   └── outputs.tf                    job_names, catalog_db_name
│   │
│   ├── secrets_manager/                  ← Replaces key_vault/
│   │   ├── main.tf                       aws_secretsmanager_secret + versions
│   │   ├── variables.tf                  secret_names, secret_values
│   │   └── outputs.tf                    secret_arns
│   │
│   └── cloudwatch/                       ← Replaces monitor/
│       ├── main.tf                       aws_cloudwatch_log_group, metric_alarm, SNS
│       ├── variables.tf                  alarm_thresholds, email
│       └── outputs.tf                    log_group_arn, sns_topic_arn
│
├── envs/
│   ├── dev/
│   │   ├── providers.tf                  aws provider, region = us-east-1
│   │   ├── backend.tf                    S3 + DynamoDB state backend
│   │   ├── main.tf                       Module calls with dev-sized variables
│   │   ├── variables.tf                  Variable declarations
│   │   ├── terraform.tfvars              Dev-specific values
│   │   └── outputs.tf                    Key outputs
│   │
│   └── prod/
│       ├── providers.tf                  aws provider, region = us-east-1
│       ├── backend.tf                    S3 + DynamoDB state backend (separate key)
│       ├── main.tf                       Module calls with prod-sized variables
│       ├── variables.tf                  Variable declarations
│       ├── terraform.tfvars              Prod-specific values
│       └── outputs.tf                    Key outputs
```

---

## 5. Repository Structure

```
ArcTen/
├── backend/                          ← Express.js API
├── frontend/                         ← Next.js 14 Web Portal
│
├── docker/                           ← Deployment Container configurations
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   └── docker-compose.yml
│
├── infra/terraform/                  ← Infrastructure as Code (AWS provider)
│   ├── modules/
│   │   ├── vpc/                      ← VPC Networking
│   │   ├── iam/                      ← IAM Roles and Permissions
│   │   ├── eks/                      ← EKS Cluster
│   │   ├── ecr/                      ← Elastic Container Registry
│   │   ├── documentdb/               ← DocumentDB (MongoDB)
│   │   ├── s3/                       ← S3 Buckets
│   │   ├── rds/                      ← RDS SQL Server
│   │   ├── glue/                     ← AWS Glue ETL
│   │   ├── secrets_manager/          ← AWS Secrets Manager
│   │   └── cloudwatch/               ← CloudWatch Logging & Alarms
│   └── envs/
│       ├── dev/                      ← Dev Env Workspace
│       └── prod/                     ← Prod Env Workspace
│
├── helm/                             ← Helm Deployment Configs
│   ├── templates/
│   ├── values.yaml
│   ├── values-dev.yaml
│   └── values-prod.yaml
│
├── .github/workflows/                ← GitHub Actions Pipelines
│   ├── app-pipeline.yml              ← Build + Deploy (GitHub Actions)
│   ├── infra-pipeline.yml            ← Terraform plan/apply
│   └── data-pipeline.yml             ← Data ETL trigger
│
├── data/                             ← Data Engineering Layer
│   ├── ingestion/                    ← Python Data Ingestion Scripts
│   │   ├── export-quotes-to-lake.py
│   │   ├── export-products-to-lake.py
│   │   └── requirements.txt
│   ├── glue-jobs/                    ← AWS Glue ETL Job Scripts
│   │   ├── glue_docdb_to_rds.py
│   │   └── glue_s3_to_rds.py
│   ├── databricks/                   ← Databricks Configs
│   └── processing/sql/               ← Warehouse SQL Star Schema DDL/Views
│
├── monitoring/                       ← Observability
│   ├── prometheus/                   ← In-cluster Prometheus metrics values
│   ├── grafana/dashboards/           ← Grafana custom dashboards
│   └── alerts/
│       └── cloudwatch-alarms.tf      ← CloudWatch Infrastructure alerts
│
├── powerbi/                          ← Power BI reporting instructions
│
└── docs/                             ← Documentation
    ├── pr.md                         ← Platform Requirements
    ├── architecture.md               ← This document
    └── setup-guide.md                ← Setup & Deployment instructions
```

---

## 6. Security Architecture

```
┌── Secrets Flow ─────────────────────────────────────────────────────┐
│                                                                      │
│  AWS Secrets Manager                                                 │
│  ├── arcten/{env}/mongodb-uri                                        │
│  ├── arcten/{env}/jwt-secret                                         │
│  └── arcten/{env}/admin-password                                     │
│       │                                                              │
│       ▼                                                              │
│  Terraform reads secrets ──► Passes to Helm via --set               │
│       │                                                              │
│       ▼                                                              │
│  Kubernetes Secrets (base64 encoded in etcd)                         │
│       │                                                              │
│       ▼                                                              │
│  Pod env vars (MONGODB_URI, JWT_SECRET, ADMIN_PASSWORD)              │
│                                                                      │
│  ✅ Zero secrets in Git                                              │
│  ✅ Zero secrets in Docker images                                    │
│  ✅ Zero secrets in Terraform state (marked sensitive)               │
└──────────────────────────────────────────────────────────────────────┘

┌── Network Security ─────────────────────────────────────────────────┐
│                                                                      │
│  Security Groups:                                                    │
│  ├── sg-eks-nodes    → Allow all outbound, inbound from ALB only    │
│  ├── sg-documentdb   → Allow port 27017 from sg-eks-nodes ONLY      │
│  ├── sg-rds          → Allow port 1433 from sg-eks-nodes + BI IP    │
│  └── sg-alb          → Allow port 80/443 from 0.0.0.0/0 (public)   │
│                                                                      │
│  ✅ Databases NOT publicly accessible                                │
│  ✅ EKS API server — public endpoint with CIDR restriction           │
│  ✅ All traffic within VPC stays within VPC                          │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 7. Cost Estimation (Estimated Monthly)

| Resource | AWS Resource Type | Est. Monthly Cost (Dev) | Est. Monthly Cost (Prod) |
|----------|-------------------|------------------------|------------------------|
| Kubernetes Control Plane | Amazon EKS | ~$73 | ~$73 |
| EKS Worker Nodes | EC2 Instances (t3.micro / t3.large) | ~$30 (2 nodes) | ~$240 (4 nodes) |
| Container Registry | Amazon ECR | ~$2 | ~$15 |
| Document Database | In-Cluster MongoDB (Dev) / DocumentDB (Prod) | $0.00 | ~$400 |
| Data Lake Storage | Amazon S3 | ~$2 | ~$10 |
| Relational Warehouse | RDS SQL Server Express | ~$15 | ~$200 |
| ETL Ingestion | GitHub Actions Runner (Dev) / Glue (Prod) | $0.00 | ~$20 |
| Secret Management | AWS Secrets Manager | ~$2 | ~$2 |
| Monitoring | CloudWatch Metric Alarms | ~$10 | ~$30 |
| **TOTAL** | | **~$134/mo** | **~$990/mo** |

> These are estimates — actual costs depend on usage patterns and reserved instances.

---

## 8. Deployment Execution Order

```
Phase 1 ──► Terraform Modules        (Core networking & IAM infrastructure)
    │
Phase 2 ──► Terraform Environments   (Initialize dev and prod workspaces)
    │
Phase 3 ──► CI/CD Pipeline Setup     (Configure GitHub Actions workflow)
    │
Phase 4 ──► Data Ingestion Scripts   (Deploy ingestion scripts)
    │
Phase 5 ──► ETL Pipeline Ingestion   (Load datalake state to RDS)
    │
Phase 6 ──► Monitoring Alarms        (Provision CloudWatch alarms)
    │
Phase 7 ──► Application Deploy       (Execute Helm upgrade to EKS)
```
