select 
	count (*) as cmi_count
from
	tb_panel_cmi
where
	panel_id = @panel_id