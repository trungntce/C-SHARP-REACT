select
	inter.workorder_interlock_id
,	inter.workorder
,	inter.panel_row_key
,	inter.panel_group_key
,	inter.oper_seq_no
,	inter.oper_code
,	isnull(nullif(inter.eqp_code, ''), [4m].eqp_code) as eqp_code
,	inter.interlock_code
,	inter.auto_yn
,	inter.on_remark
,	inter.off_remark
,	inter.on_update_user
,	inter.off_update_user
,	inter.on_dt
,	inter.off_dt
,	inter.header_group_key

,	on_user.[user_name] as on_user_name
,	off_user.[user_name] as off_user_name

,	sdm_oper.OPERATION_DESCRIPTION as oper_name
from 
	dbo.tb_workorder_interlock inter
join
	dbo.erp_sdm_standard_operation sdm_oper
	on	inter.oper_code = sdm_oper.OPERATION_CODE
left join
	dbo.tb_panel_4m [4m]
	on	inter.panel_row_key = [4m].row_key
left join
	dbo.tb_user on_user
	on	inter.on_update_user = on_user.[user_id]
left join
	dbo.tb_user off_user
	on	inter.off_update_user = off_user.[user_id]
where
	inter.workorder = @workorder
order by
	inter.workorder_interlock_id desc
;