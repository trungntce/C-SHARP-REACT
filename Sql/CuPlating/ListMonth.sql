SELECT 
  CONVERT(varchar(10), [time], 120) AS [time], 
  MAX(d001) AS max_d001, 
  MIN(d001) AS min_d001, 
  CAST(ROUND(AVG(d001), 2) AS float) AS avg_d001,
  MAX(d002) AS max_d002, 
  MIN(d002) AS min_d002, 
  CAST(ROUND(AVG(d002), 2) AS float) AS avg_d002,
  MAX(d003) AS max_d003, 
  MIN(d003) AS min_d003, 
  CAST(ROUND(AVG(d003), 2) AS float) AS avg_d003,
  MAX(d004) AS max_d004, 
  MIN(d004) AS min_d004, 
  CAST(ROUND(AVG(d004), 2) AS float) AS avg_d004 
FROM 
	dbo.raw_cu_plating_10414
WHERE 
	eqcode = @eq_code
AND [time] > DATEADD(MONTH, -1, GETDATE()) AND [time] <= GETDATE()
GROUP BY 
	CONVERT(varchar(10), [time], 120)
ORDER BY 
	[time] desc;