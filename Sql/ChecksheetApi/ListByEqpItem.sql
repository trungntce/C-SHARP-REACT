select 
	a.eqp_code,
	e.EQUIPMENT_DESCRIPTION eqp_name,
	c.workcenter_code,
	wk.WORKCENTER_DESCRIPTION workcenter_name
from tb_checksheet_item a
join erp_sdm_standard_equipment e on a.eqp_code = e.EQUIPMENT_CODE
join tb_checksheet b on a.checksheet_code = b.checksheet_code
left join tb_checksheet_group c on b.checksheet_group_code = c.checksheet_group_code
left join erp_sdm_standard_workcenter wk on c.workcenter_code = wk.WORKCENTER_CODE
where 1 = 1
	and e.ENABLED_FLAG = 'Y'
	and a.eqp_code in (select value from STRING_SPLIT( @eqp_code, ','))
	and wk.WORKCENTER_CODE = @workcenter_code
	and c.group_type = @group_type
group by a.eqp_code, e.EQUIPMENT_DESCRIPTION, c.workcenter_code, wk.WORKCENTER_DESCRIPTION
;