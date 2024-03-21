select 
	usergroup_id
,	usergroup_name
,	remark
,	create_user
,	create_dt
,	update_user
,	update_dt
from 
	dbo.tb_usergroup
where
	corp_id = @corp_id
and	fac_id = @fac_id
and	usergroup_id = @usergroup_id
and usergroup_name like '%' + @usergroup_name + '%'
and	remark like '%' + @remark + '%'
and usergroup_id in (select [value] from openjson(@usergroup_json))
order by
	create_dt desc
offset 
	(@page_no - 1) * @page_size rows
fetch next 
	@page_size rows only
;