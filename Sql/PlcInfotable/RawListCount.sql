select
	count(*) as cnt
from
	dbo.{0}
where
	inserttime >= @from_dt and inserttime < @to_dt
;