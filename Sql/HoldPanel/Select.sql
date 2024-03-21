select
	defect_code
,	create_user
,	[create_dt]
,	update_user
,	[update_dt]
from 
	dbo.tb_panel_defect
where
	corp_id			= @corp_id
and	fac_id			= @fac_id
and	defect_code		= @defect_code
and create_user		= @create_user
;