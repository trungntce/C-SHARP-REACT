select
	interlock_code
,	interlock_name
,	interlock_type
,	remark
,	use_yn
,	create_user
,	[create_dt]
,	update_user
,	[update_dt]
from 
	dbo.tb_interlock
where
	corp_id			= @corp_id
and	fac_id			= @fac_id
and	interlock_code	= @interlock_code
and interlock_name	= @interlock_name
and interlock_type  = @interlock_type
and remark			= @remark
and use_yn			= @use_yn
and create_user		= @create_user
;