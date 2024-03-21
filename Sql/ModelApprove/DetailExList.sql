WITH cte_oper AS (
          SELECT
                a.model_code,
                a.operation_seq_no,
                a.operation_code,
                JSON_TABLE.*
        FROM tb_model_oper_ext_request as a
        CROSS APPLY OPENJSON(a.eqp_json) WITH (
                eqp_code VARCHAR(50) '$.eqpCode',
                eqp_desc NVARCHAR(255) '$.eqpDesc',
                workcenter_code VARCHAR(50) '$.workcenterCode',
                workcenter_desc NVARCHAR(255) '$.workcenterDesc',
                use_yn VARCHAR(10) '$.useYn'
        ) AS JSON_TABLE
        WHERE a.model_code = @model_code
        and a.operation_code = @oper_code
),
cte as
(
select distinct
        pm.model_code
,       pm.recipe_change_yn
,       pm.operation_seq_no as p_number
,       pm.operation_code as p_code
,       pm.eqp_code  as e_code
,       pm.group_code as group_code
,       null as sv_code
,       null as sv_name
,       null  as sv_std
,       a.param_name as pv_name
,       a.std as pv_std
,       a.lcl as pv_lcl
,       a.ucl   as pv_ucl
,       a.lsl   as pv_lsl
,       a.usl   as pv_usl
,       a.param_id as pv_code
,		grp.group_name
,		'PV' as type
from
        dbo.tb_param a
join dbo.tb_param_model_request_data pm
    on pm.eqp_code = a.eqp_code
    and pm.group_code = a.group_code
left join tb_param_recipe_group grp ON a.group_code = grp.group_code and a.corp_id = grp.corp_id and a.fac_id = grp.fac_id
where
        a.corp_id   = 'SIFLEX'
and a.fac_id    = 'SIFLEX'
and pm.model_code  = @model_code
and pm.request_id  = @request_id
and pm.operation_code = @oper_code
union
select distinct
        rm.model_code
,       rm.recipe_change_yn
,       rm.operation_seq_no as p_number
,       rm.operation_code as p_code
,       rm.eqp_code  as e_code
,       rm.group_code as group_code
,       a.recipe_code as sv_code
,       a.recipe_name as sv_name
,       a.base_val  as sv_std
,       null as pv_name
,       null as pv_std
,       null as pv_lcl
,       null   as pv_ucl
,       null   as pv_lsl
,       null   as pv_usl
,       null as pv_code
,		grp.group_name
,		'SV' as type
from
        dbo.tb_recipe a
left join dbo.tb_recipe_model_request_data rm
    on rm.eqp_code = a.eqp_code
    and rm.group_code = a.group_code
left join tb_param_recipe_group grp ON a.group_code = grp.group_code and a.corp_id = grp.corp_id and a.fac_id = grp.fac_id
where
        a.corp_id   = 'SIFLEX'
and a.fac_id    = 'SIFLEX'
and rm.model_code  = @model_code
and rm.request_id  = @request_id
and rm.operation_code = @oper_code
), cte_output as
(
SELECT
    cte.model_code,
    cte.recipe_change_yn,
    cte.p_number,
    cte.p_code,
    cte.e_code,
        cte.group_code as recipe_code,
        cte.group_name as recipe_name,
        cte.type as p_type,
        case when type = 'SV' then
                        cte.sv_code
                else
                        cte.pv_code
                end sv_pv_code,
        case when type = 'SV' then
                        cte.sv_name
                else
                        cte.pv_name
        end sv_pv_name,
        cte.sv_std,
        cte.pv_std,
        cte.pv_lcl,
        cte.pv_ucl,
        cte.pv_lsl,
        cte.pv_usl,
        @rev_code as rev_code
FROM cte
union
select distinct
        cte_oper.model_code
,       'N'
,       cte_oper.operation_seq_no as p_number
,       cte_oper.operation_code as p_code
,       cte_oper.eqp_code  as e_code
,       null as recipe_code
,       null as recipe_name
,       null as p_type
,       null as sv_pv_code
,       null as sv_pv_name
,       null  as sv_std
,       null as pv_std
,       null as pv_lcl
,       null   as pv_ucl
,       null   as pv_lsl
,       null   as pv_usl
,       @rev_code as rev_code
from cte_oper
where cte_oper.use_yn = 'Y'
and cte_oper.eqp_code not in (select e_code from cte)
)
select cte_output.*
from cte_output
order by cte_output.p_number
;