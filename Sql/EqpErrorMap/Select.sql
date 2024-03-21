select
	eqp_code,
	eqp_error_code,
	error_code,
	remark,
	create_user,
	create_dt
from
	dbo.tb_eqp_error_map
where
	corp_id			= @corp_id		
and fac_id			= @fac_id		
and eqp_error_code	= @eqp_error_code
;
