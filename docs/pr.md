# 📋 ARCTen — Project Requirements Document (AWS Platform)

> **Project**: ARCTen B2B Leather Manufacturing Cloud Data Platform  
> **Version**: 1.0 — AWS Native  
> **Date**: July 2026  

---

## 1. Project Overview

### 1.1 Background
ARCTen is a B2B leather manufacturing company that produces leather jackets (men's & women's) and leather bags for wholesale buyers. The company operates a cloud-native e-commerce and data analytics platform built entirely on Amazon Web Services (AWS).

### 1.2 Platform Objective
The system is designed and built natively on AWS to run the B2B catalog, manage quote pipelines, orchestrate ETL jobs, and serve business metrics seamlessly while maintaining high operational and security standards.

### 1.3 Success Criteria
- High availability for the B2B application
- Infrastructure provisioned entirely through Terraform (IaC)
- CI/CD pipelines fully automated via GitHub Actions
- Data pipeline (ETL → Warehouse → BI) operational on AWS services
- Comprehensive CloudWatch and Prometheus/Grafana monitoring
- Strong security posture (zero credentials in source code)

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

| ID | Requirement | AWS Service / Tool | Priority |
|----|------------|--------------------|----------|
| IR-01 | Managed Kubernetes cluster with dev/prod namespaces | **Amazon EKS** | P0 |
| IR-02 | Private container image registry | **Amazon ECR** | P0 |
| IR-03 | Auto-scaling (HPA) — 1→5 pods at 70% CPU | **EKS Horizontal Pod Autoscaling** | P0 |
| IR-04 | Ingress controller (NGINX) with path-based routing | **EKS + NGINX Ingress Controller** | P0 |
| IR-05 | Network isolation — VPC with public/private subnets | **AWS VPC** (Multi-AZ subnets) | P0 |
| IR-06 | IAM roles for Kubernetes service accounts | **IAM Roles for Service Accounts (IRSA)** | P0 |

### 3.2 Database & Storage

| ID | Requirement | AWS Service / Tool | Priority |
|----|------------|--------------------|----------|
| IR-07 | MongoDB-compatible document database for app data | **Amazon DocumentDB** (Prod) / In-Cluster MongoDB (Dev) | P0 |
| IR-08 | Data Lake storage (raw zone for ETL) | **Amazon S3** | P0 |
| IR-09 | SQL Data Warehouse for analytics (star schema) | **Amazon RDS (SQL Server)** | P0 |

### 3.3 Data Engineering & ETL

| ID | Requirement | AWS Service / Tool | Priority |
|----|------------|--------------------|----------|
| IR-10 | ETL orchestration service | **AWS Glue** / GitHub Actions Runner | P1 |
| IR-11 | Python ingestion scripts (App DB → Data Lake) | **Python boto3 S3 SDK** | P1 |
| IR-12 | Optional PySpark transformation layer | **AWS Glue PySpark** | P2 |

### 3.4 Security & Secrets

| ID | Requirement | AWS Service / Tool | Priority |
|----|------------|--------------------|----------|
| IR-13 | Centralized secrets management (DB URIs, JWT, admin creds) | **AWS Secrets Manager** | P0 |
| IR-14 | No credentials in source code or Docker images | **Zero-Git Secrets Policy** | P0 |
| IR-15 | Terraform state stored remotely with locking | **S3 + DynamoDB State Lock Table** | P0 |

### 3.5 Monitoring & Observability

| ID | Requirement | AWS Service / Tool | Priority |
|----|------------|--------------------|----------|
| IR-16 | Metrics collection (CPU, memory, pod health) | **Prometheus (in-cluster)** | P0 |
| IR-17 | Dashboard visualization | **Grafana (in-cluster)** | P0 |
| IR-18 | Cloud-native metric alerts (node CPU, DB usage) | **CloudWatch Alarms + SNS** | P1 |
| IR-19 | Centralized log aggregation | **CloudWatch Logs** | P1 |

---

## 4. CI/CD Pipeline Requirements

