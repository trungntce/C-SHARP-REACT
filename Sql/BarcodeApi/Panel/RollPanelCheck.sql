select
	count(*) as result_value
from
	tb_panel_item
where
	panel_id = @barcode
