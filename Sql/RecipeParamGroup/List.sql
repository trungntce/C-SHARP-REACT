select 
	a.eqp_code as equipment_code
,	b.EQUIPMENT_DESCRIPTION
from 
	tb_recipe a
left join 
	dbo.erp_sdm_standard_equipment b
  on b.EQUIPMENT_CODE = a.eqp_code 
where 
	  a.corp_id		= @corp_id
  and a.fac_id		= @fac_id
  and a.eqp_code	= @eqp_code
union
select 
	a.eqp_code as equipment_code
,	b.EQUIPMENT_DESCRIPTION
from 
	tb_param a
left join 
	dbo.erp_sdm_standard_equipment b
  on b.EQUIPMENT_CODE = a.eqp_code 
where
	  a.corp_id		= @corp_id
  and a.fac_id		= @fac_id
  and a.eqp_code	= @eqp_code  
order by eqp_code 
;