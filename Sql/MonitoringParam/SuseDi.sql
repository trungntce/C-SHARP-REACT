select 
	a.inserttime as update_dt
,	a.converttime
, 	b.d002		as param_value
from (
select
	convert(varchar(16), inserttime, 20) as converttime, max(inserttime) as inserttime
from
	raw_surface_11015
where
	inserttime >= cast(@last_dt as datetime)
group by convert(varchar(16), inserttime, 20)
) a
join raw_surface_11015 b on a.inserttime = b.inserttime
order by a.inserttime