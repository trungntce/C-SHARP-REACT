with cte as (
	select
		workorder as workorder
	,	oper_seq_no as oper_seq_no
	from 
		openjson(@workorder_list)
		with 
		(
			workorder varchar(50) '$.workorder'
		,	oper_seq_no varchar(50) '$.oper_seq_no'
		)
), cte2 as (
	select 
		* 
	from 
		cte
	left join 
		erp_wip_job_entities_mes mes
		on cte.workorder = mes.JOB_NO
		and cte.oper_seq_no = mes.ONHAND_OPERATION_SEQ_NO
)
select 
	workorder
,	oper_seq_no
,	mes.ONHAND_OPERATION_SEQ_NO AS oper_seq_no_erp
from
	cte2
join 
		erp_wip_job_entities_mes mes
		on cte2.workorder = mes.JOB_NO
where
	cte2.JOB_ID IS NULL