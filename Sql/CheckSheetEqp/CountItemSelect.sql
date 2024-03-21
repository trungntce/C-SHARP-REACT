select 
	count(*) as cnt
from 
	dbo.tb_checksheet_group_eqp
where
	eqp_code = @equipment_code
;