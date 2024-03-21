update
	dbo.tb_panel_defect
set
	defect_code			= @defect_code
,	on_remark			= @on_remark
,	on_update_user		= @on_update_user
,	on_dt				= getdate()
where
	corp_id				= @corp_id
and	fac_id				= @fac_id
and	panel_defect_id		= @panel_defect_id
;