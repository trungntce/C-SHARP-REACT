select 
	count(*) as cnt
from 
	dbo.tb_checksheet_result
where
	[checksheet_code] = @checksheet_code
and [checksheet_item_code] = @checksheet_item_code
;