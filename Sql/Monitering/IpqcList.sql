﻿-- TITLE : IPQC 외관불량
-- COLUMN : 순번, 발생시간, 공정명, 구분, 모델코드, 모델명, 작업지시서번호, 불량명, 불량률(%)
SELECT   /*+ INDEX (IOL QM_INSPECTION_OP_LINE_N1) */
       TO_CHAR(IOH.INSPECTION_DATE, 'HH24:MI') AS INSPECTION_TIME
     , SSO.OPERATION_DESCRIPTION
     , IIS.DESCRIPTION AS ITEM_SECTION_DESC
     , SIR.BOM_ITEM_CODE
     , SIR.BOM_ITEM_DESCRIPTION
     , IOH.JOB_NO
     , QMC1.CODE_NAME AS REJECT_DESC
     , CASE When ROUND(IOL.REJECT_RATE, 2) > 100 THEN 100 ELSE ROUND(IOL.REJECT_RATE, 2) END AS REJECT_RATE
  FROM APPS.QM_INSPECTION_OP_HEADER IOH 
  		INNER JOIN APPS.SDM_ITEM_REVISION      SIR  ON IOH.BOM_ITEM_ID = SIR.BOM_ITEM_ID
        INNER JOIN APPS.INV_ITEM_MASTER        IIM  ON SIR.INVENTORY_ITEM_ID = IIM.INVENTORY_ITEM_ID
        INNER JOIN APPS.INV_ITEM_SECTION       IIS  ON IIM.ITEM_SECTION_ID = IIS.ITEM_SECTION_ID
        INNER JOIN APPS.SDM_STANDARD_OPERATION SSO  ON IOH.SOB_ID = SSO.SOB_ID AND IOH.ORG_ID = SSO.ORG_ID AND IOH.OPERATION_ID = SSO.OPERATION_ID
        INNER JOIN APPS.QM_INSPECTION_OP_LINE  IOL  ON IOH.SOB_ID = IOL.SOB_ID AND IOH.ORG_ID = IOL.ORG_ID AND IOH.INSPECTION_OP_HEADER_ID = IOL.INSPECTION_OP_HEADER_ID
        INNER JOIN APPS.QM_COMMON              QMC1 ON IOL.SOB_ID = QMC1.SOB_ID AND IOL.ORG_ID = QMC1.ORG_ID AND IOL.ATTRIBUTE_A = QMC1.CODE  AND QMC1.GROUP_CODE = 'INSPECTOR_Q_CODE'
 WHERE IOH.SOB_ID = 90
   AND IOH.ORG_ID = 901
   AND IOH.IPQC_FLAG = 'B'
   AND IOH.EXTEND_DATE BETWEEN APPS.ZF_GET_EXTEND_DATE(SYSDATE - 1) AND APPS.ZF_GET_EXTEND_DATE(SYSDATE)
   AND NVL(IOL.REJECT_RATE, 0) > NVL(TO_NUMBER(QMC1.VALUE2) ,0)
 ORDER BY IOH.INSPECTION_DATE DESC