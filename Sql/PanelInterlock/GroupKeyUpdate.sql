declare @tbl table
(
	panel_interlock_id int
);

with cte as 
(
	select
		*
	from
		openjson(@panelJson)
		with
		(
			panel_interlock_id int '$.id'
		)
)
update
	dbo.tb_panel_interlock
set
	group_key		= @group_key
from
	dbo.tb_panel_interlock interlock
join
	cte
	on	interlock.panel_interlock_id = cte.panel_interlock_id
;
