select top 1
	interlock_yn
from
	dbo.tb_panel_realtime
where
	panel_id = @panel_id
;