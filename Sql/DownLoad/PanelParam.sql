select
	corp_id
, 	fac_id
, 	eqp_code
, 	param_id
, 	item_key
, 	panel_id
, 	param_name
, 	std
, 	lcl
, 	ucl
, 	lsl
, 	usl
, 	eqp_min_val
, 	eqp_max_val
, 	eqp_avg_val
, 	eqp_start_dt
, 	eqp_end_dt
, 	judge
, 	raw_type
, 	table_name
, 	column_name
, 	create_dt
from
	dbo.tb_panel_param
where
	corp_id = @corp_id
and fac_id = @fac_id
and create_dt >= @from_dt and create_dt < @to_dt