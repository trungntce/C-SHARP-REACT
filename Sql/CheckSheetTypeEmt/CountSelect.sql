select 
	count(*) as cnt
from 
	dbo.tb_checksheet
where
	[checksheet_code] = @checksheet_code
;