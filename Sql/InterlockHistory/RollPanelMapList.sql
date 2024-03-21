select
	roll_id
,	panel_id
,   create_dt
from 
	dbo.tb_roll_panel_map
order by
	create_dt desc
;