# Connecting Power BI to Amazon RDS Data Warehouse

This directory provides the details and formulas required to configure a Power BI dashboard against your ARCTen Amazon RDS SQL Server Data Warehouse database.

## 🔌 Connection Setup

1. **Open Power BI Desktop**.
2. Click **Get Data** -> **Database** -> **SQL Server database**.
3. **Configure Connection**:
   - **Server**: Enter the Endpoint FQDN outputted by Terraform (e.g., `arcten-dw-prod.xxxxxx.us-east-1.rds.amazonaws.com,1433`).
   - **Database**: `arctendw`
   - **Data Connectivity Mode**: **Import** (recommended for performance and modeling) or **DirectQuery** (for real-time).
4. **Authentication**:
   - Select **Database** tab on the left.
   - Enter your administrator Username (`sqladmin`) and the password configured in `terraform.tfvars` (injected via secrets manager).
5. Select the views from the navigator list:
   - `dw.vw_quote_funnel`
   - `dw.vw_monthly_pipeline`
   - `dw.vw_product_demand`

## 📊 Star Schema Data Model

Ensure that active relationships are formed in the Model View:
- `fact_quotes.company_key` -> `dim_company.company_key` (Many to One)
- `fact_quotes.interest_key` -> `dim_product_interest.interest_key` (Many to One)
- `fact_quotes.created_date_key` -> `dim_date.date_key` (Many to One)
