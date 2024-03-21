update
	dbo.tb_checksheet_group_eqp
set
	checksheet_group_name				= @checksheet_group_name
,	eqp_code	= @equipment_code
,	use_yn			= @use_yn
,	update_dt			= getdate()	
,	update_user			= @update_user
where
	use_yn	 = @use_yn
and checksheet_group_code			= @checksheet_group_code
;