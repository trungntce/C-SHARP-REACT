update
	dbo.tb_panel_interlock
set
	interlock_code		= @interlock_code
,	on_remark			= @on_remark
,	on_update_user		= @on_update_user
,	on_dt				= getdate()
where
	corp_id				= @corp_id
and	fac_id				= @fac_id
and	panel_interlock_id  = @panel_interlock_id
and on_dt				= @on_dt
;