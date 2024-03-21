SELECT 

	cksg.checksheet_group_code,
    eqp.EQUIPMENT_CODE as equipment_code,
	eqp.EQUIPMENT_DESCRIPTION as equipment_description,
    eqpi.use_yn
FROM dbo.tb_checksheet_group_eqp as eqpi

JOIN dbo.tb_checksheet_group as cksg
	ON eqpi.checksheet_group_code = cksg.checksheet_group_code
    
JOIN dbo.erp_sdm_standard_equipment as eqp
	ON eqpi.eqp_code = eqp.EQUIPMENT_CODE

WHERE eqpi.checksheet_group_code = @checksheet_group_code
order by
	eqpi.create_dt desc
;