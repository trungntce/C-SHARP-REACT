select
	a.eqp_code 
,	SSE.EQUIPMENT_DESCRIPTION
,	a.param_name 
,	a.param_id
,	a.cate_name 
,	a.table_name
,	a.column_name
from
	tb_param a
left join 
	tb_eqp_offset_param_map b
on b.corp_id	= a.corp_id  
and b.fac_id	= a.fac_id 
and b.param_id	= a.param_id
left join 
	erp_sdm_standard_equipment SSE
on SSE.EQUIPMENT_CODE = a.eqp_code
where 
	a.corp_id	= @corp_id
and a.fac_id	= @fac_id
and a.eqp_code	= @eqp_code
and a.param_id not in (select speed_param_id from tb_eqp_offset where speed_param_id is not null group by speed_param_id)
and b.param_id is null
order by a.param_id
;