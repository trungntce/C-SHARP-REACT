select
	b.ONHAND_PNL_QTY			as panel_qty,
	b.JOB_NO 					as workorder,
	a.OPERATION_SEQ_NO 			as oper_seq_no,
	b.ONHAND_OPERATION_SEQ_NO 	as oper_seq_no_now
from 
	erp_wip_operations a join 
	erp_wip_job_entities_mes b  on a.JOB_ID = b.JOB_ID 
WHERE 
	a.JOB_NO = @workorder
	and a.OPERATION_SEQ_NO = @oper_seq_no

