update 
	dbo.tb_menu_auth
set 
	auth			= @auth
,	update_user		= @update_user
,	update_dt		= getdate()
where 
	corp_id			= @corp_id
and	fac_id			= @fac_id
and menu_id			= @menu_id
and target_id		= @target_id
and	target_type		= @target_type
;
