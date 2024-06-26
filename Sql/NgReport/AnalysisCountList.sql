﻿SELECT 
    '약품' as type_name
,	SUM(CASE WHEN SPC.SPC_TIME BETWEEN TO_CHAR(TRUNC(SYSDATE, 'MM') + INTERVAL '0' HOUR, 'YYYY-MM-DD') AND TO_CHAR(SYSDATE, 'YYYY-MM-DD') THEN 1 ELSE 0 END) AS mon_val
,	SUM(CASE WHEN SPC.SPC_TIME BETWEEN TO_CHAR(SYSDATE - INTERVAL '6' DAY , 'YYYY-MM-DD') AND TO_CHAR(SYSDATE - INTERVAL '5' DAY , 'YYYY-MM-DD') THEN 1 ELSE 0 END) AS day7_val
,	SUM(CASE WHEN SPC.SPC_TIME BETWEEN TO_CHAR(SYSDATE - INTERVAL '5' DAY , 'YYYY-MM-DD') AND TO_CHAR(SYSDATE - INTERVAL '4' DAY , 'YYYY-MM-DD') THEN 1 ELSE 0 END) AS day6_val
,	SUM(CASE WHEN SPC.SPC_TIME BETWEEN TO_CHAR(SYSDATE - INTERVAL '4' DAY , 'YYYY-MM-DD') AND TO_CHAR(SYSDATE - INTERVAL '3' DAY , 'YYYY-MM-DD') THEN 1 ELSE 0 END) AS day5_val
,	SUM(CASE WHEN SPC.SPC_TIME BETWEEN TO_CHAR(SYSDATE - INTERVAL '3' DAY , 'YYYY-MM-DD') AND TO_CHAR(SYSDATE - INTERVAL '2' DAY , 'YYYY-MM-DD') THEN 1 ELSE 0 END) AS day4_val
,	SUM(CASE WHEN SPC.SPC_TIME BETWEEN TO_CHAR(SYSDATE - INTERVAL '2' DAY , 'YYYY-MM-DD') AND TO_CHAR(SYSDATE - INTERVAL '1' DAY , 'YYYY-MM-DD') THEN 1 ELSE 0 END) AS day3_val
,	SUM(CASE WHEN SPC.SPC_TIME BETWEEN TO_CHAR(SYSDATE - INTERVAL '1' DAY , 'YYYY-MM-DD') AND TO_CHAR(SYSDATE, 'YYYY-MM-DD') THEN 1 ELSE 0 END) AS day2_val
,	SUM(CASE WHEN SPC.SPC_TIME BETWEEN TO_CHAR(SYSDATE, 'YYYY-MM-DD') AND TO_CHAR(SYSDATE + INTERVAL '1' DAY , 'YYYY-MM-DD') THEN 1 ELSE 0 END) AS day1_val

,	SUM(CASE WHEN SPC.SPC_TIME BETWEEN TO_CHAR(TRUNC(SYSDATE, 'MM') + INTERVAL '0' HOUR, 'YYYY-MM-DD') AND TO_CHAR(SYSDATE, 'YYYY-MM-DD') and  NVL(SEF.CTQ_FLAG, 'N') = 'Y'  THEN 1 ELSE 0 END) AS mon_ctq_val
,	SUM(CASE WHEN SPC.SPC_TIME BETWEEN TO_CHAR(SYSDATE - INTERVAL '6' DAY , 'YYYY-MM-DD') AND TO_CHAR(SYSDATE - INTERVAL '5' DAY , 'YYYY-MM-DD') and  NVL(SEF.CTQ_FLAG, 'N') = 'Y'  THEN 1 ELSE 0 END) AS day7_ctq_val
,	SUM(CASE WHEN SPC.SPC_TIME BETWEEN TO_CHAR(SYSDATE - INTERVAL '5' DAY , 'YYYY-MM-DD') AND TO_CHAR(SYSDATE - INTERVAL '4' DAY , 'YYYY-MM-DD') and  NVL(SEF.CTQ_FLAG, 'N') = 'Y'  THEN 1 ELSE 0 END) AS day6_ctq_val
,	SUM(CASE WHEN SPC.SPC_TIME BETWEEN TO_CHAR(SYSDATE - INTERVAL '4' DAY , 'YYYY-MM-DD') AND TO_CHAR(SYSDATE - INTERVAL '3' DAY , 'YYYY-MM-DD') and  NVL(SEF.CTQ_FLAG, 'N') = 'Y'  THEN 1 ELSE 0 END) AS day5_ctq_val
,	SUM(CASE WHEN SPC.SPC_TIME BETWEEN TO_CHAR(SYSDATE - INTERVAL '3' DAY , 'YYYY-MM-DD') AND TO_CHAR(SYSDATE - INTERVAL '2' DAY , 'YYYY-MM-DD') and  NVL(SEF.CTQ_FLAG, 'N') = 'Y'  THEN 1 ELSE 0 END) AS day4_ctq_val
,	SUM(CASE WHEN SPC.SPC_TIME BETWEEN TO_CHAR(SYSDATE - INTERVAL '2' DAY , 'YYYY-MM-DD') AND TO_CHAR(SYSDATE - INTERVAL '1' DAY , 'YYYY-MM-DD') and  NVL(SEF.CTQ_FLAG, 'N') = 'Y'  THEN 1 ELSE 0 END) AS day3_ctq_val
,	SUM(CASE WHEN SPC.SPC_TIME BETWEEN TO_CHAR(SYSDATE - INTERVAL '1' DAY , 'YYYY-MM-DD') AND TO_CHAR(SYSDATE, 'YYYY-MM-DD') and  NVL(SEF.CTQ_FLAG, 'N') = 'Y'  THEN 1 ELSE 0 END) AS day2_ctq_val
,	SUM(CASE WHEN SPC.SPC_TIME BETWEEN TO_CHAR(SYSDATE, 'YYYY-MM-DD') AND TO_CHAR(SYSDATE + INTERVAL '1' DAY , 'YYYY-MM-DD') and  NVL(SEF.CTQ_FLAG, 'N') = 'Y'  THEN 1 ELSE 0 END) AS day1_ctq_val

