SELECT 
       SIR.BOM_ITEM_ID
     , SIR.BOM_ITEM_CODE
     , SIR.BOM_ITEM_DESCRIPTION
     , WJE.JOB_STATUS_CODE
     , WJE.JOB_ID
     , WJE.JOB_NO
     , WOS.OPERATION_SEQ_NO
     , SSO.OPERATION_ID
     , SSO.OPERATION_CODE
     , SSO.OPERATION_DESCRIPTION
     , SSW.WORKCENTER_ID
     , SSW.WORKCENTER_CODE
     , SSW.WORKCENTER_DESCRIPTION
  FROM [dbo].[erp_wip_job_entities] WJE 
    INNER JOIN [dbo].[erp_wip_operations]           WOS ON WJE.JOB_ID        = WOS.JOB_ID
    INNER JOIN [dbo].[erp_sdm_item_revision]        SIR ON WJE.BOM_ITEM_ID   = SIR.BOM_ITEM_ID
    INNER JOIN [dbo].[erp_sdm_standard_workcenter]  SSW ON WOS.WORKCENTER_ID = SSW.WORKCENTER_ID
    INNER JOIN [dbo].[erp_sdm_standard_operation]   SSO ON WOS.OPERATION_ID  = SSO.OPERATION_ID
 WHERE 
    WJE.JOB_NO =@workorder
   and WOS.OPERATION_SEQ_NO= @oper_seq_no
   and SSO.OPERATION_CODE=@oper_code
 ORDER BY SIR.BOM_ITEM_CODE