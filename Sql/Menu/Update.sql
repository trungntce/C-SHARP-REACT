update 
	dbo.tb_menu
set
	menu_name			= @menu_name		
,	menu_type			= @menu_type		
,	icon				= @icon
,	use_yn				= @use_yn			
,	menu_sort			= @menu_sort
,	menu_body			= @menu_body
,	manager				= @manager
,	update_user			= @update_user
,	update_dt			= getdate()
where
	corp_id				= @corp_id
and	fac_id				= @fac_id
and	menu_id				= @menu_id
;
