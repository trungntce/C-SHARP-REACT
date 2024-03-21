update
	dbo.tb_code
set 
	code_id				= @code_id
,	code_name			= @code_name
,	remark				= @remark
,	use_yn				= @use_yn
,	update_user			= @update_user
,	update_dt			= getdate()
where 
	corp_id			 = @corp_id
and	fac_id			 = @fac_id
and	codegroup_id	 = 'REWORKREASON'
and code_id			 = @code_id
;
