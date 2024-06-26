﻿SELECT T.GRADE
     , T.BOM_ITEM_CODE
     , T.BOM_ITEM_DESCRIPTION
     , T.LAYER
     , (CASE WHEN SUM(CASE WHEN TRUNC(INSPECT_EXTEND_DATE, 'MONTH') = TRUNC(APPS.ZF_GET_EXTEND_DATE(SYSDATE), 'MONTH') THEN T.WORK_PCS_QTY ELSE 0 END) != 0 THEN
                  ROUND(100 - (SUM(CASE WHEN TRUNC(INSPECT_EXTEND_DATE, 'MONTH') = TRUNC(APPS.ZF_GET_EXTEND_DATE(SYSDATE), 'MONTH') THEN T.TOTAL_DEFACT_QTY ELSE 0 END) / SUM(CASE WHEN TRUNC(INSPECT_EXTEND_DATE, 'MONTH') = TRUNC(APPS.ZF_GET_EXTEND_DATE(SYSDATE), 'MONTH') THEN T.WORK_PCS_QTY ELSE 0 END) * 100), 1)
             ELSE 0 END) AS RATE_MONTH
     , (CASE WHEN SUM(CASE WHEN INSPECT_EXTEND_DATE = APPS.ZF_GET_EXTEND_DATE(SYSDATE-1) THEN T.WORK_PCS_QTY ELSE 0 END) != 0 THEN
                  ROUND(100 - (SUM(CASE WHEN INSPECT_EXTEND_DATE = APPS.ZF_GET_EXTEND_DATE(SYSDATE-1) THEN T.TOTAL_DEFACT_QTY ELSE 0 END) / SUM(CASE WHEN INSPECT_EXTEND_DATE = APPS.ZF_GET_EXTEND_DATE(SYSDATE-1) THEN T.WORK_PCS_QTY ELSE 0 END) * 100), 1)
             ELSE 0 END) AS RATE_YESTERDAY
     , (CASE WHEN SUM(CASE WHEN INSPECT_EXTEND_DATE = APPS.ZF_GET_EXTEND_DATE(SYSDATE) THEN T.WORK_PCS_QTY ELSE 0 END) != 0 THEN
                  ROUND(100 - (SUM(CASE WHEN INSPECT_EXTEND_DATE = APPS.ZF_GET_EXTEND_DATE(SYSDATE) THEN T.TOTAL_DEFACT_QTY ELSE 0 END) / SUM(CASE WHEN INSPECT_EXTEND_DATE = APPS.ZF_GET_EXTEND_DATE(SYSDATE) THEN T.WORK_PCS_QTY ELSE 0 END) * 100), 1)
             ELSE 0 END) AS RATE_TODAY
     , (CASE WHEN SUM(CASE WHEN INSPECT_EXTEND_DATE = APPS.ZF_GET_EXTEND_DATE(SYSDATE) THEN T.WORK_PCS_QTY ELSE 0 END) != 0 THEN
                  ROUND((SUM(CASE WHEN INSPECT_EXTEND_DATE = APPS.ZF_GET_EXTEND_DATE(SYSDATE) THEN T.OPEN_DEFACT_QTY ELSE 0 END) / SUM(CASE WHEN INSPECT_EXTEND_DATE = APPS.ZF_GET_EXTEND_DATE(SYSDATE) THEN T.WORK_PCS_QTY ELSE 0 END) * 100), 1)
             ELSE 0 END) AS OPEN_DEFACT_QTY_TODAY
     , (CASE WHEN SUM(CASE WHEN INSPECT_EXTEND_DATE = APPS.ZF_GET_EXTEND_DATE(SYSDATE) THEN T.WORK_PCS_QTY ELSE 0 END) != 0 THEN
                  ROUND((SUM(CASE WHEN INSPECT_EXTEND_DATE = APPS.ZF_GET_EXTEND_DATE(SYSDATE) THEN T.SHORT_DEFACT_QTY ELSE 0 END) / SUM(CASE WHEN INSPECT_EXTEND_DATE = APPS.ZF_GET_EXTEND_DATE(SYSDATE) THEN T.WORK_PCS_QTY ELSE 0 END) * 100), 1)
             ELSE 0 END) AS SHORT_DEFACT_QTY_TODAY
     , (CASE WHEN SUM(CASE WHEN INSPECT_EXTEND_DATE = APPS.ZF_GET_EXTEND_DATE(SYSDATE) THEN T.WORK_PCS_QTY ELSE 0 END) != 0 THEN
                  ROUND((SUM(CASE WHEN INSPECT_EXTEND_DATE = APPS.ZF_GET_EXTEND_DATE(SYSDATE) THEN T.ETC_DEFACT_QTY ELSE 0 END) / SUM(CASE WHEN INSPECT_EXTEND_DATE = APPS.ZF_GET_EXTEND_DATE(SYSDATE) THEN T.WORK_PCS_QTY ELSE 0 END) * 100), 1)
             ELSE 0 END) AS ETC_DEFACT_QTY_TODAY
     , T.IMPORTANT_ITEM
  FROM (
          SELECT APPS.ZF_GET_EXTEND_DATE(TO_DATE(AIH.INSPECT_DATE, 'YYYY-MM-DD HH24:MI:SS')) AS INSPECT_EXTEND_DATE
               , (CASE WHEN ZII.INVENTORY_ITEM_ID IS NULL THEN 'N' ELSE 'Y' END) AS IMPORTANT_ITEM
               , NVL(ELE.ENTRY_DESCRIPTION,'C등급') AS GRADE
               , SIR.BOM_ITEM_CODE
               , SIR.BOM_ITEM_DESCRIPTION
               , QCM.VALUE3 AS LAYER
               , AIH.WORK_PCS_QTY AS WORK_PCS_QTY
               , SUM(CASE WHEN AIL.AOI_DEFECT_CODE = 10            THEN AIL.TOP_DEFACT_QTY + AIL.BOT_DEFACT_QTY ELSE 0 END) AS OPEN_DEFACT_QTY
               , SUM(CASE WHEN AIL.AOI_DEFECT_CODE = 20            THEN AIL.TOP_DEFACT_QTY + AIL.BOT_DEFACT_QTY ELSE 0 END) AS SHORT_DEFACT_QTY
               , SUM(CASE WHEN AIL.AOI_DEFECT_CODE NOT IN (10, 20) THEN AIL.TOP_DEFACT_QTY + AIL.BOT_DEFACT_QTY ELSE 0 END) AS ETC_DEFACT_QTY
               , SUM(AIL.TOP_DEFACT_QTY + AIL.BOT_DEFACT_QTY)                                                               AS TOTAL_DEFACT_QTY
            FROM APPS.AOI_INSPECT_HEADER AIH 
            	INNER      JOIN APPS.AOI_INSPECT_LINE  AIL ON AIH.SOB_ID = AIL.SOB_ID AND AIH.ORG_ID = AIL.ORG_ID AND AIH.AOI_INSPECT_HEADER_ID = AIL.AOI_INSPECT_HEADER_ID
                INNER      JOIN APPS.QM_COMMON         QCM ON AIH.SOB_ID = QCM.SOB_ID AND AIH.ORG_ID = QCM.ORG_ID AND AIH.DEFECTIVE_LAYER_CODE  = QCM.CODE AND QCM.GROUP_CODE = 'TEST_LAYERS'
                INNER      JOIN APPS.SDM_ITEM_REVISION SIR ON AIH.BOM_ITEM_ID = SIR.BOM_ITEM_ID
                INNER      JOIN APPS.SDM_ITEM_SPEC     SIS ON SIR.BOM_ITEM_ID = SIS.BOM_ITEM_ID
                LEFT OUTER JOIN APPS.EAPP_LOOKUP_ENTRY ELE ON SIS.ITEM_DIFFICULT_LCODE = ELE.ENTRY_CODE AND ELE.LOOKUP_TYPE = 'SDM_ITEM_DIFFICULT'
                LEFT OUTER JOIN APPS.Z_IMPORTANT_ITEM  ZII ON SIR.INVENTORY_ITEM_ID = ZII.INVENTORY_ITEM_ID AND ZII.LU_ENTRY_ID = 6000003743
           WHERE AIH.SOB_ID = 90
             AND AIH.ORG_ID = 901
             AND AIH.INSPECT_DATE BETWEEN LEAST(TO_CHAR(TRUNC(SYSDATE, 'MONTH'), 'YYYYMMDD') || '080000', TO_CHAR(APPS.ZF_GET_EXTEND_DATE(SYSDATE-1), 'YYYYMMDD') || '080000')
                                      AND TO_CHAR(APPS.ZF_GET_EXTEND_DATE(SYSDATE+1), 'YYYYMMDD') || '075959'
             AND AOI_DEFECT_CODE != '999'
           GROUP BY APPS.ZF_GET_EXTEND_DATE(TO_DATE(AIH.INSPECT_DATE, 'YYYY-MM-DD HH24:MI:SS'))
                  , ZII.INVENTORY_ITEM_ID
                  , ELE.ENTRY_DESCRIPTION
                  , SIR.BOM_ITEM_CODE
                  , SIR.BOM_ITEM_DESCRIPTION
                  , QCM.VALUE3
                  , AIH.WORK_PCS_QTY
       ) T
 GROUP BY T.GRADE
        , T.BOM_ITEM_CODE
        , T.BOM_ITEM_DESCRIPTION
        , T.LAYER
        , T.IMPORTANT_ITEM
 -- 1. 당일 검사 수량이 있는것 우선
 -- 2. 등급 우선
 -- 3. 수율이 낮은것 우선
 ORDER BY CASE WHEN SUM(CASE WHEN INSPECT_EXTEND_DATE = APPS.ZF_GET_EXTEND_DATE(SYSDATE) THEN T.WORK_PCS_QTY ELSE 0 END) != 0 THEN 0 ELSE 1 END
        , CASE SUBSTR(T.GRADE,1,1) WHEN 'S' THEN 0
                                   WHEN 'A' THEN 1
                                   WHEN 'B' THEN 2
                                   WHEN 'C' THEN 3 ELSE 9 END
        , (CASE WHEN SUM(CASE WHEN INSPECT_EXTEND_DATE = APPS.ZF_GET_EXTEND_DATE(SYSDATE) THEN T.WORK_PCS_QTY ELSE 0 END) != 0 THEN
                     ROUND(100 - (SUM(CASE WHEN INSPECT_EXTEND_DATE = APPS.ZF_GET_EXTEND_DATE(SYSDATE) THEN T.TOTAL_DEFACT_QTY ELSE 0 END) / SUM(CASE WHEN INSPECT_EXTEND_DATE = APPS.ZF_GET_EXTEND_DATE(SYSDATE) THEN T.WORK_PCS_QTY ELSE 0 END) * 100), 2)
                ELSE 0 END)