--콤보용
select
	'IPQC' as category
,	LE.ENTRY_DESCRIPTION + isnull(LE2.ENTRY_DESCRIPTION, '') + isnull(LE3.ENTRY_DESCRIPTION, '') AS inspection_desc
FROM 
	dbo.erp_qm_inspection_op_header IOH
JOIN
	dbo.erp_qm_inspection_op_cs IOC 
	ON IOH.INSPECTION_OP_HEADER_ID  = IOC.INSPECTION_OP_HEADER_ID
JOIN 
	dbo.erp_sdm_standard_operation SSO 
	ON IOH.OPERATION_ID 			= SSO.OPERATION_ID               
LEFT OUTER JOIN 
	dbo.erp_eapp_lookup_entry LE 
	ON IOC.CHECK_TYPE_ID       		= LE.LOOKUP_ENTRY_ID
LEFT OUTER JOIN 
	dbo.erp_eapp_lookup_entry      		LE2 
	ON IOC.CHECK_POSITION_ID       	= LE2.LOOKUP_ENTRY_ID
LEFT OUTER JOIN 
	dbo.erp_eapp_lookup_entry      		LE3 
	ON IOC.CHECK_NUMBER_ID         	= LE3.LOOKUP_ENTRY_ID
WHERE 
	IOH.SOB_ID = 90
	AND IOH.ORG_ID = 901
	AND IOH.IPQC_FLAG = 'A'
	AND IOC.N_VALUE1 IS NOT NULL
group by LE.ENTRY_DESCRIPTION + isnull(LE2.ENTRY_DESCRIPTION, '') + isnull(LE3.ENTRY_DESCRIPTION, '')
union all
   --신뢰성
SELECT
	@trust as category
,	QC.CODE_NAME+'-'+ QC2.CODE_NAME    AS inspection_desc
FROM 
	dbo.erp_z_mes_reliability_header MRH
JOIN 
	dbo.erp_z_mes_reliability_line      MRL 
	ON MRH.RELIABILITY_HEADER_ID  = MRL.RELIABILITY_HEADER_ID
JOIN 
	dbo.erp_sdm_standard_operation    	SSO 
	ON MRH.OPERATION_ID           = SSO.OPERATION_ID
JOIN 
	dbo.erp_z_mes_reliability_item      MRI 
	ON MRI.RELIABILITY_ITEM_ID    = MRH.RELIABILITY_ITEM_ID
LEFT OUTER JOIN 
	dbo.erp_qm_common                   QC  
	ON MRI.MES_Y_FACTOR_ID        = QC.COMMON_ID
LEFT OUTER JOIN 
	dbo.erp_qm_common                   QC2 
	ON MRI.MES_Y_FACTOR_DTL_ID    = QC2.COMMON_ID
WHERE 
	SSO.SOB_ID = 90 
	AND SSO.ORG_ID =901
	AND SSO.OPERATION_TYPE_ID = 199 -- 공정 타입 [유산동/V06], 신뢰성 검사 공정
--             AND MRH.INSPECTION_DATE BETWEEN ZF_GET_EXTEND_DATE(SYSDATE - 1) AND ZF_GET_EXTEND_DATE(SYSDATE)          
	AND MRL.COLUMN_VALUE IS NOT NULL
group by 
	QC.CODE_NAME+'-'+ QC2.CODE_NAME
union all        
--IQC 치수 데이터
SELECT 
	'IQC' as category 
,	@Chisu + QIM.INSPECTION_POINT  AS inspection_desc
FROM dbo.erp_qm_out_iqc_measure QIM
WHERE 
	QIM.DATA_01 IS NOT NULL
GROUP BY 
	QIM.INSPECTION_POINT
union all
--CMI
select 
	'CMI' as category
,	SPHANLOAI AS inspection_desc  
from 
	erp_tblthickness
group by 
	SPHANLOAI