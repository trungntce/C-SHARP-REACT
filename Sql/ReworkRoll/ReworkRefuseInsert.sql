update
	dbo.tb_roll_rework
set
	refuse_update_user	= @refuse_update_user
,	rework_approve_yn	= @rework_approve_yn
,   refuse_remark		= @refuse_remark
,	refuse_dt			= getdate()
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