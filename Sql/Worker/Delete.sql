delete from
	dbo.tb_worker
where
	corp_id		= @corp_id
and fac_id		= @fac_id
and worker_id	= @worker_id
;