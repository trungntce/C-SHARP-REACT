select
	ext_id,
	eqp_code,
	eqpareagroup_seq,
	eqparea_code
from
	dbo.tb_eqp_offset
where
	corp_id = @corp_id
and fac_id = @fac_id
and ext_id = @ext_id
;