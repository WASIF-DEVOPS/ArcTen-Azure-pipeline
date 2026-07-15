# Databricks Module — Optional Data Transformation

This module acts as a parallel/alternate transformation layer. It demonstrates data engineering skills using PySpark notebooks running inside AWS Databricks.

## How to Set Up Mount Point in Databricks (AWS)

Execute this inside your Databricks cluster to mount the S3 Data Lake raw container:

```python
# Option 1: Using Instance Profile (Recommended)
dbutils.fs.mount(
  source = "s3a://arcten-datalake-prod001/raw/",
  mount_point = "/mnt/datalake/raw",
  extra_configs = {
    "fs.s3a.aws.credentials.provider": "com.amazonaws.auth.InstanceProfileCredentialsProvider"
  }
)

# Option 2: Using Access Keys (for development only)
# ACCESS_KEY = dbutils.secrets.get(scope="aws", key="access-key")
# SECRET_KEY = dbutils.secrets.get(scope="aws", key="secret-key")
# dbutils.fs.mount(
#   source = "s3a://arcten-datalake-dev001/raw/",
#   mount_point = "/mnt/datalake/raw",
#   extra_configs = {
#     "fs.s3a.access.key": ACCESS_KEY,
#     "fs.s3a.secret.key": SECRET_KEY
#   }
# )
```

## Running the Notebooks

1. Upload `notebooks/transform_quotes.py` to your Databricks Workspace.
2. Link it to an active Cluster running Databricks Runtime 10.4 LTS or higher.
3. Run the notebook to transform raw quotes CSV files into clean partitioned Parquet outputs.
