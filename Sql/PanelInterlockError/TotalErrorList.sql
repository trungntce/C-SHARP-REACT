with cte as (
	select
		[4m].row_key, 
		inter.group_key, 
		[4m].workorder, 
		[4m].oper_seq_no, 
		[4m].oper_code, 
		[4m].model_code, 
		item.eqp_code, 
		inter.interlock_code,
		max(inter.on_dt) as on_date
	from dbo.tb_panel_interlock inter
	join dbo.tb_panel_item item
	        on      inter.item_key = item.item_key
	join dbo.tb_panel_realtime [real]
	        on item.panel_id = [real].panel_id
	join dbo.tb_code code
	        on      inter.interlock_code = code.code_id
	cross apply
	(	
	        select top 1
	                *
	        from dbo.tb_panel_4m
	        where group_key = panel_group_key
	) [4m]
	where
	        	item.corp_id = @corp_id
		and     item.fac_id = @fac_id
		and     code.codegroup_id = 'HOLDINGREASON'
		and     code.rule_val != 'GROUP'
		and 	inter.on_dt >= @from_date
		and     (inter.interlock_code like @interlock_code + '%' or inter.interlock_code like case when '5103' = @interlock_code then '5003' end + '%')
	group by item.panel_group_key, 
		[4m].row_key, 
		inter.group_key, 
		[4m].workorder, 
		[4m].oper_seq_no, 
		[4m].oper_code, 
		[4m].model_code, 
		item.eqp_code, 
		inter.interlock_code

	union all
	
	select
		[4m].row_key, 
		inter.group_key, 
		[4m].workorder, 
		[4m].oper_seq_no, 
		[4m].oper_code, 
		[4m].model_code, 
		[4m].eqp_code, 
		inter.interlock_code,
		inter.on_dt as on_date
	from dbo.tb_panel_4m_interlock inter
        join dbo.tb_panel_4m [4m]
                on inter.panel_row_key = [4m].row_key
        where inter.corp_id = @corp_id
        	and inter.fac_id = @fac_id
        	and inter.on_dt >= @from_date
			and  (inter.interlock_code like @interlock_code + '%' or inter.interlock_code like case when '5103' = @interlock_code then '5003' end + '%' )
	--group by [4m].row_key, 
	--	inter.group_key, 
	--	[4m].workorder, 
	--	[4m].oper_seq_no, 
	--	[4m].oper_code, 
	--	[4m].model_code, 
	--	[4m].eqp_code, 
	--	inter.interlock_code
)

select 
	cte.*,
		case when x1.judge_code = x1.settle_code then
			1
		when x2.judge_code = x2.settle_code then
			1
		else
			0
		end as judge
from cte
left join dbo.tb_panel_interlock_process x1 
	on x1.interlock_group_key = cte.group_key 
	and x1.step = 1
left join dbo.tb_panel_interlock_process x2 
	on x2.interlock_group_key = cte.group_key 
	and x2.step = 2;