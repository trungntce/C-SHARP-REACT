select
	columnname 
,	columncomment as comment
from
	raw_pc_infotable rpi 
where
	equip = @eqpcode
	and
	columnname in ((select [value] from string_split(@column, ',')))