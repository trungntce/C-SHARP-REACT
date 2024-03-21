select
	corp_id
,	fac_id
,	code_id
,	code_name
,	remark
,	use_yn
,	create_user
,	create_dt
,	update_user
,	update_dt
from 
	dbo.tb_code
where
	corp_id			= @corp_id
and	fac_id			= @fac_id
and codegroup_id	= 'REWORKREASON'
and code_id 		like '%' + @code_id + '%'
and code_name		like '%' + @code_name + '%'
order by
	create_dt desc
offset 
	(@page_no - 1) * @page_size rows
fetch next 
	@page_size rows only
;
--select
--	corp_id
--,	fac_id
--,	rework_code
--,	rework_name
--,	rework_type
--,	remark
--,	use_yn
--,	create_user
--,	create_dt
--,	update_user
--,	update_dt
--from 
--	dbo.tb_rework
--where
--	corp_id			= @corp_id
--and	fac_id			= @fac_id
--and rework_code		like '%' + @rework_code + '%'
--and rework_name		like '%' + @rework_name + '%'
--and rework_type		like '%' + @rework_type + '%'
--order by
--	create_dt desc
--offset 
--	(@page_no - 1) * @page_size rows
--fetch next 
--	@page_size rows only
--;

