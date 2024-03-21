delete from
	dbo.tb_error_code
where
	corp_id			= @corp_id
and	fac_id			= @fac_id
and error_code		= @error_code
;
