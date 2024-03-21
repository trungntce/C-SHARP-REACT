select
	b.code_name 
,	b.code_id
from
	tb_codegroup a
join
	tb_code b
	on a.codegroup_id = b.codegroup_id 
where
	a.codegroup_name = @di_water