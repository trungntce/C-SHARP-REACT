--콤보용
select
	'IPQC' as category
--,	entry.ENTRY_DESCRIPTION + isnull(entry2.ENTRY_DESCRIPTION, '') + isnull(entry3.ENTRY_DESCRIPTION, '') AS inspection_desc
--,	entry.ENTRY_DESCRIPTION + isnull(entry2.ENTRY_DESCRIPTION, '') + isnull(entry3.ENTRY_DESCRIPTION, '') + ' (' + convert(varchar, cs.CUSTOMER_STANDARD_MIN) + ' ~ ' + convert(varchar, cs.CUSTOMER_STANDARD_MAX) + ')'
,	entry.ENTRY_DESCRIPTION +
				case when entry2.ENTRY_DESCRIPTION is not null then entry2.ENTRY_DESCRIPTION else '' end +
				case when entry3.ENTRY_DESCRIPTION is not null then entry3.ENTRY_DESCRIPTION else '' end +
				' (' + convert(varchar, cs.CUSTOMER_STANDARD_MIN) + ' ~ ' + convert(varchar, cs.CUSTOMER_STANDARD_MAX) + ')' AS inspection_desc
,	oper.OPERATION_CODE				as oper_code
FROM 
	dbo.erp_qm_inspection_op_header header
JOIN
	dbo.erp_qm_inspection_op_cs cs 
	ON header.INSPECTION_OP_HEADER_ID  = cs.INSPECTION_OP_HEADER_ID
JOIN 
	dbo.erp_sdm_standard_operation oper 
	ON header.OPERATION_ID 			= oper.OPERATION_ID               
LEFT OUTER JOIN 
	dbo.erp_eapp_lookup_entry entry 
	ON cs.CHECK_TYPE_ID       		= entry.LOOKUP_ENTRY_ID
LEFT OUTER JOIN 
	dbo.erp_eapp_lookup_entry entry2
	ON cs.CHECK_POSITION_ID       	= entry2.LOOKUP_ENTRY_ID
LEFT OUTER JOIN 
	dbo.erp_eapp_lookup_entry entry3
	ON cs.CHECK_NUMBER_ID         	= entry3.LOOKUP_ENTRY_ID
WHERE 
	header.SOB_ID = 90
	AND header.ORG_ID = 901
	AND header.IPQC_FLAG = 'A'
	AND cs.N_VALUE1 IS NOT NULL
	AND oper.OPERATION_CODE = @oper_code
group by 
--	entry.ENTRY_DESCRIPTION + isnull(entry2.ENTRY_DESCRIPTION, '') + isnull(entry3.ENTRY_DESCRIPTION, '')
--	entry.ENTRY_DESCRIPTION + isnull(entry2.ENTRY_DESCRIPTION, '') + isnull(entry3.ENTRY_DESCRIPTION, '') + ' (' + convert(varchar, cs.CUSTOMER_STANDARD_MIN) + ' ~ ' + convert(varchar, cs.CUSTOMER_STANDARD_MAX) + ')'
	entry.ENTRY_DESCRIPTION +
				case when entry2.ENTRY_DESCRIPTION is not null then entry2.ENTRY_DESCRIPTION else '' end +
				case when entry3.ENTRY_DESCRIPTION is not null then entry3.ENTRY_DESCRIPTION else '' end +
				' (' + convert(varchar, cs.CUSTOMER_STANDARD_MIN) + ' ~ ' + convert(varchar, cs.CUSTOMER_STANDARD_MAX) + ')'
,	oper.OPERATION_CODE
--,	cs.CUSTOMER_STANDARD_MIN
--,	cs.CUSTOMER_STANDARD_MAX
union all
   --신뢰성
SELECT
	@trust as category
,	code1.CODE_NAME+'-'+ code2.CODE_NAME + ' (' + convert(varchar, isnull(header.SPEC,0) - isnull(header.SPEC_MINUS_TOL,999999999)) + ' ~ ' + convert(varchar, isnull(header.SPEC,0) + isnull(header.SPEC_PLUS_TOL,999999999)) + ')'     AS inspection_desc
,	oper.OPERATION_CODE					as oper_code
FROM 
	dbo.erp_z_mes_reliability_header header
JOIN 
	dbo.erp_z_mes_reliability_line      line 
	ON header.RELIABILITY_HEADER_ID  = line.RELIABILITY_HEADER_ID
