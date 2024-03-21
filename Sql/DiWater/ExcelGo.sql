
select
	[time]
,	eqcode
,	d006
from
	dbo.raw_diwater_11905
where
	[time] BETWEEN @start_dt AND @end_dt
union all
select
	[time]
,	eqcode
,	d006
from
	dbo.raw_diwater_11904
where
	[time] BETWEEN @start_dt AND @end_dt
union all
select
	[time]
,	eqcode
,	d006
from
	dbo.raw_diwater_11902
where
	[time] BETWEEN @start_dt AND @end_dt
union all
select
	[time]
,	eqcode
,	d006
from
	dbo.raw_diwater_11901
where
	[time] BETWEEN @start_dt AND @end_dt
union all
select
	[time]
,	eqcode
,	d006
from
	dbo.raw_diwater_11903
where
	[time] BETWEEN @start_dt AND @end_dt
order by
	[time] asc
offset 
	(@page_no - 1) * @page_size rows
fetch next 
	@page_size rows only
;
