select 
	a.panel_id
,	a.match_panel_id
,	a.panel_seq
,	a.mes_date
,	a.workorder
,	a.eqp_code
,	a.eqp_description as eqp_name
,	a.vendor_code
,	a.vendor_name
,	a.item_code
,	a.item_name
,	a.model_code
,	a.item_use_code as app_code
,	a.item_use_description as [app_name]
,	c.judge -- piece judge
,	case when @type = 'D' then b.judge when (insp_val < c.lsl or insp_val > c.usl) then 'NG' else 'OK' end as lsl_usl_judge
,	c.pin_judge
,	c.piece_no
,	c.pin_a
,	c.pin_b
,	c.lsl
,	c.usl
,	c.insp_val
,	c.mpd_insp_val
from
	dbo.tb_bbt a
join
	dbo.tb_bbt_piece b
	on	a.panel_id = b.panel_id
join
	dbo.tb_bbt_piece_ng c
	on	b.panel_id = c.panel_id
	and	b.piece_no = c.piece_no
where
	a.corp_id = @corp_id
and	a.fac_id = @fac_id
and a.mes_date >= @from_dt and a.mes_date < @to_dt
and a.eqp_code = @eqp_code
and	a.workorder like '%' + @workorder + '%'
and	a.vendor_code = @vendor_code
and	a.vendor_name like '%' + @vendor_name + '%'
and	a.item_code = @item_code
and	a.item_name like '%' + @item_name + '%'
and	a.model_code = @model_code
and a.item_use_code = @app_code
and a.panel_id = @panel_id
and	(@type = 'D' or c.method = 3 and c.lsl = 0)
and	(c.insp_val > c.usl or c.insp_val < c.lsl)
order by
	a.panel_id
,	a.panel_seq
,	c.piece_no
,	c.pin_a asc
offset 
	(@page_no - 1) * @page_size rows
fetch next 
	@page_size rows only
;