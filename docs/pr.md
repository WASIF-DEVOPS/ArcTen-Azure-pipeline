# 📋 ARCTen — Project Requirements Document (AWS Migration)

> **Project**: ARCTen B2B Leather Manufacturing Cloud Data Platform  
> **Version**: 2.0 — AWS Migration  
> **Date**: July 2026  
> **Previous Platform**: Microsoft Azure  
> **Target Platform**: Amazon Web Services (AWS)

---

## 1. Project Overview

### 1.1 Background
ARCTen is a B2B leather manufacturing company that produces leather jackets (men's & women's) and leather bags for wholesale buyers. The company currently operates a cloud-native e-commerce and data analytics platform built entirely on Microsoft Azure.

### 1.2 Migration Objective
The client has requested a **complete cloud migration from Azure to AWS** while maintaining all existing business functionality, application behavior, and operational standards.

### 1.3 Success Criteria
- Zero downtime for the application during migration
- All existing features work identically on AWS
- Infrastructure provisioned through Terraform (IaC)
- CI/CD pipelines fully automated on the new platform
- Data pipeline (ETL → Warehouse → BI) operational on AWS services
- Monitoring & alerting equivalent to current setup
- Security posture maintained (no hardcoded credentials)

---

## 2. Functional Requirements

### 2.1 Customer-Facing Website (Frontend)

| ID | Requirement | Priority | Status |
|----|------------|----------|--------|
| FR-01 | Product catalog page with filtering (Men's Jackets, Women's Jackets, Bags) | P0 | ✅ Exists — No change needed |
| FR-02 | Individual product detail pages with specs, images, and related products | P0 | ✅ Exists — No change needed |
| FR-03 | Manufacturing process showcase page | P1 | ✅ Exists — No change needed |
| FR-04 | Product gallery/showroom page | P1 | ✅ Exists — No change needed |
| FR-05 | Company about page | P2 | ✅ Exists — No change needed |
| FR-06 | Quote request form (Company Name, Email, Phone, Product Interest, Quantity, Notes) | P0 | ✅ Exists — No change needed |
| FR-07 | Responsive design across devices | P0 | ✅ Exists — No change needed |

> **Tech Stack**: Next.js 14 + TypeScript + Tailwind CSS — **No changes required**

### 2.2 Backend API Server

| ID | Requirement | Priority | Status |
|----|------------|----------|--------|
| FR-08 | Health check endpoint (`GET /api/health`) for K8s probes | P0 | ✅ Exists — No change needed |
| FR-09 | Public quote request submission (`POST /api/quote-request`) | P0 | ✅ Exists — No change needed |
| FR-10 | Email notification on new quote submission (SMTP/Nodemailer) | P1 | ✅ Exists — No change needed |
| FR-11 | Admin JWT authentication (`POST /api/admin/login`) | P0 | ✅ Exists — No change needed |
| FR-12 | Admin CRUD operations on quotes (list, view, update status, delete) | P0 | ✅ Exists — No change needed |
| FR-13 | Admin dashboard statistics (counts per status) | P1 | ✅ Exists — No change needed |
| FR-14 | Quote status lifecycle: `new → contacted → in-progress → quoted → closed` | P0 | ✅ Exists — No change needed |

> **Tech Stack**: Express.js + Mongoose + JWT + Nodemailer — **No changes required**

### 2.3 Admin Dashboard

| ID | Requirement | Priority | Status |
|----|------------|----------|--------|
| FR-15 | Secure login page for internal sales team | P0 | ✅ Exists — No change needed |
| FR-16 | View/search/filter all quote requests | P0 | ✅ Exists — No change needed |
| FR-17 | Update quote status through the pipeline | P0 | ✅ Exists — No change needed |
| FR-18 | Delete unwanted/spam quotes | P1 | ✅ Exists — No change needed |

---

## 3. Infrastructure Requirements (AWS Migration)

### 3.1 Compute & Container Orchestration

