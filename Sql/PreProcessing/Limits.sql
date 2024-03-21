SELECT
	ROUND(CAST(AVG(h2so4_pv) + STDEV(h2so4_pv)*3 AS DECIMAL(10,2)),2) AS H2So4_upper_limit
,	ROUND(CAST(AVG(h2so4_pv) - STDEV(h2so4_pv)*3 AS DECIMAL(10,2)),2) AS H2So4_lower_limit
,	ROUND(CAST(AVG(h2o2_pv) + STDEV(h2so4_pv)*3 AS DECIMAL(10,2)),2) AS H2o2_upper_limit
,	ROUND(CAST(AVG(h2o2_pv) - STDEV(h2so4_pv)*3 AS DECIMAL(10,2)),2) AS H2o2_lower_limit
,	ROUND(CAST(AVG(cu_pv) + STDEV(h2so4_pv)*3 AS DECIMAL(10,2)),2) AS Cu_upper_limit
,	ROUND(CAST(AVG(cu_pv) - STDEV(h2so4_pv)*3 AS DECIMAL(10,2)),2) AS Cu_lower_limit
,	ROUND(CAST(AVG(temp_pv) + STDEV(h2so4_pv)*3 AS DECIMAL(10,2)),2) AS Temp_upper_limit
,	ROUND(CAST(AVG(temp_pv) - STDEV(h2so4_pv)*3 AS DECIMAL(10,2)),2) AS Temp_lower_limit
FROM
	MES.dbo.raw_preprocessing
WHERE 
	equip = @equipname AND time >= DATEADD(month, -2, GETDATE())
;