with cte as
(
	select
		eqp_code
	,	target_4m_yn
	from 
		dbo.tb_panel_4m_eqp
)
select
	eqp.EQUIPMENT_CODE			as eqp_code
,	eqp.EQUIPMENT_DESCRIPTION	as eqp_name
,	res.RESOURCE_ID				as res_id
,	res.WORKCENTER_ID			as workcenter_id
,	work.WORKCENTER_DESCRIPTION	as workcenter_name
,	cte.target_4m_yn
from 
	dbo.erp_sdm_standard_resource res
join
	dbo.erp_sdm_standard_workcenter work
	on	res.WORKCENTER_ID = work.WORKCENTER_ID
join
	dbo.erp_sdm_standard_equipment eqp
	on res.RESOURCE_ID = eqp.RESOURCE_ID
join
	cte
	on eqp.EQUIPMENT_CODE = cte.eqp_code
order by
	eqp_code
;