select
	rework_code
,	remark
,	create_user
,	[create_dt]
,	update_user
,	[update_dt]
from 
	dbo.tb_roll_rework
where
	corp_id			= @corp_id
and	fac_id			= @fac_id
and	rework_code		= @rework_code
and remark			= @remark
and create_user		= @create_user
;