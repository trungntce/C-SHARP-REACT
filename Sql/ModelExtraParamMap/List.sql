with cte as
(
    select
        model_extra.model_code
    ,   max(SIR.BOM_ITEM_DESCRIPTION) as model_description
    from
        tb_param_model_extra model_extra
    left join
        dbo.erp_sdm_item_revision SIR
        on SIR.BOM_ITEM_CODE = model_extra.model_code
    group by model_extra.model_code
) 
select
    cte.model_code
,   cte.model_description
from cte
where
    cte.model_code = @model_code;