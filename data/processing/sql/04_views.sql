-- ============================================================
-- ARCTen SQL Data Warehouse — Step 4: Analytical Views (BI Consumption)
-- ============================================================

-- ── 1. Quote Sales Funnel Conversion ──────────────────────────
CREATE OR ALTER VIEW dw.vw_quote_funnel AS
SELECT 
    status,
    COUNT(quote_key) AS total_quotes,
    SUM(estimated_revenue) AS total_pipeline_value,
    AVG(estimated_quantity) AS avg_requested_quantity
FROM 
    dw.fact_quotes
GROUP BY 
    status;

-- ── 2. Monthly Pipeline Ingestion Trend ─────────────────────────
CREATE OR ALTER VIEW dw.vw_monthly_pipeline AS
SELECT 
    d.year,
    d.month,
    d.month_name,
    COUNT(f.quote_key) AS quote_count,
    SUM(f.estimated_revenue) AS monthly_revenue_pipeline
FROM 
    dw.fact_quotes f
JOIN 
    dw.dim_date d ON f.created_date_key = d.date_key
GROUP BY 
    d.year, d.month, d.month_name;

-- ── 3. Product Category Demand ────────────────────────────────
CREATE OR ALTER VIEW dw.vw_product_demand AS
SELECT 
    i.interest_label,
    COUNT(f.quote_key) AS request_count,
    SUM(f.estimated_quantity) AS total_units_requested,
    SUM(f.estimated_revenue) AS demand_value_pipeline
FROM 
    dw.fact_quotes f
JOIN 
    dw.dim_product_interest i ON f.interest_key = i.interest_key
GROUP BY 
    i.interest_label;
