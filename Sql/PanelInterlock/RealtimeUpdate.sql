with cte as 
(
	select
		*
	from
		openjson(@json)
		with
		(
			panel_id varchar(50) '$.panelId'
		)
)
update
	dbo.tb_panel_realtime
set
	interlock_yn = @interlock_yn
,	update_dt = getdate()
from
	dbo.tb_panel_realtime realtime
join
	cte
	on	realtime.panel_id = cte.panel_id
;
