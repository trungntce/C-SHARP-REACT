select
	*
,	replace(column_name, 'd00', 'Data') as param_name
from
	dbo.tb_panel_param_cuplating
where
	group_key = @group_key
and	panel_seq = @panel_seq
order by
	column_name
;