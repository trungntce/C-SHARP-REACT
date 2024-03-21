select
	hc_code
,	hc_type
,	hc_name
,	tags
,	use_yn
,	sort
,	remark
,	create_dt
,	create_dt
,	create_user
,	update_dt
,	update_user
from 
	dbo.tb_healthcheck
where
	hc_code		= @hc_code
;