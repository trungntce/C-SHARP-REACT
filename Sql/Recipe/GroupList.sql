select
	corp_id
	, fac_id
	, group_code
	, group_name
	, create_user
	, create_dt
	, update_user
	, update_dt
from
	dbo.tb_param_recipe_group
where
	corp_id			= @corp_id		
and fac_id			= @fac_id		
and group_code		= @group_code
;