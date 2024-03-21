select
	count(*) as cnt
from
	dbo.tb_panel_item
where
	panel_id = @panel_id
;