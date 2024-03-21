select 
	count(*) total_cnt
from tb_bbt_data_tmp bbt
where 1 = 1
	--bbt.match_panel_id is not null
	and bbt.create_dt >= @from_date and bbt.create_dt < @to_date
	and bbt.model_code = @model_code
	and bbt.item_use_code = @app_code
    and bbt.oper_code = @oper_code
;
