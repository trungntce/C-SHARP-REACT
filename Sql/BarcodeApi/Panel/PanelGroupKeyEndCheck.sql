declare @count int;

select
	@count = count(*) 
from 
	tb_panel_4m 
where
	group_key = @panel_group_key and 
	end_dt is not null;


if (@count > 0)
begin
	--여기 insert 로직
	insert into 
		dbo.tb_panel_item
	(
		corp_id
	,	fac_id
	,	item_key
	,	panel_group_key
	,	device_id
	,	eqp_code
	,	panel_id
	,	scan_dt
	,	create_dt
	)
	select
		@corp_id
	,	@fac_id				
	,	@item_key
	,	'NO4M'
	,	@device_id
	,	@eqp_code
	,	@panel_id
	,	@scan_dt
	,	getdate()
	
end

select @count as count;
return;