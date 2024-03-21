select
	*
from
	dbo.tb_panel_realtime
where
	workorder = @workorder
order by
	panel_id asc
;