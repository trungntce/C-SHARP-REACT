insert into
	dbo.tb_panel_interlock (
		corp_id
	,	fac_id
	,	roll_id
	,	panel_id
	--,	item_key
	,	auto_yn
	,	on_remark
	,	interlock_code
	,	on_update_user
	,	on_dt
		)
select 
    @corp_id
,   @fac_id
,	map.roll_id
,   @panel_id
--,	@item_key
, 	@auto_yn
,   @on_remark
,   @interlock_code
,   @on_update_user
,   GETDATE()
from
    dbo.tb_roll_panel_map map
where
    map.panel_id = @panel_id
;