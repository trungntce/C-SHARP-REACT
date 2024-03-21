update
	dbo.tb_roll_rework
set
	approve_update_user = @approve_update_user
,	rework_approve_yn	= @rework_approve_yn
,   approve_remark = @approve_remark
,	approve_dt = getdate()
where
	roll_id = @roll_id
	and put_dt = (
		select
			max(put_dt)
		from
			dbo.tb_roll_rework
		where
			roll_id = @roll_id
	)
;