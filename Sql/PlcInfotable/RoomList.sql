with cte as
(
	select distinct
		upper(roomname) as room_name
	,	eqcode
	from
		dbo.raw_plcsymbol_infotable
)
select
	room_name
,	room_name + ' (' + cast(count(*) as varchar) + ' tables)' as cnt
from 
	cte
group by
	room_name
;