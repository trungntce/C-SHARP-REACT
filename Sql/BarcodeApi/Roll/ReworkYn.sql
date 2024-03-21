update
	dbo.tb_roll_realtime
set
	rework_approve_yn = @rework_approve_yn
,	update_dt = getdate()
where
	roll_id = @roll_id
;