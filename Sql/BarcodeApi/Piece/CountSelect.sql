select
	count(*) as cnt
from
	dbo.tb_piece_item
where
	piece_id = @piece_id
;