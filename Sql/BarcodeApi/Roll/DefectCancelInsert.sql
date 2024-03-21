update
	dbo.tb_roll_defect
set
	off_update_user = @off_update_user
,   off_remark = @off_remark
,	off_dt = getdate()
where
	roll_id = @roll_id
	and on_dt = (
		select
			max(on_dt)
		from
			dbo.tb_roll_defect
		where
			roll_id = @roll_id
	)
;