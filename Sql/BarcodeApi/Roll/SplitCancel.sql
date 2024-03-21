delete
	dbo.tb_roll_map 
where 
	parent_id = @parent_id 

update  
	dbo.tb_roll_panel_map 
set 
    roll_id  = @parent_id 
where 
	roll_id like  @barcode +'%'