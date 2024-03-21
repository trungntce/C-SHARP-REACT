select
	columnname 
,	symbolcomment as comment
from
	raw_plcsymbol_infotable rpi 
where
	eqcode = @eqpcode
	and
	columnname in ((select [value] from string_split(@column, ',')))