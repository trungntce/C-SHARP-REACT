SELECT 

cks.checksheet_code,
eqp.EQUIPMENT_CODE as equipment_code,
eqp.EQUIPMENT_DESCRIPTION as equipment_description,
ckseqp.use_yn,
ckseqp.eqp_code,
cks.checksheet_group_code
FROM dbo.tb_checksheet as cks

LEFT JOIN dbo.tb_checksheet_group_eqp as ckseqp
ON cks.checksheet_group_code = ckseqp.checksheet_group_code

JOIN dbo.erp_sdm_standard_equipment as eqp
	ON eqp.EQUIPMENT_CODE = ckseqp.eqp_code

WHERE cks.checksheet_code = @checksheet_code
and eqp.ENABLED_FLAG = 'Y'
order by
	cks.create_dt desc
;