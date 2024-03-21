select
	corp_id,
	fac_id,
	worker_id,
	worker_name,
	row_key,
	create_dt,
	create_user,
	update_dt,
	update_user
from
	MES.dbo.tb_worker
where
	corp_id				= @corp_id
and	fac_id				= @fac_id
and worker_id			= @worker_id
;