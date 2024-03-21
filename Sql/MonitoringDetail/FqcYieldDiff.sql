-- 통합 

SELECT ELE.ENTRY_DESCRIPTION
     , SRX.BOM_ITEM_CODE
     , SRX.BOM_ITEM_DESCRIPTION
     , MYR.YIELD_RATE_CONFIRM   -- 투입수율
     , 100 - ROUND((SUM(SRX.MONTH_REAL_REJECT_UOM_QTY) 
           / DECODE(SUM(SRX.MONTH_RELEASE_QTY), 0, NULL, SUM(SRX.MONTH_RELEASE_QTY))) * 100 , 1)               AS MONTH_YIELD_RATE 
     , 100 - ROUND((SUM(SRX.YESTERDAY_REAL_REJECT_UOM_QTY) 
           / DECODE(SUM(SRX.YESTERDAY_RELEASE_QTY), 0, NULL, SUM(SRX.YESTERDAY_RELEASE_QTY))) * 100 , 1)       AS YESTERDAY_YIELD_RATE 
     , 100 - ROUND((SUM(SRX.TODAY_REAL_REJECT_UOM_QTY) 
             / DECODE(SUM(SRX.TODAY_RELEASE_QTY), 0, NULL, SUM(SRX.TODAY_RELEASE_QTY))) * 100 , 1)             AS TODAY_YIELD_RATE
     , 100 - ROUND((SUM(SRX.TODAY_FQC_REAL_REJECT_UOM_QTY) 
           / DECODE(SUM(SRX.TODAY_FQC_RELEASE_QTY), 0, NULL, SUM(SRX.TODAY_FQC_RELEASE_QTY))) * 100 , 1)       AS TODAY_FQC_YIELD_RATE 
     , 100 - ROUND((SUM(SRX.TODAY_BBT_REAL_REJECT_UOM_QTY) 
           / DECODE(SUM(SRX.TODAY_BBT_RELEASE_QTY), 0, NULL, SUM(SRX.TODAY_BBT_RELEASE_QTY))) * 100 , 1)       AS TODAY_BBT_YIELD_RATE 
