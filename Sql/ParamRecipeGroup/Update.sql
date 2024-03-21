update
	dbo.tb_param_recipe_group
set
	group_name	= @group_name
,	update_user	= @update_user
,	update_dt	= getdate()
where
	corp_id		= @corp_id
and	fac_id		= @fac_id
and	group_code	= @group_code
;