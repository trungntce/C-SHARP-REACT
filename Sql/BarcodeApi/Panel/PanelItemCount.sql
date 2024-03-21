select 
	count(*) as result_value
from 
	tb_panel_item
where panel_group_key =@group_key