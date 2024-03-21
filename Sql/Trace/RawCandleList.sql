with cte as
(
	select
		{1} as val
	,	inserttime
	from
		dbo.{0}
	where
		inserttime >= @from_dt and inserttime <= @to_dt
	{2}
), cte2 as
(
	select
		min(val) as min_val
	,	max(val) as max_val
	,	round(avg(cast(val as float)), 3) as avg_val
	,	min(inserttime) as start_dt
	,	max(inserttime) as end_dt
	,	left(format(inserttime, @format), @left) + @right_pad as inserttime
	from
		cte
	group by
		left(format(inserttime, @format), @left) + @right_pad
)
select
	cte2.*
,	[start].val as start_val
,	[end].val as end_val
from
	cte2
join
	cte [start]
	on	cte2.start_dt = [start].inserttime
join
	cte [end]
	on	cte2.end_dt = [end].inserttime
order by
	cte2.inserttime
;