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
	corp_id			= @corp_id
and	fac_id			= @fac_id
and worker_id		collate SQL_Latin1_General_CP1_CI_AS like '%' + @worker_id + '%'
and worker_name		collate SQL_Latin1_General_CP1_CI_AS like '%' + @worker_name + '%'
and row_key			collate SQL_Latin1_General_CP1_CI_AS like '%' + @row_key + '%'
order by
	create_dt desc
offset 
	(@page_no - 1) * @page_size rows
fetch next 
	@page_size rows only
;