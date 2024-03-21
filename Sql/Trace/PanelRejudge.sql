update
	dbo.tb_panel_item
set
	param_judge = null
,	recipe_judge = null
where
	panel_group_key = @group_key
;

declare @from_dt datetime;
declare @to_dt datetime;

select top 1
	@from_dt = start_dt
,	@to_dt = end_dt
from
	dbo.tb_panel_4m
where
	group_key = @group_key
;

exec sp_panel_param_insert_range @from_dt, @to_dt, @group_key, null;
exec sp_panel_recipe_insert_range @from_dt, @to_dt, @group_key, null;