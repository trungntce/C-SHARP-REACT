select
	notice_no
,	title
,	body
,	start_dt
,	end_dt
,	use_yn
,	update_dt
,	update_user
from 
	dbo.tb_notice
where
	corp_id			= @corp_id
and	fac_id			= @fac_id
and notice_no		= @notice_no
and	title			= @title
and use_yn			= @use_yn
order by
	create_dt desc
offset 
	(@page_no - 1) * @page_size rows
fetch next 
	@page_size rows only
;