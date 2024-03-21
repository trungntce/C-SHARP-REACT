update 
	dbo.tb_notice
set 
	title			= @title
,	body			= @body
,	start_dt		= @start_dt
,	end_dt			= @end_dt
,	use_yn			= @use_yn
,	update_user		= @update_user
,	update_dt		= getdate()
where 
	corp_id			= @corp_id
and	fac_id			= @fac_id
and	notice_no		= @notice_no
;
