select 
	count(*) as cnt
from 
	dbo.tb_checksheet_group
where
	LOWER(checksheet_group_code) = LOWER(@checksheet_group_code)
	or workcenter_code = @workcenter_code
;