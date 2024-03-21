select
	defectgroup_code
,	defectgroup_name
,	use_yn
,	sort
,	remark
,	create_dt
,	create_user
,	update_dt
,	update_user
from 
	dbo.tb_defectgroup
where
	corp_id				= @corp_id
and	fac_id				= @fac_id
and	defectgroup_code	= @defectgroup_code
;