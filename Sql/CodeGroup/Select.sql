select
	codegroup_id
,	codegroup_name
,	use_yn
,	sort
,	remark
,	create_dt
,	create_user
,	update_dt
,	update_user
from 
	dbo.tb_codegroup
where
	corp_id			= @corp_id
and	fac_id			= @fac_id
and	codegroup_id	= @codegroup_id
;