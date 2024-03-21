delete
	dbo.tb_menu
where
	corp_id				= @corp_id
and	fac_id				= @fac_id
and	menu_id				= @menu_id
;
