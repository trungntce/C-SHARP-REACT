select
	count(*) as cnt
from
	dbo.tb_sheet_item
where
	sheet_id = @sheet_id
;