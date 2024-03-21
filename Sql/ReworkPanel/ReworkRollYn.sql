update
	dbo.tb_panel_realtime
set
	rework_approve_yn = @rework_approve_yn
,	update_dt = getdate()
where
	panel_id IN (
        select 
            panel_id
        from
            tb_roll_panel_map
        where
            roll_id = @roll_id
);