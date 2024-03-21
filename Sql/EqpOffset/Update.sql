update
	dbo.tb_eqp_offset
set
	eqpareagroup_seq	= @eqpareagroup_seq
,	eqparea_seq			= @eqparea_seq
,	ext_mm				= round(convert(float, @ext_mm),1)
,	update_user			= @update_user
,	update_dt			= getdate()
where
	corp_id		= @corp_id
and fac_id		= @fac_id
and eqp_code	= @eqp_code
and ext_id		= @ext_id
;