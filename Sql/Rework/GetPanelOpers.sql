select 
	oper.OPERATION_SEQ_NO as oper_seq
,   sso.OPERATION_CODE as oper_code
,   sso.OPERATION_DESCRIPTION as oper_name
from
	dbo.erp_wip_operations oper
join
	dbo.erp_sdm_standard_operation sso
	on oper.OPERATION_ID = sso.OPERATION_ID
where 
	oper.JOB_NO = (
        select top 1
			workorder
        from 
			dbo.tb_roll_panel_map
        where
			panel_id = @panel_id)
order by 
	oper.OPERATION_SEQ_NO
	;