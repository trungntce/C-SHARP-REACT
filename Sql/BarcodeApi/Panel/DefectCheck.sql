select 
	count(*) as defect_count
from 
	tb_panel_defect tpd
where
	roll_id = @roll_id		and
	panel_id = @panel_id	and
	off_dt is NULL;