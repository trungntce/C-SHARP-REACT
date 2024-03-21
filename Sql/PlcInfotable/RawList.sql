/*
with cte as 
(
	select
		[time]
	,	mesdate
	,	eqcode
	,	[count]
	,	starttime
	,	endtime
	,	eqstatus
	,	inserttime
	{1}
	from
		dbo.{0}
	where
		[time] >= @from_dt and [time] < @to_dt
	and (@endtime_yn = 'N' or (@endtime_yn = 'Y' and endtime != ''))
	order by
		[time] asc
	offset 
		(@page_no - 1) * @page_size rows
	fetch next 
		@page_size rows only
), cte2 as
(
	select
		*
	,	lag(endtime) over (order by endtime) as prev_endtime
	from
		cte
)
select
	*
,	datediff(ss, nullif(prev_endtime, ''), endtime)	as endtime_diff
from
	cte2
;
*/

select
    [time]
,   mesdate
,   eqcode
,   [count]
,   starttime
,   endtime
,   eqstatus
,   inserttime
	{1}
from 
	dbo.{0}
where
	inserttime >=  @from_dt and inserttime < @to_dt
and (@endtime_yn = 'N' or (@endtime_yn = 'Y' and endtime != ''))
order by
	[time]  desc
offset
	(@page_no - 1) * @page_size rows
fetch next
	@page_size rows only
;