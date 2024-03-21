delete from 
	dbo.tb_eqparea
where 
	corp_id				= @corp_id
and	fac_id				= @fac_id
and	eqpareagroup_code	= @eqpareagroup_code
and eqparea_code		= @eqparea_code
;
