select
	hold_code
,	remark
,	create_user
,	[create_dt]
,	update_user
,	[update_dt]
from 
	dbo.tb_roll_hold
where
	corp_id			= @corp_id
and	fac_id			= @fac_id
and	hold_code		= @hold_code
and remark			= @remark
and create_user		= @create_user
;