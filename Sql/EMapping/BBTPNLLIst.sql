select
		match_panel_id as panel_id
	,	panel_id as panel_mk_seq
	,	panel_seq
	,	mes_date
	,	workorder
	,	eqp_code
	,	eqp_description as eqp_name
	,	vendor_code
	,	vendor_name
	,	item_code
	,	item_name
	,	item_use_code
	,	item_use_description as [app_name]
	,	model_code
	,	start_dt
	,	end_dt
	,	ok_cnt
	,	ng_cnt
	,	create_dt
from
	dbo.tb_bbt
where
	corp_id = @corp_id
and	fac_id = @fac_id
and create_dt >= @from_dt and create_dt < @to_dt
and item_code = @item_code
and	workorder like '%' + @workorder + '%'
and (panel_id like '%' + @panel_id + '%' or match_panel_id like '%' + @panel_id + '%')
and item_code is not null
;