FROM 
(
SELECT SEM.EQUIPMENT_ID
,		 SEM.EQP_CATEGORY_ID
,		 SEM.SPC_FACTOR_ID
,	     NVL(SEM.NORMAL_VALUE_A,SEM.NORMAL_VALUE_D) AS SPC_VALUE
,	     NVL(SEM.NORMAL_TIME_A,SEM.NORMAL_TIME_D)	AS SPC_TIME
FROM APPS.SPC_EQP_MEASURE SEM
INNER JOIN APPS.SPC_EQP_FACTOR   SEF ON SEF.SPC_FACTOR_ID  = SEM.SPC_FACTOR_ID
WHERE SEM.MEASURE_DATE Between APPS.ZF_GET_EXTEND_DATE(ADD_MONTHS(SYSDATE, -1)) And APPS.ZF_GET_EXTEND_DATE(SYSDATE)
    AND  NVL(SEM.NORMAL_VALUE_A,SEM.NORMAL_VALUE_D) NOT BETWEEN NVL(SEF.NORMINAL_VALUE,0) - NVL(SEF.TOL_LSL_VALUE,0) 
    														   AND NVL(SEF.NORMINAL_VALUE,0) + NVL(SEF.TOL_USL_VALUE,0)
UNION ALL 	
SELECT SEM.EQUIPMENT_ID
,		 SEM.EQP_CATEGORY_ID
,		 SEM.SPC_FACTOR_ID
,	     NVL(SEM.NORMAL_VALUE_B,SEM.NORMAL_VALUE_E) AS SPC_VALUE
,	     NVL(SEM.NORMAL_TIME_B,SEM.NORMAL_TIME_E)	AS SPC_TIME
FROM APPS.SPC_EQP_MEASURE SEM
INNER JOIN APPS.SPC_EQP_FACTOR   SEF ON SEF.SPC_FACTOR_ID  = SEM.SPC_FACTOR_ID
WHERE SEM.MEASURE_DATE Between APPS.ZF_GET_EXTEND_DATE(ADD_MONTHS(SYSDATE, -1)) And APPS.ZF_GET_EXTEND_DATE(SYSDATE) 
AND NVL(SEM.NORMAL_VALUE_B,SEM.NORMAL_VALUE_E) NOT BETWEEN NVL(SEF.NORMINAL_VALUE,0) - NVL(SEF.TOL_LSL_VALUE,0) 
														 AND NVL(SEF.NORMINAL_VALUE,0) + NVL(SEF.TOL_USL_VALUE,0)
UNION ALL 
SELECT SEM.EQUIPMENT_ID
,		 SEM.EQP_CATEGORY_ID
,		 SEM.SPC_FACTOR_ID
,	     NVL(SEM.NORMAL_VALUE_C,SEM.NORMAL_VALUE_F) AS SPC_VALUE
,	     NVL(SEM.NORMAL_TIME_C,SEM.NORMAL_TIME_F)	AS SPC_TIME
FROM APPS.SPC_EQP_MEASURE SEM
INNER JOIN APPS.SPC_EQP_FACTOR   SEF ON SEF.SPC_FACTOR_ID  = SEM.SPC_FACTOR_ID
WHERE SEM.MEASURE_DATE Between APPS.ZF_GET_EXTEND_DATE(ADD_MONTHS(SYSDATE, -1)) And APPS.ZF_GET_EXTEND_DATE(SYSDATE)
AND NVL(SEM.NORMAL_VALUE_C,SEM.NORMAL_VALUE_F) NOT BETWEEN NVL(SEF.NORMINAL_VALUE,0) - NVL(SEF.TOL_LSL_VALUE,0) 
 	 													 AND NVL(SEF.NORMINAL_VALUE,0) + NVL(SEF.TOL_USL_VALUE,0)
) SPC
INNER JOIN APPS.SPC_EQP_CATEGORY 		 		SEC ON SEC.EQP_CATEGORY_ID 	= SPC.EQP_CATEGORY_ID 
INNER JOIN APPS.SDM_OPERATION_CLASS_TLV 		SOC ON SOC.OP_CLASS_ID 		= SEC.OP_CLASS_ID
INNER JOIN APPS.SDM_STANDARD_EQUIPMENT_TLV 	SSE ON SSE.EQUIPMENT_ID 	= SPC.EQUIPMENT_ID
INNER JOIN APPS.SPC_EQP_FACTOR   				SEF ON SEF.SPC_FACTOR_ID  	= SPC.SPC_FACTOR_ID
WHERE SPC.SPC_TIME IS NOT NULL
  AND SPC.SPC_TIME BETWEEN TO_CHAR(SYSDATE - INTERVAL '1' month, 'YYYY-MM-DD') AND TO_CHAR(SYSDATE , 'YYYY-MM-DD')
  AND SSE.EQUIPMENT_CODE = :eqp_code
order by SPC.SPC_TIME DESC
