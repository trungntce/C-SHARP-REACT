select
	max(group_key) as  group_key,
	count(*) as cnt
from
	tb_panel_4m
where 
	eqp_code = @barcode and 
	end_dt is null;