with cte as 
(
	select
		a.converttime
	,	b.{0} as value  --voltage
	from
		(
			select
				DATEADD(MINUTE, DATEDIFF(MINUTE, 0, inserttime) / 5 * 5, 0) as converttime
				,min(inserttime) as inserttime  
			from
				dbo.{1}
			where
				inserttime >= cast(@from_dt as date) and inserttime < cast(dateadd(day,1,@to_dt) as date)
			group by DATEADD(MINUTE, DATEDIFF(MINUTE, 0, inserttime) / 5 * 5, 0)
		) a
	join
		dbo.{1} b
		on a.inserttime = b.inserttime 
),cte2 as 
(
	select
		a.converttime
	,	b.{2} as value
	from
		(
			select
				DATEADD(MINUTE, DATEDIFF(MINUTE, 0, inserttime) / 5 * 5, 0) as converttime
				,min(inserttime) as inserttime  
			from
				dbo.{3}
			where
				inserttime >= cast(@from_dt as date) and inserttime < cast(dateadd(day,1,@to_dt) as date)
			group by DATEADD(MINUTE, DATEDIFF(MINUTE, 0, inserttime) / 5 * 5, 0)
		) a
	join
		dbo.{3} b
		on a.inserttime = b.inserttime 
)
select
	@eqp_name as eqp_name
,	a.converttime
,	a.value	as value
,	b.converttime
,	b.value as value1 
from
	cte a
full join
	cte2 b
	on a.converttime = b.converttime
order by
	 a.converttime asc
;

