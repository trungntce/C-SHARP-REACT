update 
	dbo.tb_eqpareagroup
set 
	eqpareagroup_name	= @eqpareagroup_name
,	use_yn			= @use_yn
,	sort			= @sort
,	remark			= @remark
,	update_user		= @update_user
,	update_dt		= getdate()
,	usergroup_id	= @usergroup_id
where 
	corp_id				= @corp_id
and	fac_id				= @fac_id
and eqp_code			= @eqp_code
and	eqpareagroup_code	= @eqpareagroup_code
;
