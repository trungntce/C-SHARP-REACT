select
	count(*) as cnt
from
	dbo.tb_roll_item
where
	roll_id = @roll_id
;