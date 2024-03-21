delete from 
	dbo.tb_eqpareagroup
where 
	corp_id				= @corp_id
and	fac_id				= @fac_id
and eqp_code			= @eqp_code
and	eqpareagroup_code	= @eqpareagroup_code
;

delete from
	dbo.tb_eqparea
where 
	corp_id				= @corp_id
and	fac_id				= @fac_id
and	eqpareagroup_code	= @eqpareagroup_code
;