| ID | Requirement | Azure (Current) | AWS (Target) | Priority |
|----|------------|-----------------|-------------|----------|
| IR-01 | Managed Kubernetes cluster with dev/prod namespaces | AKS | **Amazon EKS** | P0 |
| IR-02 | Private container image registry | ACR | **Amazon ECR** | P0 |
| IR-03 | Auto-scaling (HPA) — 1→5 pods at 70% CPU | AKS HPA | **EKS HPA** (same K8s-native) | P0 |
| IR-04 | Ingress controller (NGINX) with path-based routing | AKS + NGINX | **EKS + NGINX** (or AWS ALB) | P0 |
| IR-05 | Network isolation — VPC with public/private subnets | Azure VNET (implicit) | **AWS VPC** (explicit — NEW) | P0 |
| IR-06 | IAM roles for Kubernetes service accounts | Azure Managed Identity | **IAM Roles for Service Accounts (IRSA)** — NEW | P0 |

### 3.2 Database & Storage

| ID | Requirement | Azure (Current) | AWS (Target) | Priority |
|----|------------|-----------------|-------------|----------|
| IR-07 | MongoDB-compatible document database for app data | Cosmos DB (MongoDB API) | **Amazon DocumentDB** | P0 |
| IR-08 | Data Lake storage (raw zone for ETL) | ADLS Gen2 | **Amazon S3** | P0 |
| IR-09 | SQL Data Warehouse for analytics (star schema) | Azure SQL Database | **Amazon RDS (SQL Server)** | P0 |

### 3.3 Data Engineering & ETL

| ID | Requirement | Azure (Current) | AWS (Target) | Priority |
|----|------------|-----------------|-------------|----------|
| IR-10 | ETL orchestration service | Azure Data Factory | **AWS Glue** | P1 |
| IR-11 | Python ingestion scripts (Cosmos/DocDB → Data Lake) | Azure ADLS SDK | **boto3 S3 SDK** | P1 |
| IR-12 | Optional PySpark transformation layer | Azure Databricks | **AWS Databricks / EMR** | P2 |

### 3.4 Security & Secrets

| ID | Requirement | Azure (Current) | AWS (Target) | Priority |
|----|------------|-----------------|-------------|----------|
| IR-13 | Centralized secrets management (DB URIs, JWT secrets, admin creds) | Azure Key Vault | **AWS Secrets Manager** | P0 |
| IR-14 | No credentials in source code or Docker images | ✅ Enforced | **Must maintain** | P0 |
| IR-15 | Terraform state stored remotely with locking | Azure Blob + Lease Lock | **S3 + DynamoDB Lock Table** | P0 |

### 3.5 Monitoring & Observability

| ID | Requirement | Azure (Current) | AWS (Target) | Priority |
|----|------------|-----------------|-------------|----------|
| IR-16 | Metrics collection (CPU, memory, pod health) | Prometheus (in-cluster) | **Prometheus (in-cluster)** — No change | P0 |
| IR-17 | Dashboard visualization | Grafana (in-cluster) | **Grafana (in-cluster)** — No change | P0 |
| IR-18 | Cloud-native metric alerts (node CPU, DB usage) | Azure Monitor Alerts | **CloudWatch Alarms + SNS** | P1 |
| IR-19 | Centralized log aggregation | Azure Log Analytics | **CloudWatch Logs** | P1 |

---

## 4. CI/CD Pipeline Requirements

| ID | Requirement | Azure (Current) | AWS (Target) | Priority |
|----|------------|-----------------|-------------|----------|
| CI-01 | Auto-trigger on code push to `main` / `develop` | Azure DevOps trigger | **GitHub Actions trigger** | P0 |
| CI-02 | Build Docker images (multi-stage) for frontend + backend | Docker@2 task | **docker/build-push-action** | P0 |
| CI-03 | Push images to container registry | Push to ACR | **Push to ECR** | P0 |
| CI-04 | Deploy to dev namespace on `develop` branch | HelmDeploy to dev-ns | **Helm upgrade to dev-ns via kubectl** | P0 |
| CI-05 | Deploy to prod namespace on `main` branch | HelmDeploy to prod-ns | **Helm upgrade to prod-ns via kubectl** | P0 |
| CI-06 | Manual approval gate before production deployment | Azure DevOps Environment gate | **GitHub Environment with required reviewers** | P0 |
| CI-07 | Infrastructure pipeline (Terraform plan/apply) | Azure DevOps (empty) | **GitHub Actions with Terraform** | P1 |
| CI-08 | Data pipeline trigger | Azure DevOps (empty) | **GitHub Actions** | P2 |

