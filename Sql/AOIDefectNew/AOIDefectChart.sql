with cte_ng as (
    select 
        sum(defect_cnt) ng_cnt
    from tb_aoi_data_tmp v_aoi
    where create_dt >= @from_date and create_dt < @to_date
            and v_aoi.model_code = @model_code
            and v_aoi.app_code = @app_code
            and v_aoi.model_description like '%' + @model_name + '%'
            and v_aoi.oper_code = @oper_code
            and ngcode in (select value from STRING_SPLIT( @ng_codes, ','))
    group by workorder, oper_seq_no
)

select 
    sum(pcs_cnt) pcs_cnt, 
    sum(ng_pcs_cnt) ng_pcs_cnt,
    isnull((select isnull(sum(ng_cnt), 0) from cte_ng), 0) ng_cnt
from (
    select 
        max(pcs_total) pcs_cnt,
	    max(ng_pcs_total) ng_pcs_cnt
    from tb_aoi_data_tmp v_aoi
    where create_dt >= @from_date and create_dt < @to_date
            and v_aoi.model_code = @model_code
            and v_aoi.app_code = @app_code
            and v_aoi.model_description like '%' + @model_name + '%'
            and v_aoi.oper_code = @oper_code
    group by workorder, oper_seq_no
) tbl
;