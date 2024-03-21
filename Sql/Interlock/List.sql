select
	corp_id
,	fac_id
,	interlock_code
,	interlock_name
,	interlock_type
,	remark
,	use_yn
,	create_user
,	create_dt
,	update_user
,	update_dt
from 
	dbo.tb_interlock
where
	corp_id			= @corp_id
and	fac_id			= @fac_id
and interlock_code	like '%' + @interlock_code + '%'
and interlock_name	like '%' + @interlock_name + '%'
and interlock_type	like '%' + @interlock_type + '%'
order by
	create_dt desc
offset 
	(@page_no - 1) * @page_size rows
fetch next 
	@page_size rows only
;