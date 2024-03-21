select distinct
    bom.BOM_ITEM_CODE 
,   oper.OPERATION_ID
,   oper.OPERATION_SEQ_NO
,   oper.OPERATION_COMMENT
,   eqp.EQUIPMENT_CODE
,   eqp.EQUIPMENT_DESCRIPTION

from 
    [dbo].[erp_wip_job_entities] job
join
    [dbo].[erp_wip_operations] oper
    on  job.JOB_NO = oper.JOB_NO 
join
	[dbo].[erp_sdm_operation_resource_map] map
	ON	oper.OPERATION_ID = map.OPERATION_ID
join
	[dbo].[erp_sdm_standard_equipment] eqp
	ON	map.RESOURCE_ID = eqp.RESOURCE_ID
join    
    [dbo].[erp_sdm_item_revision] bom
    ON job.BOM_ITEM_ID = bom.BOM_ITEM_ID 
where 
    job.JOB_NO = @workorder
and oper.OPERATION_SEQ_NO = @oper_seq_no
and map.SOB_ID = 90
and map.ORG_ID = 901
order by 
    oper.OPERATION_SEQ_NO
;