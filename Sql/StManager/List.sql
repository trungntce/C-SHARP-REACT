select
	corp_id
,	fac_id
,	eqp_id
,	model_id
,	st_val
,	create_dt
from 
	dbo.tb_standard_time
where
	corp_id			= @corp_id
and	fac_id			= @fac_id
and	eqp_id			= @eqp_id
and	model_id		= @model_id
order by
	create_dt desc
offset 
	(@page_no - 1) * @page_size rows
fetch next 
	@page_size rows only
;