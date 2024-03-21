select
	code_id
,	code_name
,	remark
,	use_yn
,	create_user
,	[create_dt]
,	update_user
,	[update_dt]
from 
	dbo.tb_rework
where
	corp_id			= @corp_id
and	fac_id			= @fac_id
and	code_id			= @code_id
and code_name		= @code_name
and remark			= @remark
and use_yn			= @use_yn
and create_user		= @create_user
;