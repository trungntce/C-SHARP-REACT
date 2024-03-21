delete from 
	dbo.tb_errorgroup
where 
	corp_id			= @corp_id
and	fac_id			= @fac_id
and	errorgroup_code	= @errorgroup_code
;
