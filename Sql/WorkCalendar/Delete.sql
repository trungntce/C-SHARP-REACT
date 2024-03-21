delete from
	dbo.tb_calendar
where
	corp_id		= @corp_id
and fac_id		= @fac_id
and work_date	= @work_date
and worker_id	= @worker_id
;
