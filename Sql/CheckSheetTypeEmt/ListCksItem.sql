SELECT 
    ckg.checksheet_group_code,
    ckg.checksheet_group_name,
	cksi.checksheet_code,
    cksi.checksheet_item_code,
    cksi.checksheet_type_name,
    check_freq_num,
  --  cksi.day_type,
   -- (select code_name from tb_code where codegroup_id = 'DAY_TYPE' and code_id=day_type) day_type_name,
   -- cksi.day_val,
    daily_check_type,
    daily_check_date,
    (select code_name from tb_code where codegroup_id = 'CHK_DAILY_CK_TYPE' and code_id=daily_check_type) daily_check_type_name,
    cksi.ord,
    cksi.exchg_period,
    cksi.standard_val,
    cksi.min_val,
    cksi.max_val,
    cksi.method,
    cksi.inspect_point,
   -- unit_measure_code,
   -- (select code_name from tb_code where codegroup_id = 'CHK_UNIT_MEASURE' and code_id=unit_measure_code) unit_measure_name,
   -- measure_period,
  --  (select code_name from tb_code where codegroup_id = 'CHK_PERIOD_MEASURE' and code_id=measure_period) measure_period_name,
    cksi.use_yn,
    cksi.remark,
    cks.rev,
    cksi.valid_strt_dt,
    input_type,
    (select code_name from tb_code where codegroup_id = 'CHK_INPUT_TYPE' and code_id=input_type) input_type_name,
    cksi.eqp_code,
    eqp1.EQUIPMENT_DESCRIPTION as equipment_description,
    cksi.img_path,
    cksi.img_nm

FROM dbo.tb_checksheet_item as cksi

JOIN dbo.erp_sdm_standard_equipment as eqp1
    ON eqp1.EQUIPMENT_CODE =  cksi.eqp_code

JOIN dbo.tb_checksheet as cks
    ON cksi.checksheet_code = cks.checksheet_code

Join dbo.tb_checksheet_group as ckg
    ON ckg.checksheet_group_code = cks.checksheet_group_code

WHERE cksi.eqp_code = @eqp_code
    and eqp1.ENABLED_FLAG = 'Y'
    and cks.checksheet_code = @checksheet_code
    and cks.checksheet_group_code = @checksheet_group_code

order by
	cksi.ord asc
;