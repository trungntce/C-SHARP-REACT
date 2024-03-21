SELECT 
  CONVERT(varchar(10), [time], 120) AS [time], 
  MAX(h2so4_pv) AS max_h2so4, 
  MIN(h2so4_pv) AS min_h2so4, 
  CAST(ROUND(AVG(h2so4_pv), 2) AS float) AS avg_h2so4,
  MAX(h2o2_pv) AS max_h2o2, 
  MIN(h2o2_pv) AS min_h2o2, 
  CAST(ROUND(AVG(h2o2_pv), 2) AS float) AS avg_h2o2,
  MAX(cu_pv) AS max_cu, 
  MIN(cu_pv) AS min_cu, 
  CAST(ROUND(AVG(cu_pv), 2) AS float) AS avg_cu,
  MAX(temp_pv) AS max_temp, 
  MIN(temp_pv) AS min_temp, 
  CAST(ROUND(AVG(temp_pv), 2) AS float) AS avg_temp 
FROM MES.dbo.raw_preprocessing 
WHERE equip = @equipname AND [time] > DATEADD(MONTH, -1, GETDATE()) AND [time] <= GETDATE()
GROUP BY CONVERT(varchar(10), [time], 120)
ORDER BY [time] desc;