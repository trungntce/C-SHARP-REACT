delete from 
	dbo.tb_interlock
where 
	corp_id			= @corp_id
and	fac_id			= @fac_id
and	interlock_code	= @interlock_code
;