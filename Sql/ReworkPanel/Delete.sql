delete from 
	dbo.tb_panel_rework
where 
	corp_id			= @corp_id
and	fac_id			= @fac_id
and	panel_id		= @panel_id
and put_dt			= @put_dt
;