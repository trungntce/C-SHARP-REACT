delete from
	dbo.tb_checksheet_group
where
	corp_id		= @corp_id
and fac_id		= @fac_id
and group_type = @group_type
and checksheet_group_code	= @checksheet_group_code
;