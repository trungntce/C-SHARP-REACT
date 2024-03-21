select 
	count(*) as cnt
from 
	tb_panel_item
where 
	panel_group_key = @panel_group_key	
and
	panel_id = @panel_id
