select
	oper_group_code 
	, unit
	, cast(ROUND(in_capa_val * (dbo.fn_get_timediff_hours() / 24.0), 2) as DECIMAL(10, 2)) as CAPA
from
	tb_oper_capa
;