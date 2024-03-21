if exists
( 
	select
		*
	from 
		tb_panel_scanner_count 
	where 
		panel_group_key=@panel_group_key
)
begin
	update 
		tb_panel_scanner_count 
	set 
		total_count = @total_count
	,	update_dt = getdate()
	where 
		panel_group_key = @panel_group_key
end
else
begin
	insert into 
		dbo.tb_panel_scanner_count
	(
		corp_id
	,   fac_id
	,   panel_group_key
	,   device_id
	,   eqp_code
	,   total_count
	,   trigger_count
	,   scan_dt
	,   create_dt
	,	update_dt
	)
	select
		@corp_id
	,   @fac_id
	,   @panel_group_key
	,   @device_id
	,   @eqp_code
	,   @total_count
	,   0 -- GNG 쪽에서 작업 완료되면 trigger count 추가
	,   @scan_dt
	,   getdate()
	,   getdate()
	;
end