update
	dbo.tb_calendar
set
	off_date			= @off_date,
	work_yn				= @work_yn,
	shift_type			= @shift_type,
	remark				= @remark,
	update_dt			= getdate(),
	update_user			= @update_user
where
	corp_id			= @corp_id	
and fac_id			= @fac_id	
and work_date		= @work_date
and worker_id		= @worker_id
;