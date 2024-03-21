select
	eqp_code,
	param_id,
	group_code,
	group_name,
	gubun1,
	gubun2,
	param_name,
	param_short_name,
	raw_type,
	table_name,
	column_name,
	create_user,
	create_dt
from
	dbo.tb_param_extra
where
	corp_id			= @corp_id		
and fac_id			= @fac_id	
and eqp_code		= @eqp_code
and param_id		= @param_id
and approve_key		= ''
;
