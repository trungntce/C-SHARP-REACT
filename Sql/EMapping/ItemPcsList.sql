select
	item_code 
,	item_seq_no 
,	piece_no 
,	xcount 
,	ycount
,	file_path 
from
	dbo.tb_itme_pcs_map
where 
	item_code = @item_code