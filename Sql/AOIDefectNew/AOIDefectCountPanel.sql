with cte as
(
	select max(v_aoi.panel_qty) panel_qty
	from tb_aoi_data_tmp v_aoi
	where v_aoi.create_dt >= @from_date and v_aoi.create_dt < @to_date
			and v_aoi.model_code = @model_code
			and v_aoi.oper_code = @oper_code
			and v_aoi.app_code = @app_code
			and v_aoi.item_code = @item_code
	group by 
			   v_aoi.workorder
		,       v_aoi.oper_seq_no
)
select sum(panel_qty) total_cnt
from cte
;