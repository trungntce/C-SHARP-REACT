select
	count(*) as cnt
from
	dbo.{0}
where
	equip = @eqp_code
and	dasinserttime >= @from_dt and dasinserttime < @to_dt
;