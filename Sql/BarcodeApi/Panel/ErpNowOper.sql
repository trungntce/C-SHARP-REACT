select
	cur.JOB_ID						as job_id
,	cur.JOB_NO						as job_no
,	cur.JOB_STATUS_CODE				as job_status_code
,	cur.ONHAND_OPERATION_SEQ_NO		as operation_seq_no
,	sdm_oper.OPERATION_CODE			as operation_code
,	sdm_oper.OPERATION_DESCRIPTION	as operation_description
,   sso_tl.OPERATION_DESCRIPTION    as operation_description_tl

from
	[dbo].[erp_wip_job_entities_mes] cur
left join
	[dbo].[erp_wip_operations] oper
	on	cur.JOB_ID = oper.JOB_ID
	and	cur.ONHAND_OPERATION_SEQ_NO = oper.OPERATION_SEQ_NO
left join
	[dbo].[erp_sdm_standard_operation] sdm_oper
	on	oper.OPERATION_ID = sdm_oper.OPERATION_ID
left join 
	erp_sdm_standard_operation_tl sso_tl
	on oper.OPERATION_ID = sso_tl.OPERATION_ID
where
	cur.JOB_NO = @barcode
order by 
	oper.CREATION_DATE desc
;

