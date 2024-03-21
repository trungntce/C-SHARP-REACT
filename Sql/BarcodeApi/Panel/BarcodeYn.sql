with cte as 
(
	select
		*
	from
		openjson(@eqp_json)
		with
		(
			eqp_code varchar(40) '$.eqpCode'
		)
)select
	count(*) as count_y
from
	dbo.erp_sdm_standard_equipment
where
	EQUIPMENT_CODE in (select eqp_code from cte)
	and ATTRIBUTE_D = 'Y'
	and SOB_ID = 90
	and ORG_ID = 901
;