JOIN 
	dbo.erp_sdm_standard_operation    	oper 
	ON header.OPERATION_ID           = oper.OPERATION_ID
JOIN 
	dbo.erp_z_mes_reliability_item      item 
	ON item.RELIABILITY_ITEM_ID    = header.RELIABILITY_ITEM_ID
LEFT OUTER JOIN 
	dbo.erp_qm_common code1
	ON item.MES_Y_FACTOR_ID        = code1.COMMON_ID
LEFT OUTER JOIN 
	dbo.erp_qm_common code2
	ON item.MES_Y_FACTOR_DTL_ID    = code2.COMMON_ID
WHERE 
	oper.SOB_ID = 90 
	AND oper.ORG_ID =901
	AND oper.OPERATION_TYPE_ID = 199 -- 공정 타입 [유산동/V06], 신뢰성 검사 공정
--             AND MRH.INSPECTION_DATE BETWEEN ZF_GET_EXTEND_DATE(SYSDATE - 1) AND ZF_GET_EXTEND_DATE(SYSDATE)          
	AND line.COLUMN_VALUE IS NOT NULL
	AND oper.OPERATION_CODE = @oper_code
group by 
	code1.CODE_NAME+'-'+ code2.CODE_NAME
,	convert(varchar, isnull(header.SPEC,0) - isnull(header.SPEC_MINUS_TOL,999999999))
,	convert(varchar, isnull(header.SPEC,0) + isnull(header.SPEC_PLUS_TOL,999999999))
,	oper.OPERATION_CODE
union all
--CMI
select
	'CMI' as category
,	cmi.SPHANLOAI + ' (' + convert(varchar, CONVERT(FLOAT,cmi.SLCL)) + ' ~ ' + convert(varchar, CONVERT(FLOAT,cmi.SUCL)) + ')' AS inspection_desc
,	sdm_oper.OPERATION_CODE				as oper_code
from 
	erp_tblthickness cmi		
join dbo.erp_wip_operations wip_oper 
	on cmi.SLOTNUMBER = wip_oper.JOB_NO
	and cmi.OPERATION_SEQ_NO = wip_oper.OPERATION_SEQ_NO
join
	dbo.erp_sdm_standard_operation sdm_oper
	on wip_oper.OPERATION_ID  = sdm_oper.OPERATION_ID
where
	sdm_oper.OPERATION_CODE = @oper_code
group by 
	cmi.SPHANLOAI + ' (' + convert(varchar, CONVERT(FLOAT,cmi.SLCL)) + ' ~ ' + convert(varchar, CONVERT(FLOAT,cmi.SUCL)) + ')'
,	sdm_oper.OPERATION_CODE
;
--select 
--	'CMI' as category
----,	cmi.SPHANLOAI + ' (' + FORMAT(CONVERT(FLOAT,cmi.SLCL), '0.00') + ' ~ ' + FORMAT(CONVERT(FLOAT,cmi.SUCL), '0.00') + ')' AS inspection_desc  
--,	cmi.SPHANLOAI + ' (' + convert(varchar, CONVERT(FLOAT,cmi.SLCL)) + ' ~ ' + convert(varchar, CONVERT(FLOAT,cmi.SUCL)) + ')' AS inspection_desc  
--,	sdm_oper.OPERATION_CODE				as oper_code
--from 
--	erp_tblthickness cmi		
--join dbo.erp_wip_operations wip_oper 
--	on cmi.SLOTNUMBER = wip_oper.JOB_NO
--	and cmi.OPERATION_SEQ_NO = wip_oper.OPERATION_SEQ_NO
--join
--	dbo.erp_sdm_standard_operation sdm_oper
--	on wip_oper.OPERATION_ID  = sdm_oper.OPERATION_ID
--where
--	sdm_oper.OPERATION_CODE = @oper_code
--group by 
----	cmi.SPHANLOAI
----,	FORMAT(CONVERT(FLOAT,SLCL), '0.00')
----,	FORMAT(CONVERT(FLOAT,SUCL), '0.00')
--	cmi.SPHANLOAI + ' (' + convert(varchar, CONVERT(FLOAT,cmi.SLCL)) + ' ~ ' + convert(varchar, CONVERT(FLOAT,CONVERT(FLOAT,cmi.SUCL)) + ')'
--,	sdm_oper.OPERATION_CODE
	