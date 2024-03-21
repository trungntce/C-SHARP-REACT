update
	dbo.tb_checksheet
set
	use_yn			= @use_yn
,	remark			= @remark
,	rev = rev + 1
,	valid_strt_dt			= @valid_strt_dt
,	valid_end_dt			= @valid_end_dt
,	update_dt			= getdate()	
,	update_user			= @update_user
where
	corp_id				= @corp_id
and fac_id				= @fac_id
and checksheet_code			= @checksheet_code
;