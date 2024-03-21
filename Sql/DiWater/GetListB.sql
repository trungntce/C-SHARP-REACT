declare @search_dt datetime = dateadd(day,-@from_dt,getdate());
	
declare @am8 datetime;
select @am8 = dateadd(hour, 8, cast(cast(@search_dt as date) as datetime));

if datepart(hour, @search_dt) < 8
        select @am8 = dateadd(dd, -1, @am8);

with cte as 
(
	select
		code_id		as eqp_code
	,	code_name	as eqp_name
	from
		tb_code
	where
		code_id = @eqp_code
)
select
	b.eqcode 		as eqp_code
,	c.eqp_name		as eqp_name
,	a.converttime	as std_time
,	b.{0}			as value
,	case when upper(@param_name) like '%DIWATER%' then 'diwater'
		when upper(@param_name) like '%INPUT%' then 'input'
		when upper(@param_name) like '%OUTPUT%' then 'output' end as param_name
from
	(
		select
			min(inserttime) as inserttime
		,	DATEADD(MINUTE, DATEDIFF(MINUTE, 0, inserttime) / 5 * 5, 0) as converttime
		from
			dbo.{1}
		where
			inserttime >= dateadd(day,-@from_dt,getdate()) and inserttime < getdate()
		group by dateadd(mi, datediff(mi, 0, inserttime) / 5 * 5, 0)
	) a
join
	dbo.{1} b
	on a.inserttime = b.inserttime
left join
	cte c
	on c.eqp_code = b.eqcode 