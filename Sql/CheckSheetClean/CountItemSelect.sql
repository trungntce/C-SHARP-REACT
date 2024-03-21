select 
	count(*) as cnt
from 
	dbo.tb_checksheet_group_clean
where
	LOWER(item_code) = LOWER(@item_code)
;