select
	*
from
	tb_healthcheck_down_his
where
	type_code in ('E')
and
	insert_dt >= @from_dt and insert_dt < @to_dt
	and eqp_code like '%' + @eqp_code + '%'
;