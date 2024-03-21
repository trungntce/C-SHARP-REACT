delete from 
	dbo.tb_panel_defect
where 
	corp_id			= @corp_id
and	fac_id			= @fac_id
and	panel_id		= @panel_id
and on_dt			= @on_dt
;