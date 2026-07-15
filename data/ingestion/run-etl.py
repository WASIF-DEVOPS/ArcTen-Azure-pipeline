# ============================================================
# Python ETL Script — S3 Data Lake to RDS SQL Server
# Replaces: AWS Glue Job (for Free Tier compatibility)
# ============================================================
import os
import sys
import boto3
import pandas as pd
import pymssql
from io import StringIO

# Read config
S3_BUCKET = os.getenv("AWS_S3_BUCKET")
RDS_ENDPOINT = os.getenv("RDS_HOST") # e.g. host:port
RDS_USER = os.getenv("RDS_USER", "sqladmin")
RDS_PASSWORD = os.getenv("RDS_PASS")
RDS_DB = "arctendw"

if not S3_BUCKET or not RDS_ENDPOINT or not RDS_PASSWORD:
    print("Error: Missing S3_BUCKET, RDS_HOST, or RDS_PASS env vars")
    sys.exit(1)

# Split host and port
if "," in RDS_ENDPOINT:
    RDS_HOST, RDS_PORT = RDS_ENDPOINT.split(",")
elif ":" in RDS_ENDPOINT:
    RDS_HOST, RDS_PORT = RDS_ENDPOINT.split(":")
else:
    RDS_HOST = RDS_ENDPOINT
    RDS_PORT = "1433"

try:
    s3_client = boto3.client('s3')

    # ── 1. Read Quotes from S3 ───────────────────────────────
    print("Fetching raw quotes from S3...")
    # Find latest quote files in raw/quotes/
    response = s3_client.list_objects_v2(Bucket=S3_BUCKET, Prefix="raw/quotes/")
    quote_keys = [obj['Key'] for obj in response.get('Contents', []) if obj['Key'].endswith('.csv')]

    if not quote_keys:
        print("No quotes files found in S3 raw/quotes/. Skipping quotes ETL.")
        quotes_df = pd.DataFrame()
    else:
        # Load latest quote file
        latest_key = sorted(quote_keys)[-1]
        print(f"Loading {latest_key}...")
        csv_obj = s3_client.get_object(Bucket=S3_BUCKET, Key=latest_key)
        csv_string = csv_obj['Body'].read().decode('utf-8')
        quotes_df = pd.read_csv(StringIO(csv_string))

    # ── 2. Read Products from S3 ──────────────────────────────
    print("Fetching raw products from S3...")
    product_key = "raw/products/products.csv"
    try:
        csv_obj = s3_client.get_object(Bucket=S3_BUCKET, Key=product_key)
        csv_string = csv_obj['Body'].read().decode('utf-8')
        products_df = pd.read_csv(StringIO(csv_string))
    except Exception as e:
        print(f"Could not load products.csv: {str(e)}. Skipping products ETL.")
        products_df = pd.DataFrame()

    # ── 3. Connect to RDS SQL Server ──────────────────────────
    print(f"Connecting to RDS SQL Server at {RDS_HOST}:{RDS_PORT}...")
    conn = pymssql.connect(
        server=RDS_HOST,
        port=int(RDS_PORT),
        user=RDS_USER,
        password=RDS_PASSWORD,
        database=RDS_DB,
        autocommit=True
    )
    cursor = conn.cursor()

    # ── 4. Write to RDS Staging tables ───────────────────────
    # Write Quotes
    if not quotes_df.empty:
        print("Truncating stg.quotes...")
        cursor.execute("TRUNCATE TABLE stg.quotes")
        
        print(f"Inserting {len(quotes_df)} quotes into stg.quotes...")
        for _, row in quotes_df.iterrows():
            cursor.execute(
                """
                INSERT INTO stg.quotes (_id, companyName, email, phone, productInterest, estimatedQuantity, additionalNotes, status, createdAt, updatedAt)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    str(row.get('_id', '')),
                    str(row.get('companyName', '')),
                    str(row.get('email', '')),
                    str(row.get('phone', '')),
                    str(row.get('productInterest', '')),
                    str(row.get('estimatedQuantity', '')),
                    str(row.get('additionalNotes', '')),
                    str(row.get('status', 'new')),
                    str(row.get('createdAt', '')),
                    str(row.get('updatedAt', ''))
                )
            )

    # Write Products
    if not products_df.empty:
        print("Truncating stg.products...")
        cursor.execute("TRUNCATE TABLE stg.products")

        print(f"Inserting {len(products_df)} products into stg.products...")
        for _, row in products_df.iterrows():
            cursor.execute(
                """
                INSERT INTO stg.products (_id, name, sku, category, price, stock, description)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    str(row.get('_id', '')),
                    str(row.get('name', '')),
                    str(row.get('sku', '')),
                    str(row.get('category', '')),
                    float(row.get('price', 0.0)) if pd.notna(row.get('price')) else 0.0,
                    int(row.get('stock', 0)) if pd.notna(row.get('stock')) else 0,
                    str(row.get('description', ''))
                )
            )

    conn.close()
    print("ETL Sync complete successfully!")

except Exception as e:
    print(f"ETL Load Execution Failed: {str(e)}")
    sys.exit(1)
