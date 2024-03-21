select
	columnname 
,	symbolcomment 
,	tablename 
from
	raw_plcsymbol_infotable rpi 
where
	eqcode like '%'+ @table +'%'
;