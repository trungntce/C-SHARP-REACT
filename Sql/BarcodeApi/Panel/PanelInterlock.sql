select 
	 panel_id
	,workorder
	,interlock_yn
	,defect_yn
	,rework_approve_yn
	,create_dt
	,update_dt
from 
	tb_panel_realtime
where
	panel_id = @panel_id