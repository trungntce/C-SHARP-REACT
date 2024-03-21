update 
	dbo.tb_code
set 
	code_name		= @code_name
,	start_val		= @start_val
,	end_val			= @end_val
,	rule_val		= @rule_val
,	default_val		= @default_val
,	use_yn			= @use_yn
,	sort			= @sort
,	remark			= @remark
,	update_user		= @update_user
,	update_dt		= getdate()
where 
	corp_id			= @corp_id
and	fac_id			= @fac_id
and	codegroup_id	= @codegroup_id
and code_id			= @code_id
;
