﻿update
	dbo.tb_defect
set
	defect_name		= @defect_name
,	use_yn			= @use_yn
,	sort			= @sort
,	remark			= @remark
,	update_user		= @update_user
,	update_dt		= getdate()
where
	corp_id			= @corp_id
and	fac_id			= @fac_id
and defect_code		= @defect_code
;