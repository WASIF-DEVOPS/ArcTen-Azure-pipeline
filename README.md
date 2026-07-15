# 🚀 ARCTen — B2B Leather Manufacturing Cloud Data Platform (AWS)

> **End-to-End Enterprise Cloud Platform** | Next.js 14 + Node/Express + DocumentDB | Dockerized | Kubernetes (EKS) | Terraform IaC | GitHub Actions CI/CD | RDS SQL Server (Star Schema) | Power BI Dashboard | Prometheus + Grafana Monitoring

This project demonstrates a production-grade, hybrid DevOps, Cloud Engineering, and Data Platform solution built around the **ARCTen** B2B e-commerce platform.

---

## 🏗️ Architecture Overview

```
                      ┌───────────────────────────────────────────────┐
                      │              AWS DATA PLATFORM                │
                      │                                               │
                      │ ┌────────────┐   Extract    ┌───────────────┐ │
                      │ │ DocumentDB │ ───────────► │ Amazon S3     │ │
                      │ │ (MongoDB)  │  (boto3)     │ (Raw Zone)    │ │
                      │ └────────────┘              └───────┬───────┘ │
                      │                                     │         │
                      │                                     │ Copy    │
                      │                                     ▼         │
 ┌───────────┐        │ ┌────────────┐   Transform  ┌───────────────┐ │
 │ Users     │        │ │ Power BI   │ ◄─────────── │ Amazon RDS    │ │
 │ & Clients │        │ │ Dashboard  │  (Star/Views)│ (SQL Server)  │ │
 └─────┬─────┘        │ └────────────┘              └───────────────┘ │
       │              └───────────────────────────────────────────────┘
       │ Ingress
       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       EKS KUBERNETES CLUSTER                        │
│                                                                     │
│   ┌───────────────────────────┐       ┌───────────────────────────┐ │
│   │        dev-ns             │       │        prod-ns            │ │
│   │ ┌──────────┐ ┌──────────┐ │       │ ┌──────────┐ ┌──────────┐ │ │
│   │ │ Frontend │ │ Backend  │ │       │ │ Frontend │ │ Backend  │ │ │
│   │ │ (1 Pod)  │ │ (1 Pod)  │ │       │ │ (2 Pods) │ │ (3 Pods) │ │ │
│   │ └──────────┘ └──────────┘ │       │ └──────────┘ └──────────┘ │ │
│   └───────────────────────────┘       └───────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```
ArcTen/
├── backend/                          ← Express.js Application Server
├── frontend/                         ← Next.js 14 Web Portal
│
├── docker/                           ← Dockerfiles and Compose configurations
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   └── docker-compose.yml            ← Local dev multi-container stack
│
├── infra/terraform/                  ← Infrastructure as Code (AWS Provider)
│   ├── modules/                      ← Shared reusable components
│   │   ├── vpc, iam, eks, ecr, documentdb, s3, rds, glue, secrets_manager, cloudwatch
│   └── envs/                         ← Isolated environments
│       ├── dev/                      ← Developer tier variables & settings
│       └── prod/                     ← High-Availability Production tier
│
├── helm/                             ← Helm Chart (Kubernetes Packages)
│   ├── templates/                    ← Templated resources (deployments, services, ingress)
│   ├── Chart.yaml                    ← Chart metadata
│   ├── values.yaml                   ← Default configuration values (ECR URL)
│   ├── values-dev.yaml               ← Dev overrides
│   └── values-prod.yaml              ← Prod overrides
│
├── .github/workflows/                ← GitHub Actions CI/CD Pipelines
│   ├── infra-pipeline.yml            ← Terraform IaC automation
│   ├── app-pipeline.yml              ← Build/ECR/EKS App pipelines (using Helm)
│   └── data-pipeline.yml             ← Database & Data ETL pipelines
│
├── data/                             ← Data Engineering Layer
│   ├── ingestion/                    ← Python scripts (boto3) to load raw data to S3
│   ├── glue-jobs/                    ← AWS Glue ETL definitions
│   └── processing/sql/               ← SQL warehouse star-schema schema
│
├── monitoring/                       ← Observability Stack
│   ├── prometheus/values.yaml        ← Prometheus Operator configuration
│   └── grafana/dashboards/           ← Grafana performance dashboard
│
└── docs/                             ← Setup, resume bullets, interview prep
```

---

## 🚀 Getting Started

### Local Development (Docker Compose)
To run the entire transactional application locally (including local MongoDB):
```bash
docker compose -f docker/docker-compose.yml up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api/health`

### Cloud Setup & Deployment
To provision and deploy the platform on AWS, refer to the step-by-step setup guide:
📖 **[docs/setup-guide.md](./docs/setup-guide.md)**

---

## 🧠 Interview Readiness

This project is built to demonstrate enterprise data platform and DevOps patterns on AWS:
- **Project Requirements Document**: Deep-dive into specifications ➡️ **[docs/pr.md](./docs/pr.md)**
- **Architecture Document**: Detailed cloud structure ➡️ **[docs/architecture.md](./docs/architecture.md)**
- **Resume Impact**: Optimized bullet points for your resume ➡️ **[docs/resume-bullets.md](./docs/resume-bullets.md)**
