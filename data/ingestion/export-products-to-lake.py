# ============================================================
# Python ETL Ingestion — Export Product Catalog to S3 Data Lake
# Replaces: Azure ADLS Gen2 version
# ============================================================
import os
import sys
from datetime import datetime
from pymongo import MongoClient
import pandas as pd
import boto3
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI")
S3_BUCKET = os.getenv("AWS_S3_BUCKET")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

if not MONGO_URI or not S3_BUCKET:
    print("Error: Missing MONGODB_URI or AWS_S3_BUCKET env vars")
    sys.exit(1)

try:
    # 1. Extract Products from DocumentDB
    print("Connecting to DocumentDB...")
    client = MongoClient(MONGO_URI)
    db = client.get_default_database()
    products_collection = db["products"]

    print("Extracting Products...")
    products = list(products_collection.find())

    if not products:
        print("No products found in database. Exiting.")
        sys.exit(0)

    df = pd.DataFrame(products)
    df['_id'] = df['_id'].astype(str)

    # Flatten nested document features if specifications column is present
    if 'specifications' in df.columns:
        specs_df = pd.json_normalize(df['specifications'])
        df = pd.concat([df.drop(columns=['specifications']), specs_df], axis=1)

    # 2. Upload to S3 Data Lake
    print("Connecting to Amazon S3...")
    s3_client = boto3.client('s3', region_name=AWS_REGION)

    s3_key = "raw/products/products.csv"

    print(f"Uploading products catalog to s3://{S3_BUCKET}/{s3_key}...")
    csv_data = df.to_csv(index=False)
    s3_client.put_object(
        Bucket=S3_BUCKET,
        Key=s3_key,
        Body=csv_data,
        ContentType='text/csv'
    )
    print("Upload complete!")

except Exception as e:
    print(f"ETL Execution Failed: {str(e)}")
    sys.exit(1)
