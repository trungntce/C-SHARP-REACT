with cte as (
	select distinct
		workorder as workorder
	from 
		openjson(@workorder_list)
		with 
		(
			workorder varchar(50) '$.workorder'
		)
), cte2 as (
	select
		STRING_AGG(workorder,' , ') as workorder
	from
		cte
	join
		dbo.erp_zsi_mes_qtime_list qtime
		on cte.workorder = qtime.JOB_NO
	where
		[STATUS] = 'LOCK'
		and OP_UNLOCK_NO is null
)
select 
	*
from 
	cte2
where 
	workorder != '[NULL]'
