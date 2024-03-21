select 
	count(*) as cnt
from 
	dbo.tb_panel_item
where 
	panel_group_key = @panel_group_key;