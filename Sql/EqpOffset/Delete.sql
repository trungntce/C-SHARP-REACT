delete from
	dbo.tb_eqp_offset
where
	corp_id		= @corp_id
and fac_id		= @fac_id
and ext_id		= @ext_id
;

delete from
	dbo.tb_eqp_offset_param_map
where
	corp_id		= @corp_id
and fac_id		= @fac_id
and ext_id		= @ext_id
;