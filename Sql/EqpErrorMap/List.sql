select
	a.eqp_code,
	b.EQUIPMENT_DESCRIPTION as eqp_desc,
	a.eqp_error_code,
	a.error_code,
	c.error_message,
	a.remark,
	a.create_user,
	a.create_dt
from
	dbo.tb_eqp_error_map a
left outer join erp_sdm_standard_equipment b on b.EQUIPMENT_CODE = a.eqp_code 
left outer join tb_error_code c on c.error_code = a.error_code 
where
	a.corp_id = @corp_id
and a.fac_id = @fac_id
and a.eqp_code = @eqp_code
;