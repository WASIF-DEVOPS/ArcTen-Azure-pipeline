# ============================================================
# AWS Glue ETL Job — S3 Data Lake to RDS SQL Server
# Replaces: data/adf-pipelines/pl_lake_to_warehouse.json
# ============================================================
import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job

args = getResolvedOptions(sys.argv, [
    'JOB_NAME',
    'S3_BUCKET',
    'RDS_JDBC_URL',
    'RDS_USERNAME',
    'RDS_PASSWORD'
])

sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)

bucket = args['S3_BUCKET']

# ── 1. Read quotes CSV from S3 Data Lake ─────────────────────
quotes_path = f"s3://{bucket}/raw/quotes/"

quotes_df = spark.read \
    .option("header", "true") \
    .option("inferSchema", "true") \
    .option("recursiveFileLookup", "true") \
    .csv(quotes_path)

print(f"Quotes records read from S3: {quotes_df.count()}")

# ── 2. Read products CSV from S3 Data Lake ───────────────────
products_path = f"s3://{bucket}/raw/products/"

products_df = spark.read \
    .option("header", "true") \
    .option("inferSchema", "true") \
    .csv(products_path)

print(f"Products records read from S3: {products_df.count()}")

# ── 3. Write quotes to RDS staging table ─────────────────────
jdbc_options = {
    "url": args['RDS_JDBC_URL'],
    "user": args['RDS_USERNAME'],
    "password": args['RDS_PASSWORD'],
    "driver": "com.microsoft.sqlserver.jdbc.SQLServerDriver"
}

quotes_df.write \
    .format("jdbc") \
    .options(**jdbc_options) \
    .option("dbtable", "stg.quotes") \
    .mode("overwrite") \
    .save()

print("Quotes loaded into stg.quotes")

# ── 4. Write products to RDS staging table ───────────────────
products_df.write \
    .format("jdbc") \
    .options(**jdbc_options) \
    .option("dbtable", "stg.products") \
    .mode("overwrite") \
    .save()

print("Products loaded into stg.products")
print("S3 to RDS staging load complete!")

job.commit()
