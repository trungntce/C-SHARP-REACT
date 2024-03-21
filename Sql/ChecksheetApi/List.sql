SELECT 
    ckg.checksheet_group_code,
    ckg.checksheet_group_name,
	cksi.checksheet_code,
    cksi.checksheet_item_code,
    cksi.checksheet_type_name,
    cksi.daily_check_type,
    cksi.ord,
    cksi.exchg_period,
    cksi.standard_val,
    cksi.min_val,
    cksi.max_val,
    cksi.method,
    cksi.inspect_point,
    cksi.unit_measure_code,
    cksi.measure_period,
    cksi.use_yn,
    cksi.remark,
    cks.rev,
    cksi.valid_strt_dt,
    cksi.input_type,
    cksi.eqp_code,
    eqp1.EQUIPMENT_DESCRIPTION as equipment_description

FROM dbo.tb_checksheet_item as cksi

JOIN dbo.erp_sdm_standard_equipment as eqp1
    ON eqp1.EQUIPMENT_CODE =  cksi.eqp_code

JOIN dbo.tb_checksheet as cks
    ON cksi.checksheet_code = cks.checksheet_code

Join dbo.tb_checksheet_group as ckg
    ON ckg.checksheet_group_code = cks.checksheet_group_code

WHERE cksi.eqp_code = @eqp_code
and ckg.group_type = @group_type
and cksi.use_yn = 'Y'

order by
	cksi.ord desc
;