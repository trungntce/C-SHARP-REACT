
if(@roll_id <> '')
begin
	insert into
		dbo.tb_panel_defect (
			corp_id
		,	fac_id
		,	roll_id
		,	panel_id
		,	auto_yn
		,	on_remark
		,	defect_code
		,	on_update_user
		,	on_dt
			)
	select 
		@corp_id
	,   @fac_id
	,	map.roll_id
	,   @panel_id
	, 	@auto_yn
	,   @on_remark
	,   @defect_code
	,   @on_update_user
	,   GETDATE()
	from
		dbo.tb_roll_panel_map map
	where
		map.panel_id = @panel_id;
	
end
else
begin
	if exists (
		select 
			panel_id 
		from 
			tb_roll_panel_map 
		where 
			roll_id = @roll_id)
	begin
		insert into
			dbo.tb_panel_defect(
				corp_id
			,	fac_id
			,	roll_id
			,	panel_id
			,	auto_yn
			,	on_remark
			,	defect_code
			,	on_update_user
			,	on_dt
				)
		select 
			@corp_id
		,   @fac_id
		,	map.roll_id
		,   map.panel_id
		, 	@auto_yn
		,   @on_remark
		,   @defect_code
		,   @on_update_user
		,   GETDATE()
		from
			dbo.tb_roll_panel_map map
		where
			map.roll_id = @roll_id;
	end
	else
	begin
		insert into
			dbo.tb_panel_defect (
				corp_id
			,	fac_id
			,	roll_id
			,	panel_id
			,	auto_yn
			,	on_remark
			,	defect_code
			,	on_update_user
			,	on_dt
				)
		select 
			@corp_id
		,   @fac_id
		,	@roll_id
		,   ''
		, 	@auto_yn
		,   @on_remark
		,   @defect_code
		,   @on_update_user
		,   GETDATE()
	end
end

