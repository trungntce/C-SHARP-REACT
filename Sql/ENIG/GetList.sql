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
				inserttime >= case when @to_dt = '1' then dateadd(day,-@from_dt,getdate()) else dateadd(day,-@from_dt,@to_dt) end 
				and inserttime <= case when @to_dt = '1' then getdate() else cast(@to_dt as datetime) end
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
				inserttime >= case when @to_dt = '1' then dateadd(day,-@from_dt,getdate()) else dateadd(day,-@from_dt,@to_dt) end 
				and inserttime <= case when @to_dt = '1' then getdate() else cast(@to_dt as datetime) end
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

