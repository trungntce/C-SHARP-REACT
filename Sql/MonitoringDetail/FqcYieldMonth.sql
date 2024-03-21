﻿-- 월간수율 
SELECT 
	100 - (NVL(ROUND((NULLIF(SUM(SRX.REAL_REJECT_UOM_QTY),0)) 
                     / NULLIF((NVL(SUM(SRX.RELEASE_QTY),0)),0)*100 ,1),0)     
                  ) AS YIELD_RATE 
FROM(
      -- 월간수율
      SELECT TRUNC(WJE.JOB_RELEASE_DATE)
           , TRUNC(WJE.WIP_COMPLETE_EXTEND_DATE)
           , WJE.BOM_ITEM_ID
           , SIR.BOM_ITEM_CODE
           , SIR.BOM_ITEM_DESCRIPTION
           , WJE.JOB_NO
           , (NVL(WJE.RELEASE_QTY,0) - NVL(WJE.SPLIT_OUT_QTY,0) - NVL(WJE.REPAIR_OUT_QTY,0)) AS RELEASE_QTY
           , SUM(NVL(MTR.REJECT_UOM_QTY,0) - NVL(MTR.REVIVAL_UOM_QTY,0)) AS REAL_REJECT_UOM_QTY                                                                                                                           
      FROM APPS.WIP_JOB_ENTITIES    WJE
         , APPS.SDM_ITEM_REVISION   SIR
         , APPS.WIP_MOVE_TRX_REJECT MTR
         , APPS.QM_REJECT_TYPE      QRT
         , APPS.INV_ITEM_MASTER     IIM
      WHERE WJE.JOB_ID            = MTR.JOB_ID
        AND WJE.BOM_ITEM_ID       = SIR.BOM_ITEM_ID
        AND MTR.REJECT_TYPE_ID    = QRT.REJECT_TYPE_ID
        AND WJE.INVENTORY_ITEM_ID = IIM.INVENTORY_ITEM_ID
        AND WJE.JOB_STATUS_CODE   = 'COMPLETED'
        AND IIM.ITEM_CATEGORY_CODE = 'FG'
        AND MTR.CANCEL_FLAG        = 'N'
        AND WJE.SOB_ID            = 90--&P_SOB_ID
        AND WJE.ORG_ID            = 901--&P_ORG_ID
        AND TO_CHAR(WJE.WIP_COMPLETE_EXTEND_DATE, 'YYYY-MM') = TO_CHAR(SYSDATE, 'YYYY-MM')
      GROUP BY TRUNC(WJE.JOB_RELEASE_DATE)
             , TRUNC(WJE.WIP_COMPLETE_EXTEND_DATE)
             , WJE.BOM_ITEM_ID
             , SIR.BOM_ITEM_CODE
             , SIR.BOM_ITEM_DESCRIPTION
             , WJE.JOB_NO
             , WJE.RELEASE_QTY  
             , WJE.SPLIT_OUT_QTY
             , WJE.REPAIR_OUT_QTY
             , WJE.SCRAP_QTY          
             , IIM.INVENTORY_ITEM_ID
) SRX