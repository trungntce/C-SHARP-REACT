delete from 
	dbo.tb_defectgroup
where 
	corp_id				= @corp_id
and	fac_id				= @fac_id
and	defectgroup_code	= @defectgroup_code
;
