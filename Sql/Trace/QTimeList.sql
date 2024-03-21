with cte as
(
	select
		max(TABLE_ROW_NO) as TABLE_ROW_NO
	from
		dbo.erp_zsi_mes_qtime_history
	where
		JOB_NO = @workorder
	and TO_OPERATION_SEQ_NO = @to_oper_seq_no
)
select
	qtime.[STATUS]						as [status]

,	qtime.TO_OP_CLASS_CODE				as to_op_class_code
,	qtime.TO_OP_CLASS_DESC				as to_op_class_desc

,	oper_type.OP_TYPE_CODE				as to_op_type_code
,	oper_type.OP_TYPE_DESCRIPTION		as to_op_type_desc

,	qtime.FROM_OPERATION_CODE			as from_oper_code
,	qtime.FROM_OPERATION_DESCRIPTION	as from_oper_desc
,	qtime.FROM_RUN_END_DATE				as from_end_dt

,	qtime.TO_OPERATION_CODE				as to_oper_code
,	qtime.TO_OPERATION_DESCRIPTION		as to_oper_desc

,	qtime.WORK_EXPIRED_LIMIT_HOUR		as limit_hour
,	qtime.WORK_EXPIRED_WARNING_HOUR		as warn_hour
,	qtime.PASS_HOUR						as pass_hour
from
	cte
join
	dbo.erp_zsi_mes_qtime_history qtime
	on	cte.TABLE_ROW_NO = qtime.TABLE_ROW_NO
join
	dbo.erp_sdm_standard_operation sdm_oper
	on	TO_OPERATION_CODE = sdm_oper.OPERATION_CODE
join
	dbo.erp_sdm_operation_type oper_type
	on	sdm_oper.OPERATION_TYPE_ID = oper_type.OP_TYPE_ID
join
	dbo.erp_sdm_operation_class oper_class
	on	sdm_oper.OPERATION_CLASS_ID = oper_class.OP_CLASS_ID
;
