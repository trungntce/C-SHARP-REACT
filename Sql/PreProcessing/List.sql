SELECT
	[time]
,	equip
,	h2so4_pv
,	h2so4_1day
,	h2so4_total
,	h2o2_pv
,	h2o2_1day
,	h2o2_total
,	cu_pv
,	cu_1day
,	cu_total
,	temp_pv
,	cir_flow
FROM
	dbo.raw_preprocessing
WHERE
	equip = @equipname 
AND [time] > DATEADD(DAY, -@duration, GETDATE()) 
AND [time] <= GETDATE()
ORDER BY
	[time] desc
	;