declare @tbl_ignore_param table
(
	codegroup_id 	varchar(50)
,	codegroup_name	varchar(50)
,	max_sort		int
);
	
with cte_group as 
(
	select
		max(code_group.codegroup_id) 	as codegroup_id
	,	max(code_group.codegroup_name)	as codegroup_name
	,	max(code.sort)					as max_sort
	from
		tb_codegroup code_group
	left join
		tb_code code
		on code_group.codegroup_id = code.codegroup_id 
	where
		code_group.codegroup_name = @di_water
	group by code_group.codegroup_id 
)
insert into @tbl_ignore_param select * from cte_group;


insert into tb_code 
select
	'SIFLEX' 		as corp_id
,	'SIFLEX' 		as fac_id
,	a.codegroup_id	as codegroup_id
,	@eqp_code 		as code_id
,	@eqp_name		as code_name
,	null			as start_val
,	null			as end_val
,	null			as rule_val
,	null			as default_val
,	'Y'				as use_yn
,	isnull(a.max_sort,0) + 1	as sort
,	''				as remark
,	'admin'			as create_user
,	getdate() 		as create_dt
,	null 			as update_user
,	null 			as update_dt
from
	@tbl_ignore_param a
;

insert into tb_diwater_map
select
	a.codegroup_name 			as parant_id
,	@eqp_code  					as eqp_code
,	@nonconductivity 			as nonconductivity
,	@nonctable_name 	as nonconductivity_table
,	@conductivity 				as conductivity
,	@ctable_name 		as conductivity_table
from
	@tbl_ignore_param a
;