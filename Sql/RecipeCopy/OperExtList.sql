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
	WHERE a.model_code = @from_model_code
)

SELECT cte.* FROM cte 
WHERE EXISTS (
	SELECT COUNT(1) 
	FROM dbo.erp_sdm_item_revision SIR 
    INNER JOIN dbo.erp_sdm_standard_routing    SSR ON SIR.BOM_ITEM_ID = SSR.BOM_ITEM_ID
    INNER JOIN dbo.erp_sdm_standard_operation  SSO ON SSR.OPERATION_ID = SSO.OPERATION_ID
	WHERE SIR.SOB_ID       = 90
	   	AND SIR.ORG_ID       = 901
	   	AND SIR.ENABLED_FLAG = 'Y'
	   	AND SSO.ENABLED_FLAG = 'Y'
	   	AND SIR.BOM_ITEM_CODE = @to_model_code
		AND SSR.OPERATION_SEQ_NO = cte.operation_seq_no
		AND SSO.OPERATION_CODE = cte.operation_code

)
ORDER BY cte.operation_seq_no
;