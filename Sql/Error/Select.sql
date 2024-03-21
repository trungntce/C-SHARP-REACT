select
	errorgroup_code
,	error_code
,	[error_message]
,	eqp_code
,	eqp_error_code
,	use_yn
,	sort
,	remark
,	create_user
,	create_dt
from 
	dbo.tb_error_code
where
	corp_id			= @corp_id
and	fac_id			= @fac_id
and	error_code		= @error_code
;