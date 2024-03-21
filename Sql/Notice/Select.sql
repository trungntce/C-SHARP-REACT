select
	notice_no
,	title
,	body
,	start_dt
,	end_dt
,	use_yn
,	create_dt
,	create_user
,	update_dt
,	update_user
from 
	dbo.tb_notice
where
	corp_id			= @corp_id
and	fac_id			= @fac_id
and notice_no		= @notice_no
;