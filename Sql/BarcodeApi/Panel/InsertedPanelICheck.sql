select 
	count(*) as cnt
from 
	tb_panel_item
where 
	panel_id = @panel_id