delete from 
	dbo.tb_notice
where 
	corp_id			= @corp_id
and	fac_id			= @fac_id
and notice_no		= @notice_no
;
