--MADE BY SIFLEX
WITH cte AS (
	  SELECT 
	  	a.model_code,
		a.operation_seq_no,
		a.operation_code,
		JSON_TABLE.*
	FROM tb_model_oper_ext as a
	CROSS APPLY OPENJSON(a.eqp_json) WITH (
		eqp_code VARCHAR(50) '$.eqpCode',
		eqp_desc NVARCHAR(255) '$.eqpDesc',
		workcenter_code VARCHAR(50) '$.workcenterCode',
		workcenter_desc NVARCHAR(255) '$.workcenterDesc',
		use_yn VARCHAR(10) '$.useYn'
	) AS JSON_TABLE
	WHERE a.model_code = @model_code
),
cte_std AS (
	SELECT SIR.BOM_ITEM_CODE, SSR.OPERATION_SEQ_NO, SSO.OPERATION_CODE, SSO.OPERATION_DESCRIPTION
	FROM dbo.erp_sdm_item_revision SIR 
    INNER JOIN dbo.erp_sdm_standard_routing    SSR ON SIR.BOM_ITEM_ID = SSR.BOM_ITEM_ID
    INNER JOIN dbo.erp_sdm_standard_operation  SSO ON SSR.OPERATION_ID = SSO.OPERATION_ID
	WHERE SIR.SOB_ID       = 90
	   	AND SIR.ORG_ID       = 901
	   	AND SIR.ENABLED_FLAG = 'Y'
	   	AND SSO.ENABLED_FLAG = 'Y'
	   	AND SIR.BOM_ITEM_CODE = @model_code
),
cte_union AS
(
	SELECT cte.*,
        cte_std.OPERATION_DESCRIPTION as operation_desc,
		a.group_code,
		grp.group_name,
		a.recipe_code,
        a.recipe_name,
		a.base_val,
		'SV' as type,
		NULL as param_id,
        NULL as param_name,
        NULL as unit,
        NULL as std,
        NULL as lcl,
        NULL as ucl,
        NULL as lsl,
        NULL as usl
	FROM cte
	inner join tb_recipe as a ON cte.eqp_code = a.eqp_code and a.corp_id = @corp_id  and a.fac_id = @fac_id
    inner join tb_recipe_model as rm ON cte.model_code = rm.model_code and cte.eqp_code = rm.eqp_code 
	inner join tb_param_recipe_group grp ON a.group_code = grp.group_code and a.corp_id = grp.corp_id and a.fac_id = grp.fac_id
	inner join cte_std ON cte_std.BOM_ITEM_CODE = cte.model_code and cte_std.OPERATION_SEQ_NO = cte.operation_seq_no and cte_std.OPERATION_CODE = cte.operation_code
	where cte.use_yn = 'Y'
	
	union all
	
	SELECT cte.*,
        cte_std.OPERATION_DESCRIPTION as operation_desc,
		b.group_code,
		grp.group_name,
		'' as recipe_code,
        '' as recipe_name,
		NULL AS base_val,
		'PV' as type,
        b.param_id,
        b.param_name,
        b.unit,
        b.std,
        b.lcl,
        b.ucl,
        b.lsl,
        b.usl
	FROM cte
	inner join tb_param as b ON cte.eqp_code = b.eqp_code
    inner join tb_param_model as pm ON cte.model_code = pm.model_code and cte.eqp_code = pm.eqp_code 
	inner join tb_param_recipe_group grp ON b.group_code = grp.group_code and b.corp_id = grp.corp_id and b.fac_id = grp.fac_id
	inner join cte_std ON cte_std.BOM_ITEM_CODE = cte.model_code and cte_std.OPERATION_SEQ_NO = cte.operation_seq_no and cte_std.OPERATION_CODE = cte.operation_code
	where cte.use_yn = 'Y'
), cte_output as
(
SELECT
        model_code,
        operation_seq_no,
        operation_code,
        operation_desc,
        eqp_code,
        eqp_desc,
        group_code as recipe_code,
        group_name as recipe_name,
        type as p_type,
        case when type = 'SV' then
                        recipe_code
                else
                        param_id
                end sv_pv_code,
        case when type = 'SV' then
                        recipe_name
                else
                        param_name
        end sv_pv_name,
        base_val,
    unit,
    std,
    lcl,
    ucl,
    lsl,
    usl

FROM cte_union
union 
SELECT
cte.model_code,
cte.operation_seq_no,
cte.operation_code,
cte_std.OPERATION_DESCRIPTION as operation_desc,
cte.eqp_code,
cte.eqp_desc,
null recipe_code,
null recipe_name,
null as type,
NULL as sv_pv_name,
NULL as sv_pv_name,
NULL as base_val,
NULL as unit,
NULL as std,
NULL as lcl,
NULL as ucl,
NULL as lsl,
NULL as usl
FROM cte
inner join cte_std ON cte_std.BOM_ITEM_CODE = cte.model_code and cte_std.OPERATION_SEQ_NO = cte.operation_seq_no and cte_std.OPERATION_CODE = cte.operation_code
where cte.use_yn = 'Y'
and cte.eqp_code not in ( select eqp_code from cte_union)
)
select cte_output.*
from cte_output
order by cte_output.operation_seq_no
;