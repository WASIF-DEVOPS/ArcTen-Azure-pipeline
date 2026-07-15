# Resume Bullet Points for ARCTen Data Platform Project (AWS)

Add these impact-focused, metrics-driven bullet points to your resume under a "Projects" or "Professional Experience" section:

---

### Cloud Infrastructure & DevOps (EKS + Terraform + CI/CD)
- **Architected and implemented multi-environment infrastructure-as-code (IaC)** on AWS using **Terraform modules**, reducing environment configuration drift between Dev and Prod by 100% through strict folder isolation.
- **Deployed and managed a high-availability EKS cluster** using Kubernetes namespaces (`dev-ns`, `prod-ns`), Horizontal Pod Autoscalers (HPA) for load adaptation, and custom Ingress routing rules via NGINX ingress controller.
- **Engineered modular GitHub Actions CI/CD pipelines** utilizing multi-stage Docker builds (reducing image sizes by 65% via Next.js standalone outputs) and Helm packaging, implementing environment protection rules and required reviewers for production deployments.

### Data Engineering & Analytics (Glue + S3 Data Lake + RDS Warehouse)
- **Designed a modern serverless Data Lake** architecture on AWS using **Amazon S3**, organizing data ingest into raw, processed, and curated storage tiers with custom lifecycle policies.
- **Developed Python-based ETL ingestion scripts** using `pymongo` and `boto3` to extract transactional business data from Amazon DocumentDB (MongoDB API) into the S3 storage lake.
- **Engineered a scalable Data Warehouse** star-schema structure inside **Amazon RDS (SQL Server)**, creating robust DDL staging schemas, dimension/fact models, and query views to support high-performance analytical reporting.
- **Constructed business intelligence dashboards in Power BI** linked directly to the RDS SQL Server views, providing live tracking of key business KPIs such as client lead conversion rate and monthly sales pipeline value.

### Monitoring & Security
- **Configured unified cluster observability** by installing the **Prometheus Operator stack** (`kube-prometheus-stack`) and building custom **Grafana dashboards** to monitor API requests, pod latency, and node health.
- **Enforced secure runtime secrets management** using **AWS Secrets Manager** coupled with IAM roles and policies, ensuring zero clear-text credentials existed within application configs or source control repositories.
