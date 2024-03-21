select
	codegroup_id
,	code_id
,	code_name
,	start_val
,	end_val
,	rule_val
,	default_val
,	use_yn
,	sort
,	remark
,	create_dt
,	create_user
,	update_dt
,	update_user
from 
	dbo.tb_code
where
	corp_id			= @corp_id
and	fac_id			= @fac_id
and	codegroup_id	= @codegroup_id
and	code_id			= @code_id
and	code_name		like '%' + @code_name + '%'
and use_yn			= @use_yn
and remark			like '%' + @remark + '%'
order by
	sort
;