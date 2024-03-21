update 
	dbo.tb_healthcheck
set 
	hc_type			= @hc_type
,	hc_name			= @hc_name
,	tags			= @tags
,	use_yn			= @use_yn
,	sort			= @sort
,	remark			= @remark
,	update_user		= @update_user
,	update_dt		= getdate()
where 
	hc_code			= @hc_code
;
