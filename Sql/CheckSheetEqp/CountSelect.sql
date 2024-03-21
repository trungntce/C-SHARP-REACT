select 
	count(*) as cnt
from 
	dbo.tb_checksheet_group
where
	[checksheet_group_code] = @checksheet_group_code
;