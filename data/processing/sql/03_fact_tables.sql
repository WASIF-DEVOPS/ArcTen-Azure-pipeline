-- ============================================================
-- ARCTen SQL Data Warehouse — Step 3: Fact Table
-- ============================================================

IF OBJECT_ID('dw.fact_quotes', 'U') IS NOT NULL
    DROP TABLE dw.fact_quotes;

CREATE TABLE dw.fact_quotes (
    quote_key INT IDENTITY(1,1) PRIMARY KEY,
    quote_id VARCHAR(50) NOT NULL,
    company_key INT NOT NULL FOREIGN KEY REFERENCES dw.dim_company(company_key),
    interest_key INT NOT NULL FOREIGN KEY REFERENCES dw.dim_product_interest(interest_key),
    created_date_key INT NOT NULL FOREIGN KEY REFERENCES dw.dim_date(date_key),
    status VARCHAR(50) NOT NULL,
    estimated_quantity INT NOT NULL,
    estimated_revenue DECIMAL(18, 2) NOT NULL, -- Calculated based on avg product category value
    
    CONSTRAINT UC_Quote UNIQUE (quote_id)
);
