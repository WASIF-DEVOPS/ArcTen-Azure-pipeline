# Databricks notebook source
# ============================================================
# PySpark Data Transformation — Clean & Structure Quotes
# ============================================================
from pyspark.sql.functions import col, when, to_date, regexp_replace

# 1. Read raw Quotes CSV from Data Lake Gen2
storage_account_name = "stlakearctendevyouruniquesuffix" # Change to actual storage name
container_name = "raw"
mount_path = f"/mnt/datalake/{container_name}"

# Assume DBFS mount has already been set up using ADLS credentials
raw_df = spark.read.format("csv") \
  .option("header", "true") \
  .option("inferSchema", "true") \
  .load(f"{mount_path}/quotes/*/*/*.csv")

# 2. Perform cleaning transformations
clean_df = raw_df \
  .withColumn("companyName", regexp_replace(col("companyName"), r"[^\w\s-]", "")) \
  .withColumn("email", col("email").cast("string")) \
  .withColumn("status", when(col("status").isNull(), "new").otherwise(col("status"))) \
  .withColumn("estimatedQuantity", when(col("estimatedQuantity").isNull(), "50-100").otherwise(col("estimatedQuantity")))

# 3. Write structured outputs to Processed Layer
clean_df.write.format("parquet") \
  .mode("overwrite") \
  .partitionBy("status") \
  .save(f"/mnt/datalake/processed/quotes")

print("PySpark clean and transform completed successfully!")
