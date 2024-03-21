delete from dbo.tb_checksheet_item 
where checksheet_item_code = @checksheet_item_code 
	and eqp_code = @eqp_code;

update
	dbo.tb_checksheet
set
	rev = rev +1
,	update_dt			= getdate()	
,	update_user			= @update_user
where
	checksheet_code			= @checksheet_code
;