with cte as 
(
	select 
		row_number() over(partition by workorder order by count(ngcode) desc) as row_num
	,	workorder
	,	oper_seq_no
	,	ngcode
	,	count(ngcode) as defect_cnt
	from
		tb_vrs
	where 
		workorder = @workorder
	and oper_seq_no = @oper_seq_no
	group by 
		workorder, oper_seq_no, ngcode
)select 
	cte.workorder
,	cte.oper_seq_no
,	'defect' + cte.ngcode as field
,	ng.code_name as header_name
from 
	cte
left join 
	tb_code ng
	on ng.codegroup_id = 'VRS_NG_CODE'
	and ng.code_id = cte.ngcode
where 
	row_num <= 5
;