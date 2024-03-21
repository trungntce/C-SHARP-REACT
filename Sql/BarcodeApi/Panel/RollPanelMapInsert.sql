if not exists (select * from tb_panel_item where panel_id = @panel_id)
begin
-- panel_ item
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
	,	@group_key
	,	@device_id
	,	@eqp_code
	,	@panel_id
	,	@scan_dt
	,	getdate()
end

if not exists (select * from tb_panel_realtime where panel_id = @panel_id)
begin
-- panel_realtime 
	insert into
	dbo.tb_panel_realtime
	(
		panel_id
	,   workorder
	,   model_code
	,   interlock_yn
	,   defect_yn
	,   rework_approve_yn
	,   create_dt
	,   update_dt

	)
	select
		@panel_id
	,   @workorder
	,   @model_code
	,   'N'
	,   'N'
	,   'N'
	,   getdate()
	,   getdate()
end

if not exists (select * from tb_roll_panel_map where panel_id =@panel_id)
begin
-- roll_panel_map 
	insert into
		dbo.tb_roll_panel_map
		(
			corp_id
		,   fac_id
		,   roll_id
		,   panel_id
		,   device_id
		,   workorder
		,   oper_seq_no
		,   oper_code
		,   eqp_code
		,   scan_dt
		,   create_dt
		)
	select
			@corp_id
		,   @fac_id
		,   @roll_id
		,   @panel_id
		,   @device_id
		,   @workorder
		,   @oper_seq_no
		,   @oper_code
		,   @eqp_code
		,   @scan_dt
		,   getdate()
end
