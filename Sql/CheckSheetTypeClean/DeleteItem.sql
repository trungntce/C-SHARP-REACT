delete from tb_checksheet_item_clean
where checksheet_code = @checksheet_code 
	and item_code = @item_code;


update
	dbo.tb_checksheet
set
	rev = rev +1
,	update_dt			= getdate()	
,	update_user			= @update_user
where
	checksheet_code			= @checksheet_code
;