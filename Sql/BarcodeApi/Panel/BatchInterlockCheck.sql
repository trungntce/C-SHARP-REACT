with cte as (
	select distinct
		workorder as workorder
	from 
		openjson(@workorder_list)
		with 
		(
			workorder varchar(50) '$.workorder'
		)
), cte_interlock as (
	select 
		inter.workorder
	,	inter.oper_seq_no 
	,	inter.oper_code 
	,	oper.OPERATION_DESCRIPTION as oper_desc
	,	code.code_name
	,	inter.on_update_user 
	,	inter.on_dt
	from 
		cte
	join 
		dbo.tb_workorder_interlock inter
		on
		inter.workorder = cte.workorder
	left join 
		erp_sdm_standard_operation oper
		on inter.oper_code = oper.OPERATION_CODE 
	left join	
		tb_code code
		on inter.interlock_code = code.code_id 
		and codegroup_id = 'HOLDINGREASON'
	where
		inter.off_dt is null
)select * from cte_interlock;