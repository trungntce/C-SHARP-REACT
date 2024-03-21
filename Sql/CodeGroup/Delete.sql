delete from 
	dbo.tb_codegroup
where 
	corp_id			= @corp_id
and	fac_id			= @fac_id
and	codegroup_id	= @codegroup_id
;
