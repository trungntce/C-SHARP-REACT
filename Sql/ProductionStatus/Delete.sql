delete from 
	dbo.tb_code
where 
	corp_id			= @corp_id
and	fac_id			= @fac_id
and	codegroup_id	= @codegroup_id
and code_id			= @code_id
;
