with cte_group as
(
	 SELECT 
		JSON_TABLE.value
	FROM tb_user as a
	CROSS APPLY OPENJSON(a.usergroup_json) AS JSON_TABLE
    WHERE a.user_id = @create_user
    and JSON_TABLE.value in ('recipe.laser','recipe.copper','recipe.pt','recipe.hp','recipe.ir','recipe.psr','recipe.surface','recipe.backend')
),
cte as
(
  SELECT
		SIR.BOM_ITEM_CODE
      , SIR.BOM_ITEM_DESCRIPTION
      , SSR.OPERATION_SEQ_NO
      , SSO.OPERATION_CODE
      , SSO.OPERATION_DESCRIPTION
      , SSW.WORKCENTER_CODE
      , SSW.WORKCENTER_DESCRIPTION
      , SWC.WIP_RESOURCE_CODE
      , SRE.RESOURCE_DESCRIPTION
      , SSE.EQUIPMENT_CODE
      , SSE.EQUIPMENT_DESCRIPTION
      , SSE.RESOURCE_ID 
      , concat_ws('::',SSO.OPERATION_DESCRIPTION,SSO_tl.OPERATION_DESCRIPTION,'') as tran_lang
   FROM dbo.erp_sdm_item_revision SIR 
   INNER      JOIN dbo.erp_sdm_standard_routing    SSR ON SIR.BOM_ITEM_ID = SSR.BOM_ITEM_ID
   INNER      JOIN dbo.erp_sdm_standard_operation  SSO ON SSR.OPERATION_ID = SSO.OPERATION_ID
   LEFT OUTER JOIN dbo.erp_sdm_routing_wip_info    SWC ON SSR.STD_ROUTING_ID = SWC.STD_ROUTING_ID
   LEFT OUTER JOIN dbo.erp_sdm_standard_resource   SRE ON SWC.WIP_RESOURCE_CODE = SRE.RESOURCE_CODE
   LEFT OUTER JOIN dbo.erp_sdm_standard_workcenter SSW ON SRE.WORKCENTER_ID = SSW.WORKCENTER_ID
   LEFT OUTER JOIN dbo.erp_sdm_operation_resource_map MAP ON SSO.OPERATION_ID = MAP.OPERATION_ID
   LEFT OUTER JOIN dbo.erp_sdm_standard_equipment  SSE ON MAP.RESOURCE_ID = SSE.RESOURCE_ID
   JOIN dbo.erp_sdm_standard_operation_tl  SSO_tl ON SSO.OPERATION_ID = SSO_tl.OPERATION_ID
   JOIN dbo.tb_eqpareagroup eqp_group ON eqp_group.eqp_code = SSE.EQUIPMENT_CODE 
 WHERE SIR.SOB_ID       = 90
   AND SIR.ORG_ID       = 901
   AND SIR.ENABLED_FLAG = 'Y'
   AND SSO.ENABLED_FLAG = 'Y'
   AND SRE.ENABLED_FLAG = 'Y'
   AND SSW.ENABLED_FLAG = 'Y'
   AND SSE.ENABLED_FLAG = 'Y'
   AND MAP.SOB_ID = 90
   AND MAP.ORG_ID = 901
   and SIR.BOM_ITEM_CODE = @model_code
   and eqp_group.usergroup_id in ( select * from cte_group)
),cte2 as 
(
	select
		a.*
	,	c.WORKCENTER_DESCRIPTION  as EQP_LOCATION
	from
		cte a
	LEFT OUTER JOIN dbo.erp_sdm_standard_resource b on b.RESOURCE_ID = a.RESOURCE_ID
	LEFT OUTER JOIN dbo.erp_sdm_standard_workcenter c on c.WORKCENTER_ID = b.WORKCENTER_ID  
)select
    OPERATION_SEQ_NO
