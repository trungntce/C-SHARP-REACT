select
	{1} as val
,	inserttime
from
	dbo.{0}
where
	inserttime between @from_dt and @to_dt
{2}
order by
	inserttime asc
;