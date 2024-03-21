select
	eqcode			as eqp_code
,	tablename		as table_name
,	columnname		as [col_name]
,	symbolcomment	as [col_desc]
,	symboldatatype	as data_type
,	columnindex		as col_index
from 
	dbo.raw_plcsymbol_infotable
where
	symbolused = 'Y'
and	eqcode = @eqp_code
and tablename = @table_name
and	pick = @pick
order by 
	columnindex
;