---

## 5. Data Analytics & BI Requirements

| ID | Requirement | Priority | Status |
|----|------------|----------|--------|
| DA-01 | Star schema warehouse: staging → dimensions → facts → views | P0 | ✅ SQL scripts exist — No change (using RDS SQL Server) |
| DA-02 | 3 analytical views: `vw_quote_funnel`, `vw_monthly_pipeline`, `vw_product_demand` | P0 | ✅ SQL exists — No change |
| DA-03 | Power BI dashboard connected to warehouse | P1 | 🟡 Connection config update (Azure SQL → RDS endpoint) |
| DA-04 | 5 DAX KPIs: Total Quotes, Pipeline Value, Conversion Rate, Avg Lead Value, MoM Growth | P1 | ✅ DAX exists — No change |

---

## 6. Environment Requirements

### 6.1 Development Environment (dev)

| Resource | Specification |
|----------|--------------|
| EKS Node Group | 1-2 nodes, `t3.medium` |
| Backend Pods | 1 replica |
| Frontend Pods | 1 replica |
| DocumentDB | `db.t3.medium`, 1 instance |
| RDS SQL Server | `db.t3.small`, 20GB |
| S3 Data Lake | Standard tier |

### 6.2 Production Environment (prod)

| Resource | Specification |
|----------|--------------|
| EKS Node Group | 2-4 nodes, `t3.large` |
| Backend Pods | 3 replicas (autoscale 1→5) |
| Frontend Pods | 2 replicas |
| DocumentDB | `db.r5.large`, 2 instances (multi-AZ) |
| RDS SQL Server | `db.r5.large`, 100GB, multi-AZ |
| S3 Data Lake | Standard + lifecycle policies |

---

## 7. Non-Functional Requirements

| ID | Requirement | Target |
|----|------------|--------|
| NF-01 | Application response time | < 500ms for API calls |
| NF-02 | Infrastructure provisioning | Fully automated via Terraform |
| NF-03 | Deployment frequency | On every push to main/develop |
| NF-04 | Recovery Time Objective (RTO) | < 15 minutes (via Helm rollback) |
| NF-05 | Secrets in source code | Zero — all via Secrets Manager |
| NF-06 | Environment isolation | Complete — separate VPCs, separate state files |
| NF-07 | Container image size | Optimized via multi-stage builds |
| NF-08 | Cost optimization | Right-sized instances, autoscaling, lifecycle policies |

---

## 8. Constraints & Assumptions

### Constraints
- Must use **Terraform** for all infrastructure provisioning (no CloudFormation)
- Must use **Helm** for Kubernetes deployments (not raw manifests)
- Must use **GitHub Actions** for CI/CD (client preference over CodePipeline)
- Must maintain **folder-based** (Pattern A) environment isolation in Terraform

### Assumptions
- AWS account is available with admin-level IAM permissions
- Domain name DNS can be pointed to AWS (for production ingress)
- Power BI will connect to RDS via public endpoint or VPN
- MongoDB application code works unchanged with DocumentDB (MongoDB 5.0 compatibility)

---

## 9. Deliverables Checklist

| # | Deliverable | Type |
|---|-------------|------|
| 1 | 11 Terraform modules (VPC, IAM, EKS, ECR, DocumentDB, S3, RDS, Glue, SecretsManager, CloudWatch + resource tagging) | IaC Code |
| 2 | 2 Environment configs (dev + prod) with providers, backends, variables | IaC Code |
| 3 | 3 GitHub Actions workflows (app, infra, data) | CI/CD |
| 4 | 2 Python ingestion scripts (boto3-based) | Data Engineering |
| 5 | 2 AWS Glue ETL job scripts | Data Engineering |
| 6 | CloudWatch alarm Terraform definitions | Monitoring |
| 7 | Updated Helm values (ECR registry) | Kubernetes |
| 8 | Updated documentation (README, setup guide, interview points, resume bullets) | Docs |
| 9 | Architecture diagram for AWS version | Docs |
