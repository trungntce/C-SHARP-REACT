select
	errorgroup_code
,	error_code
,	[error_message]
,	eqp_code
,	eqp_error_code
,	use_yn
,	sort
,	remark
,	create_dt
,	create_user
,	update_dt
,	update_user
from
	dbo.tb_error_code
where
	corp_id				= @corp_id
and	fac_id				= @fac_id
and errorgroup_code		= @errorgroup_code
and error_code			= @error_code
and [error_message]		collate SQL_Latin1_General_CP1_CI_AS like '%' + @error_message + '%'
and eqp_code			= @eqp_code
and use_yn				= @use_yn
and remark				collate SQL_Latin1_General_CP1_CI_AS like '%' + @remark + '%'
order by
	create_dt desc
;