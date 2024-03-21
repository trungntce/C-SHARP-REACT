update 
	dbo.tb_eqparea
set 
	eqparea_name	= @eqparea_name
,	use_yn			= @use_yn
,	sort			= @sort
,	remark			= @remark
,	update_user		= @update_user
,	update_dt		= getdate()
where 
	corp_id				= @corp_id
and	fac_id				= @fac_id
and	eqpareagroup_code	= @eqpareagroup_code
and eqparea_code		= @eqparea_code
;
