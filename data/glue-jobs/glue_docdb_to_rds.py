# ============================================================
# AWS Glue ETL Job — DocumentDB to RDS SQL Server
# Replaces: data/adf-pipelines/pl_cosmos_to_sql.json
# ============================================================
import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job

args = getResolvedOptions(sys.argv, [
    'JOB_NAME',
    'DOCDB_URI',
    'RDS_JDBC_URL',
    'RDS_USERNAME',
    'RDS_PASSWORD'
])

sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)

# ── 1. Read from DocumentDB (MongoDB-compatible) ─────────────
docdb_options = {
    "uri": args['DOCDB_URI'],
    "database": "arcten",
    "collection": "quoterequests",
    "ssl": "true",
    "ssl.domain_match": "false"
}

quotes_df = glueContext.create_dynamic_frame.from_options(
    connection_type="mongodb",
    connection_options=docdb_options,
    transformation_ctx="quotes_source"
)

print(f"Records read from DocumentDB: {quotes_df.count()}")

# ── 2. Transform — flatten and clean ─────────────────────────
# Convert DynamicFrame to Spark DataFrame for transformations
spark_df = quotes_df.toDF()

# Select and rename columns to match staging table schema
cleaned_df = spark_df.select(
    spark_df["_id"].cast("string").alias("_id"),
    spark_df["companyName"].cast("string"),
    spark_df["email"].cast("string"),
    spark_df["phone"].cast("string"),
    spark_df["productInterest"].cast("string"),
    spark_df["estimatedQuantity"].cast("string"),
    spark_df["additionalNotes"].cast("string"),
    spark_df["status"].cast("string"),
    spark_df["createdAt"].cast("string"),
    spark_df["updatedAt"].cast("string")
)

# ── 3. Write to RDS SQL Server staging table ─────────────────
cleaned_df.write \
    .format("jdbc") \
    .option("url", args['RDS_JDBC_URL']) \
    .option("dbtable", "stg.quotes") \
    .option("user", args['RDS_USERNAME']) \
    .option("password", args['RDS_PASSWORD']) \
    .option("driver", "com.microsoft.sqlserver.jdbc.SQLServerDriver") \
    .mode("overwrite") \
    .save()

print("Successfully loaded quotes into RDS staging table")

job.commit()
