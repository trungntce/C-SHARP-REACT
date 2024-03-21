select
	eqp_code,
	recipe_code,
	group_code,
	recipe_name,
	base_val,
	val1,
	interlock_yn,
	alarm_yn,
	remark,
	raw_type,
	table_name,
	column_name,
	create_user,
	create_dt
from
	dbo.tb_recipe
where
	corp_id			= @corp_id		
and fac_id			= @fac_id		
and eqp_code		= @eqp_code
and recipe_code		= @recipe_code
and approve_key		= ''
;