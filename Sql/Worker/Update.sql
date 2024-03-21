update
	dbo.tb_worker
set
	worker_name			= @worker_name
,	row_key				= @row_key
,	update_dt			= getdate()	
,	update_user			= @update_user
where
	corp_id				= @corp_id
and fac_id				= @fac_id
and worker_id			= @worker_id
;