select 
	hc_code
,	hc_type
,	hc_name
,	tags
,	use_yn
,	sort
,	remark
,	create_dt
,	create_dt
,	create_user
,	update_dt
,	update_user
from
	dbo.tb_healthcheck
where
	1=1
and	hc_code = @hc_code
and hc_name like '%' + @hc_name + '%'
and hc_type = @hc_type
and tags like '%' + @tags + '%'
and use_yn = @use_yn
and remark like '%' + @remark + '%'
order by
	sort asc
;