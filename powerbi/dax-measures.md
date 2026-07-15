# Power BI DAX Formulas — B2B Quote Analytics

Use these formulas when building metrics inside your Power BI reports.

---

### 1. Total Enquiries Count
```dax
TotalQuotes = COUNT(fact_quotes[quote_key])
```

### 2. Total Estimated Pipeline Value
```dax
PipelineValue = SUM(fact_quotes[estimated_revenue])
```

### 3. Conversion Rate to Quoted Stage (%)
```dax
ConversionRateToQuoted = 
DIVIDE(
    CALCULATE(COUNT(fact_quotes[quote_key]), fact_quotes[status] = "quoted"),
    [TotalQuotes],
    0
) * 100
```

### 4. Average Pipeline Value per Lead
```dax
AvgLeadValue = DIVIDE([PipelineValue], [TotalQuotes], 0)
```

### 5. Month-over-Month (MoM) Pipeline Value Growth
```dax
PipelineValueMoM = 
VAR CurrentMonthValue = [PipelineValue]
VAR PreviousMonthValue = CALCULATE([PipelineValue], DATEADD(dim_date[full_date], -1, MONTH))
RETURN
IF(
    ISBLANK(PreviousMonthValue),
    BLANK(),
    DIVIDE(CurrentMonthValue - PreviousMonthValue, PreviousMonthValue, 0) * 100
)
```
