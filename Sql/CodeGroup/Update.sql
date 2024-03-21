update 
	dbo.tb_codegroup
set 
	codegroup_name	= @codegroup_name
,	use_yn			= @use_yn
,	sort			= @sort
,	remark			= @remark
,	update_user		= @update_user
,	update_dt		= getdate()
where 
	corp_id			= @corp_id
and	fac_id			= @fac_id
and	codegroup_id	= @codegroup_id
;
