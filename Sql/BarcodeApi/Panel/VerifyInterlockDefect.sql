select 
	*
from
	tb_roll_panel_map
where
	roll_id = @roll_id
	and 
	panel_id = @panel_id
;