with cte as
(
	select
		eqp_code
	,	target_4m_yn
	from 
		dbo.tb_panel_4m_eqp
)
select
	res.WORKCENTER_ID					as workcenter_id
,	max(work.WORKCENTER_DESCRIPTION)	as workcenter_name
,	count(*)							as workcenter_cnt
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
where
	cte.target_4m_yn = @target_4m_yn
group by
	res.WORKCENTER_ID
order by
	max(work.WORKCENTER_DESCRIPTION)
;