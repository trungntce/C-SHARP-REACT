select
	corp_id
,	fac_id
,	roll_id
,	panel_id
,	interlock_code
,	item_key
,   auto_yn
,	on_remark
,	off_remark
,	on_update_user
,	off_update_user
,	on_dt
,	off_dt
from 
	dbo.tb_panel_interlock
where
	corp_id		  	 = @corp_id
and	fac_id			 = @fac_id
and	panel_id		 = @panel_id
and roll_id			 = @roll_id
and auto_yn			 = @auto_yn
and off_dt IS NOT NULL
order by
	on_dt desc
;