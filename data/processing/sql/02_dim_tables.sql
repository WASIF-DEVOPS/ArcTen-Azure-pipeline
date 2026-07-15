-- ============================================================
-- ARCTen SQL Data Warehouse — Step 2: Dimension Tables
-- ============================================================

IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'dw')
BEGIN
    EXEC('CREATE SCHEMA dw')
END;

-- ── 1. Company Dimension ──────────────────────────────────────
IF OBJECT_ID('dw.dim_company', 'U') IS NOT NULL
    DROP TABLE dw.dim_company;

CREATE TABLE dw.dim_company (
    company_key INT IDENTITY(1,1) PRIMARY KEY,
    company_name NVARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50)
);

-- ── 2. Product Interest Dimension ─────────────────────────────
IF OBJECT_ID('dw.dim_product_interest', 'U') IS NOT NULL
    DROP TABLE dw.dim_product_interest;

CREATE TABLE dw.dim_product_interest (
    interest_key INT IDENTITY(1,1) PRIMARY KEY,
    interest_code VARCHAR(50) UNIQUE,
    interest_label NVARCHAR(100) NOT NULL
);

-- Seed values for interest dimension
INSERT INTO dw.dim_product_interest (interest_code, interest_label) VALUES
('leather-jackets', 'Leather Jackets'),
('leather-bags', 'Leather Bags'),
('both', 'Both Jackets & Bags'),
('custom', 'Custom Leather Apparel');

-- ── 3. Date Dimension ─────────────────────────────────────────
IF OBJECT_ID('dw.dim_date', 'U') IS NOT NULL
    DROP TABLE dw.dim_date;

CREATE TABLE dw.dim_date (
    date_key INT PRIMARY KEY, -- YYYYMMDD
    full_date DATE NOT NULL,
    year INT NOT NULL,
    quarter INT NOT NULL,
    month INT NOT NULL,
    month_name VARCHAR(15) NOT NULL,
    day_of_month INT NOT NULL,
    day_of_week INT NOT NULL,
    day_name VARCHAR(15) NOT NULL
);
