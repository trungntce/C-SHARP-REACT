with cte_ng as (
    select 
		count(1) as ng_cnt
    from tb_bbt bbt
	join dbo.tb_bbt_piece b on b.panel_id = bbt.panel_id
	join dbo.tb_code c
		on	b.judge = c.code_id
		and c.codegroup_id = 'BBT_DEFECT_MPD'
	where bbt.create_dt >= @from_date and bbt.create_dt < @to_date
		and bbt.model_code = @model_code
		and bbt.item_use_code = @app_code
		and bbt.model_description like '%' + @model_name + '%'
		and c.code_id in (select value from STRING_SPLIT( @ng_codes, ','))
	group by bbt.workorder, c.code_id
)

select 
	  isnull(sum(bbt.ok_cnt + bbt.ng_cnt), 0) pcs_cnt
	, isnull(sum(bbt.ng_cnt), 0) ng_pcs_cnt
	, isnull((select isnull(sum(ng_cnt), 0) from cte_ng), 0) ng_cnt
from tb_bbt_data_tmp bbt
where bbt.create_dt >= @from_date and bbt.create_dt < @to_date
	and bbt.model_code = @model_code
	and bbt.item_use_code = @app_code
    and bbt.oper_code = @oper_code
	and bbt.model_description like '%' + @model_name + '%'
group by bbt.model_code
--bbt.workorder, bbt.oper_code
	;
