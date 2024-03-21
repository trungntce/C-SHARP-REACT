delete from dbo.tb_checksheet_group_clean
where 
	checksheet_group_code = @checksheet_group_code 
	and item_code = @item_code;