select
*
from
	dbo.tb_panel_4m_initial
where
	group_key =@group_key
	and end_dt is null