SELECT
    bom.BOM_ITEM_CODE 
,   oper.OPERATION_ID
,   oper.OPERATION_SEQ_NO
,   oper.OPERATION_COMMENT
,   eqp.EQUIPMENT_CODE
,   eqp.EQUIPMENT_DESCRIPTION

FROM 
    [dbo].[erp_wip_job_entities] job
JOIN
    [dbo].[erp_wip_operations] oper
    ON  job.JOB_NO = oper.JOB_NO 
JOIN
	[dbo].[erp_sdm_operation_resource_map] map
	ON	oper.OPERATION_ID = map.OPERATION_ID
JOIN
	[dbo].[erp_sdm_standard_equipment] eqp
	ON	map.RESOURCE_ID = eqp.RESOURCE_ID
JOIN    
    [dbo].[erp_sdm_item_revision] bom
    ON job.BOM_ITEM_ID = bom.BOM_ITEM_ID 
WHERE 
    job.JOB_NO = @workorder
AND map.SOB_ID = 90
AND map.ORG_ID = 901
ORDER BY 
    oper.OPERATION_SEQ_NO
;