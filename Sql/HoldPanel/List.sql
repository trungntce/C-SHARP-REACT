select
	corp_id
,	fac_id
,	row_key
,	panel_id
,	on_remark
,	off_remark
,	hold_code
,	on_update_user
,	off_update_user
,	on_dt
,	off_dt
from 
	dbo.tb_panel_hold
where
	corp_id		  	 = @corp_id
and	fac_id			 = @fac_id
and	panel_id		 = @panel_id
and hold_code		 = @hold_code
order by
	on_dt desc
;