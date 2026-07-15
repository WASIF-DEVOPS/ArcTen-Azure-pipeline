-- ============================================================
-- ARCTen SQL Data Warehouse — Step 1: Staging Tables
-- ============================================================

-- Create Staging Schema if not exists
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'stg')
BEGIN
    EXEC('CREATE SCHEMA stg')
END;

-- Staging Quotes Table (matches Cosmos source directly)
IF OBJECT_ID('stg.quotes', 'U') IS NOT NULL
    DROP TABLE stg.quotes;

CREATE TABLE stg.quotes (
    _id VARCHAR(50),
    companyName NVARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    productInterest VARCHAR(50),
    estimatedQuantity VARCHAR(50),
    additionalNotes NVARCHAR(MAX),
    status VARCHAR(50),
    createdAt VARCHAR(50),
    updatedAt VARCHAR(50)
);

-- Staging Products Table
IF OBJECT_ID('stg.products', 'U') IS NOT NULL
    DROP TABLE stg.products;

CREATE TABLE stg.products (
    _id VARCHAR(50),
    name NVARCHAR(255),
    category VARCHAR(50),
    description NVARCHAR(MAX),
    minimumOrderQuantity INT,
    leadTimeDays INT,
    material NVARCHAR(100),
    isActive VARCHAR(10)
);
