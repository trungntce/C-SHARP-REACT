delete from
	dbo.tb_oper_ext
where 
	corp_id			= @corp_id
and	fac_id			= @fac_id
and	operation_code	= @operation_code
;
