	----MADE BY SIFLEX
	SELECT COUNT(1) AS CNT
	FROM dbo.erp_sdm_item_revision SIR 
    INNER JOIN dbo.erp_sdm_standard_routing    SSR ON SIR.BOM_ITEM_ID = SSR.BOM_ITEM_ID
    INNER JOIN dbo.erp_sdm_standard_operation  SSO ON SSR.OPERATION_ID = SSO.OPERATION_ID
	WHERE SIR.SOB_ID       = 90
	   	AND SIR.ORG_ID       = 901
	   	AND SIR.ENABLED_FLAG = 'Y'
	   	AND SSO.ENABLED_FLAG = 'Y'
	   	AND SIR.BOM_ITEM_CODE = @model_code
;