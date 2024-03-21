select
	a.corp_id,
	a.fac_id,
	a.work_date,
	a.worker_id,
	b.worker_name,
	a.off_date,
	a.work_yn,
	a.shift_type,
	a.remark,
	a.create_dt,
	a.create_user
from
	dbo.tb_calendar a 
left 
join dbo.tb_worker b
  on b.worker_id = a.worker_id 
where
	  a.corp_id		= @corp_id
  and a.fac_id		= @fac_id
  and a.work_date		between @from_dt and @to_dt
  and a.worker_id		= @worker_id
order by
	a.create_dt desc
offset 
	(@page_no - 1) * @page_size rows
fetch next 
	@page_size rows only
;