,   OPERATION_CODE
,   max(OPERATION_DESCRIPTION) as OPERATION_DESC
,   max(tran_lang)             as tran_lang 
,   '[' + string_agg(
        cast('{"eqpCode": "' + EQUIPMENT_CODE +
        '","eqpDesc": "' + EQUIPMENT_DESCRIPTION +
        '","workcenterCode": "' + WORKCENTER_CODE +
        '","workcenterDesc": "' + WORKCENTER_DESCRIPTION +
        '","eqpLocation": "' + isnull(EQP_LOCATION,'Not found data') +
    '"}' as nvarchar(max)), ',') within group (order by OPERATION_SEQ_NO) + ']' as OPER_EQP_JSON
from
    cte2
group by
    OPERATION_SEQ_NO
,   OPERATION_CODE
order by
        OPERATION_SEQ_NO
;

/*with cte as
(
  SELECT
		SIR.BOM_ITEM_CODE
      , SIR.BOM_ITEM_DESCRIPTION
      , SSR.OPERATION_SEQ_NO
      , SSO.OPERATION_CODE
      , SSO.OPERATION_DESCRIPTION
      , SSW.WORKCENTER_CODE
      , SSW.WORKCENTER_DESCRIPTION
      , SWC.WIP_RESOURCE_CODE
      , SRE.RESOURCE_DESCRIPTION
      , SSE.EQUIPMENT_CODE
      , SSE.EQUIPMENT_DESCRIPTION
   FROM dbo.erp_sdm_item_revision SIR INNER      JOIN dbo.erp_sdm_standard_routing    SSR ON SIR.BOM_ITEM_ID = SSR.BOM_ITEM_ID
                              INNER      JOIN dbo.erp_sdm_standard_operation  SSO ON SSR.OPERATION_ID = SSO.OPERATION_ID
                              LEFT OUTER JOIN dbo.erp_sdm_routing_wip_info    SWC ON SSR.STD_ROUTING_ID = SWC.STD_ROUTING_ID
                              LEFT OUTER JOIN dbo.erp_sdm_standard_resource   SRE ON SWC.WIP_RESOURCE_CODE = SRE.RESOURCE_CODE
                              LEFT OUTER JOIN dbo.erp_sdm_standard_workcenter SSW ON SRE.WORKCENTER_ID = SSW.WORKCENTER_ID
							  LEFT OUTER JOIN dbo.erp_sdm_operation_resource_map MAP ON SSO.OPERATION_ID = MAP.OPERATION_ID
                              LEFT OUTER JOIN dbo.erp_sdm_standard_equipment  SSE ON MAP.RESOURCE_ID = SSE.RESOURCE_ID
 WHERE SIR.SOB_ID       = 90
   AND SIR.ORG_ID       = 901
   AND SIR.ENABLED_FLAG = 'Y'
   AND SSO.ENABLED_FLAG = 'Y'
   AND SRE.ENABLED_FLAG = 'Y'
   AND SSW.ENABLED_FLAG = 'Y'
   AND SSE.ENABLED_FLAG = 'Y'
   AND MAP.SOB_ID = 90
   AND MAP.ORG_ID = 901
   and SIR.BOM_ITEM_CODE = @model_code
)
select
    OPERATION_SEQ_NO
,   OPERATION_CODE
,   max(OPERATION_DESCRIPTION) as OPERATION_DESC
,   '[' + string_agg(
        cast('{"eqpCode": "' + EQUIPMENT_CODE + 
        '","eqpDesc": "' + EQUIPMENT_DESCRIPTION + 
        '","workcenterCode": "' + WORKCENTER_CODE + 
        '","workcenterDesc": "' + WORKCENTER_DESCRIPTION + 
    '"}' as nvarchar(max)), ',') within group (order by OPERATION_SEQ_NO) + ']' as OPER_EQP_JSON
from
    cte
group by
    OPERATION_SEQ_NO
,   OPERATION_CODE
order by 
	OPERATION_SEQ_NO
;	*/