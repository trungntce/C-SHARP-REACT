with cte as
(
	select distinct
		roomname as room_name
	,	tablename as table_name
	from
		dbo.raw_pc_infotable
)
select
	room_name
,	room_name + ' (' + cast(count(*) as varchar) + ' types)' as cnt
from 
	cte
group by
	room_name
;