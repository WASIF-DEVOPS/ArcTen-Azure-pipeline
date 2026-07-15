# ============================================================
# Python ETL Ingestion — Export QuoteRequests to S3 Data Lake
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

# Read configurations
MONGO_URI = os.getenv("MONGODB_URI")
S3_BUCKET = os.getenv("AWS_S3_BUCKET")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

if not MONGO_URI or not S3_BUCKET:
    print("Error: Missing required env vars MONGODB_URI or AWS_S3_BUCKET")
    sys.exit(1)

try:
    # 1. Extract from DocumentDB (MongoDB-compatible)
    print("Connecting to DocumentDB...")
    client = MongoClient(MONGO_URI)
    db = client.get_default_database()
    quotes_collection = db["quoterequests"]

    print("Extracting QuoteRequests...")
    quotes = list(quotes_collection.find())

    if not quotes:
        print("No quotes found in collection. Exiting.")
        sys.exit(0)

    df = pd.DataFrame(quotes)

    # Clean MongoDB ObjectIds for export
    df['_id'] = df['_id'].astype(str)
    if 'createdAt' in df.columns:
        df['createdAt'] = pd.to_datetime(df['createdAt']).dt.strftime('%Y-%m-%d %H:%M:%S')
    if 'updatedAt' in df.columns:
        df['updatedAt'] = pd.to_datetime(df['updatedAt']).dt.strftime('%Y-%m-%d %H:%M:%S')

    # 2. Upload to S3 Data Lake (Raw zone)
    print("Connecting to Amazon S3...")
    s3_client = boto3.client('s3', region_name=AWS_REGION)

    # Path partitioning: raw/quotes/year/month/quotes.csv
    now = datetime.now()
    s3_key = f"raw/quotes/{now.year}/{now.month:02d}/quotes.csv"

    print(f"Uploading {len(df)} records to S3: s3://{S3_BUCKET}/{s3_key}...")
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
