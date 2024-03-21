select
    eqp.EQUIPMENT_CODE eqp_code, eqp.EQUIPMENT_DESCRIPTION eqp_name
from
        dbo.erp_wip_job_entities job
join
        dbo.erp_wip_operations oper
        on      job.JOB_ID = oper.JOB_ID
join
        dbo.erp_sdm_standard_operation sdm_oper
        on oper.OPERATION_ID = sdm_oper.OPERATION_ID
join tb_panel_4m p4m on p4m.oper_code = sdm_oper.OPERATION_CODE
        and job.JOB_NO = p4m.workorder
join dbo.erp_sdm_standard_equipment eqp
        on p4m.eqp_code = eqp.EQUIPMENT_CODE
where 1 = 1
    and oper.WORKCENTER_ID = @workcenter_code
	and (
		(tbl_oper.oper_seq_no <= 1500  and p4m.oper_seq_no < tbl_oper.oper_seq_no) or 
		(tbl_oper.oper_seq_no > 1500 and (p4m.oper_seq_no > tbl_seq_prev.oper_seq_no and p4m.oper_seq_no < tbl_oper.oper_seq_no)) 
	)
group by eqp.EQUIPMENT_CODE
        ,       eqp.EQUIPMENT_DESCRIPTION