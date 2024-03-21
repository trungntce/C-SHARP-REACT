SELECT 
	IIM.ITEM_CATEGORY_CODE  -- FG: 力前, SFG: 馆力前
,	WOS.OPERATION_SEQ_NO
,	WJE.JOB_NO
,	WJE.BOM_ITEM_ID AS BOM_ITEM_ID_A
,	SIR1.BOM_ITEM_CODE
,	SIR1.BOM_ITEM_DESCRIPTION
,	WJE.JOB_ID
,	SSW.WORKCENTER_ID
,	SSW.WORKCENTER_CODE
,	SSW.WORKCENTER_DESCRIPTION
,	SSR.RESOURCE_ID
,	SSR.RESOURCE_CODE
,	SSR.RESOURCE_DESCRIPTION
,	WOS.OPERATION_SEQ_NO
,	WOS.OPERATION_ID
,	SSO.OPERATION_CODE
,	SSO.OPERATION_DESCRIPTION
,	WRS.COMPONENT_BOM_ITEM_ID
,	SIR2.BOM_ITEM_CODE AS BOM_ITEM_ID_B
,	SIR2.BOM_ITEM_DESCRIPTION
,	ISNULL(SIS.BARCODE_USE_FLAG, 'N') AS BARCODE_USE_FLAG
,   SIS.PTS_TYPE_LCODE
FROM 
  	dbo.erp_wip_job_entities WJE INNER JOIN [dbo].[erp_wip_operations]          WOS ON WJE.JOB_ID = WOS.JOB_ID
                            INNER JOIN [dbo].[erp_wip_requirements]             WRS ON WOS.WIP_OPERATION_ID = WRS.WIP_OPERATION_ID
                            INNER JOIN [dbo].[erp_sdm_item_structure]           SIS ON(WJE.BOM_ITEM_ID = SIS.BOM_ITEM_ID
                                                                                OR SIS.BOM_ITEM_ID = (SELECT BOM_ITEM_ID FROM [dbo].[erp_sdm_item_structure] SIS2 WHERE SIS2.SG_BOM_ITEM_ID = WJE.BOM_ITEM_ID)
                                                                                )
                                                                                AND WRS.COMPONENT_BOM_ITEM_ID = SIS.SG_BOM_ITEM_ID
                            INNER JOIN [dbo].[erp_inv_item_master]              IIM ON WJE.INVENTORY_ITEM_ID = IIM.INVENTORY_ITEM_ID
                            INNER JOIN [dbo].[erp_sdm_item_revision]            SIR1 ON WJE.BOM_ITEM_ID = SIR1.BOM_ITEM_ID
                            INNER JOIN [dbo].[erp_sdm_item_revision]            SIR2 ON WRS.COMPONENT_BOM_ITEM_ID = SIR2.BOM_ITEM_ID
                            INNER JOIN [dbo].[erp_sdm_standard_operation]       SSO  ON WOS.OPERATION_ID  = SSO.OPERATION_ID
                            INNER JOIN [dbo].[erp_sdm_standard_workcenter]      SSW  ON WOS.WORKCENTER_ID = SSW.WORKCENTER_ID
                            INNER JOIN [dbo].[erp_sdm_standard_resource]        SSR  ON WOS.RESOURCE_ID   = SSR.RESOURCE_ID
WHERE
	WJE.JOB_NO = @workorder
and
	WOS.OPERATION_SEQ_NO = @oper_seq_no