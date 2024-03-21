update
	dbo.tb_checksheet_group
set
	checksheet_group_name				= @checksheet_group_name
,	workcenter_code = @workcenter_code
,	use_yn			= @use_yn
,	remark			= @remark
,	update_dt			= getdate()	
,	update_user			= @update_user
where
	corp_id				= @corp_id
and fac_id				= @fac_id
and checksheet_group_code			= @checksheet_group_code
and group_type = 'CLEAN'
;