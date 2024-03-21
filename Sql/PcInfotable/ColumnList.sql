select distinct
	tablename		as table_name
,	columnname		as [col_name]
,	columncomment	as col_desc
,	columnindex		as col_index
from 
	dbo.raw_pc_infotable
where
	equip = @eqp_code
and	tablename = @table_name
and	pick = @pick
and columnname not in ('datajson', 'datsjson')
order by 
	columnindex
;
