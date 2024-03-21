delete from dbo.tb_checksheet_group_eqp 
where checksheet_group_code = @checksheet_group_code 
	and eqp_code = @eqp_code;