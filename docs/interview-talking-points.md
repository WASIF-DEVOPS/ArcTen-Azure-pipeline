# Interview Talking Points & Deep-Dive Questions (AWS)

Be prepared to answer these technical architectural decisions during your technical interviews.

---

### Q1: Why did you choose separate folder environments (Pattern A) in Terraform over Terraform Workspaces?
> **Answer**: "I chose folder-based environment isolation because it provides absolute isolation of state backends, distinct provider locks, and localized variables. With workspaces, a single backend state file manages all environments, increasing the blast radius. If you accidentally run `terraform destroy` in the wrong workspace, it can wipe production. With separate directories, different state files, and distinct AWS accounts or region settings, we completely eliminate this risk."

### Q2: Why did you use Amazon DocumentDB instead of standard SQL for the application database?
> **Answer**: "The ARCTen transactional application is built using Next.js/Express and handles custom product specifications and unstructured customer query sheets (jackets sizes, customization request strings, color arrays). A NoSQL document database like DocumentDB (MongoDB API) was the natural choice to store these polymorphic objects without constant schema alterations. For analytics, we use AWS Glue to flatten, transform, and load this into a structured RDS SQL Server Data Warehouse star schema, matching transaction speed with reporting performance."

### Q3: How did you implement zero-trust secrets management on AWS?
> **Answer**: "No application secrets are stored in git repositories or baked into Docker files. All application runtime credentials (MongoDB connection string, JWT secret, RDS password) are stored inside AWS Secrets Manager. During EKS deployment, we fetch these secrets dynamically and inject them securely into our pods using Kubernetes Secrets or via EKS IAM Roles for Service Accounts (IRSA). Our GitHub Actions pipelines also consume secrets securely from GitHub Secrets, passing them down dynamically at deploy time."

### Q4: Why did you use Helm instead of Kustomize or raw Kubernetes manifests?
> **Answer**: "I chose Helm because it is the industry standard package manager for Kubernetes. Helm allows us to define our entire application as a single deployable unit (a Chart) and parameterize all manifests using a single `values.yaml` file. This lets us easily scale replica counts, resources, and ingress hosts for different environments using overlays like `values-dev.yaml` and `values-prod.yaml`. Furthermore, Helm tracks deployment history, allowing us to perform instant rollbacks (`helm rollback`) if a deployment fails, which is much harder to achieve with raw manifests or Kustomize."
