delete from
	dbo.tb_checksheet
where
	corp_id		= @corp_id
and fac_id		= @fac_id
and checksheet_code	= @checksheet_code
;