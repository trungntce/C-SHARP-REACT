select
	rw.corp_id
,	rw.fac_id
,	rw.roll_rework_id
,	rw.oper_seq
,	rw.oper_code
,	rw.oper_name
,	rw.parent_roll_id
,	rw.roll_id
,	rw.put_remark
,	rw.refuse_remark
,	rw.approve_remark
,	rw.rework_code
,	std.rework_name
,	rw.rework_approve_yn
,	rw.put_update_user
,	rw.refuse_update_user
,	rw.approve_update_user
,	rw.put_dt
,	rw.refuse_dt
,	rw.approve_dt
,	concat_ws('::', oper.OPERATION_DESCRIPTION, oper_tl.OPERATION_DESCRIPTION, '') as tran_oper_name
from 
	dbo.tb_roll_rework rw
left join
	dbo.tb_rework std on std.rework_code = rw.rework_code
join
	dbo.erp_sdm_standard_operation oper 
	on oper.OPERATION_CODE = rw.oper_code 
join
	dbo.erp_sdm_standard_operation_tl oper_tl
	on oper.OPERATION_ID = oper_tl.OPERATION_ID
where
	rw.corp_id		  	= @corp_id
and	rw.fac_id			= @fac_id
and	rw.parent_roll_id	= @parent_roll_id
and	rw.roll_id 			= @roll_id
order by
	rw.put_dt desc
;