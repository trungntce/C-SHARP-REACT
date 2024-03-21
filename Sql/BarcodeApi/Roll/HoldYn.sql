update
	dbo.tb_roll_realtime
set
	hold_yn = @hold_yn
,	update_dt = getdate()
where
	roll_id = @roll_id
;