| ID | Requirement | AWS Service / Tool | Priority |
|----|------------|--------------------|----------|
| CI-01 | Auto-trigger on code push to `main` / `develop` | **GitHub Actions Triggers** | P0 |
| CI-02 | Build Docker images (multi-stage) for frontend + backend | **GitHub Actions docker/build-push** | P0 |
| CI-03 | Push images to container registry | **GitHub Actions Amazon ECR Upload** | P0 |
| CI-04 | Deploy to dev namespace on `develop` branch | **Helm Upgrade to EKS Dev Namespace** | P0 |
| CI-05 | Deploy to prod namespace on `main` branch | **Helm Upgrade to EKS Prod Namespace** | P0 |
| CI-06 | Manual approval gate before production deployment | **GitHub Environments with Required Reviewers** | P0 |
| CI-07 | Infrastructure pipeline (Terraform plan/apply) | **GitHub Actions workflows for Terraform** | P1 |
| CI-08 | Data pipeline trigger | **GitHub Actions scheduler / workflows** | P2 |

---

## 5. Data Analytics & BI Requirements

| ID | Requirement | Priority | Status |
|----|------------|----------|--------|
| DA-01 | Star schema warehouse: staging → dimensions → facts → views | P0 | ✅ SQL scripts run natively on RDS SQL Server |
| DA-02 | 3 analytical views: `vw_quote_funnel`, `vw_monthly_pipeline`, `vw_product_demand` | P0 | ✅ SQL Views created in RDS |
| DA-03 | Power BI dashboard connected to warehouse | P1 | 🟡 Connection configured directly to RDS endpoint |
| DA-04 | 5 DAX KPIs: Total Quotes, Pipeline Value, Conversion Rate, Avg Lead Value, MoM Growth | P1 | ✅ DAX logic prepared |

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

## 8. New Platform Requirements & Security Enhancements

### 8.1 Production-Ready Public Access (Live Internet Access)
| ID | Requirement | AWS Implementation | Priority | Status |
|----|------------|--------------------|----------|--------|
| PR-01 | **Public Exposure** — Expose EKS application to the public internet | AWS Network Load Balancer (NLB) provisioned automatically by NGINX Ingress Controller. | P0 | ✅ Implemented |
| PR-02 | **No-Host Routing** — Access the application using raw Load Balancer DNS endpoints | Modified Helm `ingress.yaml` to make the `host` field optional, enabling wildcard routing for testing. | P0 | ✅ Implemented |

### 8.2 Security Audit & Remediation Strategy
| Security Focus | Risk Identified | Mitigation Strategy | Status |
|----------------|-----------------|---------------------|--------|
| In-Cluster Traffic | MongoDB/App traffic is unencrypted (HTTP) | Plan deployment of Linkerd/Istio Service Mesh for mTLS. | 📋 Strategy Created |
| Perimeter Security | EKS API control plane open to `0.0.0.0/0` | Restrict security group CIDR access to developer IPs in Terraform. | 📋 Strategy Created |
| Pipeline Gates | Vulnerabilities bypassed in CI/CD pipeline | Enforce `continue-on-error: false` for Trivy/SonarQube when code is clean. | 📋 Strategy Created |

### 8.3 Observability Split Strategy
| Observability Level | Tool Utilized | Target Metrics | Action / Alert Channel |
|---------------------|---------------|----------------|-----------------------|
| **Infrastructure** | AWS CloudWatch | EC2 CPU/RAM, RDS storage/connections, NAT bandwidth | AWS SNS email alerts to `admin@arcten.com` |
| **Application** | Prometheus + Grafana | API request latency, HTTP 5xx error rate, pod health | Webhooks to developer Slack/Discord channels |

---

## 9. Constraints & Assumptions

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

## 10. Deliverables Checklist

| # | Deliverable | Type |
|---|-------------|------|
| 1 | 11 Terraform modules (VPC, IAM, EKS, ECR, DocumentDB, S3, RDS, Glue, SecretsManager, CloudWatch + resource tagging) | IaC Code |
| 2 | 2 Environment configs (dev + prod) with providers, backends, variables | IaC Code |
| 3 | 3 GitHub Actions workflows (app, infra, data) | CI/CD |
| 4 | 2 Python ingestion scripts (boto3-based) | Data Engineering |
| 5 | 2 AWS Glue ETL job scripts | Data Engineering |
| 6 | CloudWatch alarm Terraform definitions | Monitoring |
| 7 | Updated Helm values (ECR registry) | Kubernetes |
| 8 | Updated documentation (README, setup guide, interview points, resume bullets, pr.md) | Docs |
| 9 | Architecture diagram for AWS version | Docs |

