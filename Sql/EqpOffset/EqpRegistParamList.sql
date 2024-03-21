select
	a.map_id
,	a.ext_id
,	a.param_id
,	b.param_name
from
	tb_eqp_offset_param_map a
left join
	tb_param b
	on b.param_id = a.param_id 
where
	a.corp_id = @corp_id
and a.fac_id = @fac_id
and a.ext_id = @ext_id
order by a.param_id
;