FROM(
      SELECT SUM_TODAY_SCRAP.BOM_ITEM_ID
           , SUM_TODAY_SCRAP.BOM_ITEM_CODE
           , SUM_TODAY_SCRAP.BOM_ITEM_DESCRIPTION
           , NVL(SUM_TODAY_SCRAP.YESTERDAY_RELEASE_QTY, 0)                        AS YESTERDAY_RELEASE_QTY
           , NVL(SUM_TODAY_SCRAP.YESTERDAY_REAL_REJECT_UOM_QTY, 0)                AS YESTERDAY_REAL_REJECT_UOM_QTY
           , NVL(SUM_TODAY_SCRAP.TODAY_RELEASE_QTY, 0)                            AS TODAY_RELEASE_QTY
           , NVL(SUM_TODAY_SCRAP.TODAY_REAL_REJECT_UOM_QTY, 0)                    AS TODAY_REAL_REJECT_UOM_QTY
           , NVL(MONTH_SCRAP.MONTH_RELEASE_QTY, 0)                                AS MONTH_RELEASE_QTY
           , NVL(MONTH_SCRAP.MONTH_REAL_REJECT_UOM_QTY, 0)                        AS MONTH_REAL_REJECT_UOM_QTY
           , NVL(FQC_SCRAP.TODAY_FQC_RELEASE_QTY, 0)                              AS TODAY_FQC_RELEASE_QTY
           , NVL(FQC_SCRAP.TODAY_FQC_REAL_REJECT_UOM_QTY, 0)                      AS TODAY_FQC_REAL_REJECT_UOM_QTY
           , NVL(BBT_SCRAP.TODAY_BBT_RELEASE_QTY, 0)                              AS TODAY_BBT_RELEASE_QTY
           , NVL(BBT_SCRAP.TODAY_BBT_REAL_REJECT_UOM_QTY, 0)                      AS TODAY_BBT_REAL_REJECT_UOM_QTY
      FROM(
            SELECT TODAY_SCRAP.BOM_ITEM_ID
                 , TODAY_SCRAP.BOM_ITEM_CODE
                 , TODAY_SCRAP.BOM_ITEM_DESCRIPTION
                 , SUM(TODAY_SCRAP.YESTERDAY_RELEASE_QTY)         AS YESTERDAY_RELEASE_QTY
                 , SUM(TODAY_SCRAP.YESTERDAY_REAL_REJECT_UOM_QTY) AS YESTERDAY_REAL_REJECT_UOM_QTY
                 , SUM(TODAY_SCRAP.TODAY_RELEASE_QTY)             AS TODAY_RELEASE_QTY
                 , SUM(TODAY_SCRAP.TODAY_REAL_REJECT_UOM_QTY)     AS TODAY_REAL_REJECT_UOM_QTY
                 
             FROM(
                    -- 전일수율
                    SELECT SRX.BOM_ITEM_ID
                         , SRX.BOM_ITEM_CODE
                         , SRX.BOM_ITEM_DESCRIPTION
                         , SUM(SRX.RELEASE_QTY)         AS YESTERDAY_RELEASE_QTY
                         , SUM(SRX.REAL_REJECT_UOM_QTY) AS YESTERDAY_REAL_REJECT_UOM_QTY
                         , NULL AS TODAY_RELEASE_QTY
                         , NULL AS TODAY_REAL_REJECT_UOM_QTY
                    FROM(
                          -- 전일수율
                          SELECT TRUNC(WJE.JOB_RELEASE_DATE)
                               , TRUNC(WJE.WIP_COMPLETE_EXTEND_DATE)
                               , IIM.INVENTORY_ITEM_ID
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
                                        
                            AND TRUNC(WJE.WIP_COMPLETE_EXTEND_DATE) = TRUNC(SYSDATE-1)
                          GROUP BY TRUNC(WJE.JOB_RELEASE_DATE)
                                 , TRUNC(WJE.WIP_COMPLETE_EXTEND_DATE)
                                 , IIM.INVENTORY_ITEM_ID
                                 , WJE.BOM_ITEM_ID
                                 , SIR.BOM_ITEM_CODE
                                 , SIR.BOM_ITEM_DESCRIPTION
                                 , WJE.JOB_NO
                                 , WJE.RELEASE_QTY  
                                 , WJE.SPLIT_OUT_QTY
                                 , WJE.REPAIR_OUT_QTY
                                 , WJE.SCRAP_QTY          
                                       
                                         
                    ) SRX
                    GROUP BY SRX.BOM_ITEM_ID
                         , SRX.BOM_ITEM_CODE
                         , SRX.BOM_ITEM_DESCRIPTION
                        

                    UNION ALL
                    -- 금일수율
                    SELECT SRX.BOM_ITEM_ID
                         , SRX.BOM_ITEM_CODE
                         , SRX.BOM_ITEM_DESCRIPTION
                         , NULL AS YESTERDAY_RELEASE_QTY
                         , NULL AS YESTERDAY_REAL_REJECT_UOM_QTY
                         , SUM(SRX.RELEASE_QTY)           AS TODAY_RELEASE_QTY
                         , SUM(SRX.REAL_REJECT_UOM_QTY)   AS TODAY_REAL_REJECT_UOM_QTY
                    FROM(
                          -- 금일수율
                          SELECT TRUNC(WJE.JOB_RELEASE_DATE)
                               , TRUNC(WJE.WIP_COMPLETE_EXTEND_DATE)
                               , IIM.INVENTORY_ITEM_ID
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
                                        
                            AND TRUNC(WJE.WIP_COMPLETE_EXTEND_DATE) = TRUNC(SYSDATE)
                            
                          GROUP BY TRUNC(WJE.JOB_RELEASE_DATE)
                                 , TRUNC(WJE.WIP_COMPLETE_EXTEND_DATE)
                                 , IIM.INVENTORY_ITEM_ID
                                 , WJE.BOM_ITEM_ID
                                 , SIR.BOM_ITEM_CODE
                                 , SIR.BOM_ITEM_DESCRIPTION
                                 , WJE.JOB_NO
                                 , WJE.RELEASE_QTY  
                                 , WJE.SPLIT_OUT_QTY
                                 , WJE.REPAIR_OUT_QTY
                                 , WJE.SCRAP_QTY          
                                       
                                         
                    ) SRX
                    GROUP BY SRX.BOM_ITEM_ID
                         , SRX.BOM_ITEM_CODE
                         , SRX.BOM_ITEM_DESCRIPTION
                         
             ) TODAY_SCRAP 
             --WHERE TODAY_SCRAP.BOM_ITEM_CODE = 'B0203701619-MDB-02'
             GROUP BY TODAY_SCRAP.BOM_ITEM_ID
                 , TODAY_SCRAP.BOM_ITEM_CODE
                 , TODAY_SCRAP.BOM_ITEM_DESCRIPTION
      ) SUM_TODAY_SCRAP
      , (
          -- 월간수율 
          SELECT SRX.BOM_ITEM_ID
               , SRX.BOM_ITEM_CODE
               , SRX.BOM_ITEM_DESCRIPTION
               , SUM(SRX.RELEASE_QTY)         AS MONTH_RELEASE_QTY
               , SUM(SRX.REAL_REJECT_UOM_QTY) AS MONTH_REAL_REJECT_UOM_QTY
          FROM(
                -- 월간수율
                SELECT TRUNC(WJE.JOB_RELEASE_DATE)
                     , TRUNC(WJE.WIP_COMPLETE_EXTEND_DATE)
                     , IIM.INVENTORY_ITEM_ID
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
                       , IIM.INVENTORY_ITEM_ID
                       , WJE.BOM_ITEM_ID
                       , SIR.BOM_ITEM_CODE
                       , SIR.BOM_ITEM_DESCRIPTION
                       , WJE.JOB_NO
                       , WJE.RELEASE_QTY  
                       , WJE.SPLIT_OUT_QTY
                       , WJE.REPAIR_OUT_QTY
                       , WJE.SCRAP_QTY          
                             
                               
          ) SRX
          GROUP BY SRX.BOM_ITEM_ID
               , SRX.BOM_ITEM_CODE
               , SRX.BOM_ITEM_DESCRIPTION
               
       ) MONTH_SCRAP
       , (-- FQC 금일수율
            SELECT SRX.BOM_ITEM_ID
                 , SRX.BOM_ITEM_CODE
                 , SRX.BOM_ITEM_DESCRIPTION
                 , SUM(SRX.RELEASE_QTY)           AS TODAY_FQC_RELEASE_QTY
                 , SUM(SRX.REAL_REJECT_UOM_QTY)   AS TODAY_FQC_REAL_REJECT_UOM_QTY
            FROM(
                  -- 금일수율
                  SELECT TRUNC(WJE.JOB_RELEASE_DATE)
                       , TRUNC(WJE.WIP_COMPLETE_EXTEND_DATE)
                       , IIM.INVENTORY_ITEM_ID
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
                                        
                    AND TRUNC(WJE.WIP_COMPLETE_EXTEND_DATE) = TRUNC(SYSDATE)
                    AND QRT.REJECT_TYPE_CODE    NOT IN ('DES-004', 'DES-005', 'DES-007') -- OPEN/SHORT/저저항 
                  GROUP BY TRUNC(WJE.JOB_RELEASE_DATE)
                         , TRUNC(WJE.WIP_COMPLETE_EXTEND_DATE)
                         , IIM.INVENTORY_ITEM_ID
                         , WJE.BOM_ITEM_ID
                         , SIR.BOM_ITEM_CODE
                         , SIR.BOM_ITEM_DESCRIPTION
                         , WJE.JOB_NO
                         , WJE.RELEASE_QTY  
                         , WJE.SPLIT_OUT_QTY
                         , WJE.REPAIR_OUT_QTY
                         , WJE.SCRAP_QTY          
                                       
                                         
            ) SRX
            GROUP BY SRX.BOM_ITEM_ID
                 , SRX.BOM_ITEM_CODE
                 , SRX.BOM_ITEM_DESCRIPTION
                         
       ) FQC_SCRAP
       , (-- BBT 금일수율
            SELECT SRX.BOM_ITEM_ID
                 , SRX.BOM_ITEM_CODE
                 , SRX.BOM_ITEM_DESCRIPTION
                 , SUM(SRX.RELEASE_QTY)           AS TODAY_BBT_RELEASE_QTY
                 , SUM(SRX.REAL_REJECT_UOM_QTY)   AS TODAY_BBT_REAL_REJECT_UOM_QTY
            FROM(
                  -- 금일수율
                  SELECT TRUNC(WJE.JOB_RELEASE_DATE)
                       , TRUNC(WJE.WIP_COMPLETE_EXTEND_DATE)
                       , IIM.INVENTORY_ITEM_ID
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
                    AND QRT.REJECT_TYPE_CODE    IN ('DES-004', 'DES-005', 'DES-007') -- OPEN/SHORT/저저항 
                                 

                    AND TRUNC(WJE.WIP_COMPLETE_EXTEND_DATE) = TRUNC(SYSDATE)
                  GROUP BY TRUNC(WJE.JOB_RELEASE_DATE)
                         , TRUNC(WJE.WIP_COMPLETE_EXTEND_DATE)
                         , IIM.INVENTORY_ITEM_ID
                         , WJE.BOM_ITEM_ID
                         , SIR.BOM_ITEM_CODE
                         , SIR.BOM_ITEM_DESCRIPTION
                         , WJE.JOB_NO
                         , WJE.RELEASE_QTY  
                         , WJE.SPLIT_OUT_QTY
                         , WJE.REPAIR_OUT_QTY
                         , WJE.SCRAP_QTY          
                                       
                                         
            ) SRX
            GROUP BY SRX.BOM_ITEM_ID
                 , SRX.BOM_ITEM_CODE
                 , SRX.BOM_ITEM_DESCRIPTION
                         
       ) BBT_SCRAP
      WHERE SUM_TODAY_SCRAP.BOM_ITEM_ID = MONTH_SCRAP.BOM_ITEM_ID(+)
        AND SUM_TODAY_SCRAP.BOM_ITEM_ID = FQC_SCRAP.BOM_ITEM_ID(+)
        AND SUM_TODAY_SCRAP.BOM_ITEM_ID = BBT_SCRAP.BOM_ITEM_ID(+)
) SRX
, APPS.MPS_MODEL_YIELD_RATE MYR
, APPS.SDM_ITEM_SPEC        SIS
, APPS.EAPP_LOOKUP_ENTRY    ELE

WHERE SRX.BOM_ITEM_ID                   = MYR.BOM_ITEM_ID(+)
  AND SRX.BOM_ITEM_ID                   = SIS.BOM_ITEM_ID(+)
  AND SIS.ITEM_DIFFICULT_LCODE          = ELE.ENTRY_CODE(+)
  AND ELE.LOOKUP_TYPE(+)                = 'SDM_ITEM_DIFFICULT'
  
GROUP BY ELE.ENTRY_DESCRIPTION
       , ELE.SORT_NO
       , SRX.BOM_ITEM_CODE
       , SRX.BOM_ITEM_DESCRIPTION
       , MYR.YIELD_RATE_CONFIRM   -- 투입수율
     
ORDER BY CASE WHEN TODAY_YIELD_RATE IS NOT NULL THEN 1 ELSE 2 END
       , ELE.SORT_NO
       , TODAY_YIELD_RATE