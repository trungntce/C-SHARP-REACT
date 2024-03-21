SELECT 
    ckg.checksheet_group_code,
    ckg.group_type,
	cksi.checksheet_code,
    cksi.eqp_code,
    eqp1.EQUIPMENT_DESCRIPTION as equipment_description,
    cksi.checksheet_item_code,
    cksi.checksheet_type_name,
    cksi.method,
    cksi.inspect_point,
    cksi.standard_val,
    cksi.min_val,
    cksi.max_val,
    ckr.check_value,
    ckr.check_status,
    (select code_name from tb_code where codegroup_id = 'CHECK_STATUS' and code_id=check_status) check_status_name,
    ckr.check_date,
    ckr.check_user,
    work.WORKCENTER_CODE workcenter_code,
    work.WORKCENTER_DESCRIPTION workcenter_description,
    (select count(1) 
        from tb_checksheet_item_img im 
        where im.checksheet_code = cksi.checksheet_code
            and cksi.checksheet_item_code = im.checksheet_item_code
            and FORMAT(ckr.check_date, 'yyyymmdd') = FORMAT(im.create_dt, 'yyyymmdd')) img_cnt

FROM dbo.tb_checksheet_result as ckr
JOIN dbo.tb_checksheet_item as cksi
    ON ckr.checksheet_item_code = cksi.checksheet_item_code

JOIN dbo.erp_sdm_standard_equipment as eqp1
    ON eqp1.EQUIPMENT_CODE =  cksi.eqp_code

JOIN dbo.tb_checksheet as cks
    ON cksi.checksheet_code = cks.checksheet_code

LEFT JOIN dbo.tb_checksheet_group as ckg
    ON ckg.checksheet_group_code = cks.checksheet_group_code
LEFT JOIN dbo.erp_sdm_standard_workcenter as work
	ON ckg.workcenter_code = work.WORKCENTER_CODE

WHERE cksi.eqp_code = @eqp_code
    and ckr.check_status = @check_status
    and ckr.check_date >= @from_dt and ckr.check_date < @to_dt
    and cksi.checksheet_code = @checksheet_code
    and ckg.checksheet_group_code = @checksheet_group_code
    and ckg.group_type = @group_type
    and ckg.workcenter_code = @workcenter_code

order by
	ckr.check_date desc
;