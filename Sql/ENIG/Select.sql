select
	model_id
,	create_dt
,	return_resist_val
,	to_resist_val
from 
	dbo.tb_diwater
where
	create_dt BETWEEN @StartDt AND @EndDt
;