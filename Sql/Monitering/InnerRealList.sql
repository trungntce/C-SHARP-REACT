-- 공정그룹별 실적
SELECT CODE1
     , CODE1_DESC
     , UOM
     --, CAPA
     , ROUND((CAPA / 24) * ((SYSDATE - (APPS.ZF_GET_EXTEND_DATE(SYSDATE) + (8/24))) * 24), 0) AS CAPA    -- 시점 CAPA (금일 남은 CAPA)
     , ROUND(SUM(ACTUAL_QTY), 0) AS perfomance
     , ROUND(SUM(ACTUAL_QTY) / ((CAPA / 24) * ((SYSDATE - (APPS.ZF_GET_EXTEND_DATE(SYSDATE) + (8/24))) * 24)) * 100, 0) || '%' AS ACTUAL_RATE
  FROM (
          SELECT CODE1
               , CODE1_DESC
               , ATTRIBUTE_A AS UOM
               , ATTRIBUTE_1 AS CAPA
               , 0 AS ACTUAL_QTY
               , SORT
            FROM APPS.SI_GROUP_MASTER
           WHERE GROUP_CODE = 'PROCESS_GROUP_CAPA'
             AND ENABLED_FLAG = 'Y'
             AND TRUNC(APPS.GET_LOCAL_DATE(90)) BETWEEN EFFECTIVE_DATE_FR
                                               AND NVL(EFFECTIVE_DATE_TO, TRUNC(APPS.GET_LOCAL_DATE(90)))

          UNION ALL
          
          SELECT T.CODE1
               , T.CODE1_DESC
               , T.UOM
               , T.CAPA
               , SUM(CASE T.UOM WHEN 'PNL' THEN CEIL(T.UOM_QTY * T.PNL_UOM_FACTOR)
                                WHEN '㎡'  THEN ROUND(T.UOM_QTY * T.MM_UOM_FACTOR, 2)
                                           ELSE T.UOM_QTY END) ACTUAL_QTY
               , T.SORT
            FROM (
                    SELECT SGM.CODE1
                         , NVL(SGM.CODE1_DESC, TO_CHAR(WMT.FROM_OPERATION_ID)) AS CODE1_DESC
                         , WMT.BOM_ITEM_ID
                         , SIR.BOM_ITEM_CODE
                         , SIR.BOM_ITEM_DESCRIPTION
                         , SGM.ATTRIBUTE_A AS UOM
                         , SGM.ATTRIBUTE_1 AS CAPA
                         , SUM(  (CASE WHEN WMT.MOVE_TRX_TYPE = 'RUN_END'        THEN WMT.UOM_QTY        ELSE 0 END)
                               + (CASE WHEN WMT.MOVE_TRX_TYPE = 'CANCEL_RUN_END' THEN WMT.UOM_QTY * (-1) ELSE 0 END)) AS UOM_QTY
                         , SIB.PNL_UOM_FACTOR
                         , SIB.MM_UOM_FACTOR
                         , SGM.SORT
                      FROM APPS.WIP_MOVE_TRANSACTIONS WMT INNER JOIN APPS.SDM_ITEM_REVISION       SIR ON WMT.ORG_ID = SIR.ORG_ID AND WMT.BOM_ITEM_ID = SIR.BOM_ITEM_ID
                                                     INNER JOIN APPS.SDM_STANDARD_RESOURCE   SSR ON WMT.ORG_ID = SSR.ORG_ID AND WMT.FROM_RESOURCE_ID = SSR.RESOURCE_ID
                                                     INNER JOIN APPS.SDM_STANDARD_WORKCENTER SSW ON SSR.ORG_ID = SSW.ORG_ID AND SSR.WORKCENTER_ID = SSW.WORKCENTER_ID
                                                     INNER JOIN APPS.INV_ITEM_MASTER         IIM ON WMT.SOB_ID = IIM.SOB_ID AND WMT.ORG_ID = IIM.ORG_ID AND SIR.INVENTORY_ITEM_ID  = IIM.INVENTORY_ITEM_ID
                                                     INNER JOIN APPS.SI_GROUP_DETAIL         SGD ON WMT.FROM_OPERATION_ID = SGD.DETAIL_CODE_ID
                                                     INNER JOIN APPS.SI_GROUP_MASTER         SGM ON SGD.GROUP_MASTER_ID = SGM.GROUP_MASTER_ID
                                                     INNER JOIN APPS.SDM_INDENTED_BOM_EX_V   SIB ON WMT.BOM_ITEM_ID = SIB.LINK_BOM_ITEM_ID
                     WHERE WMT.SOB_ID        = 90
                       AND WMT.ORG_ID        = 901
                       AND WMT.EXTEND_DATE   = APPS.ZF_GET_EXTEND_DATE(SYSDATE)
                       AND (WMT.MOVE_TRX_TYPE = 'RUN_END' OR WMT.MOVE_TRX_TYPE = 'CANCEL_RUN_END')
                       AND IIM.ITEM_CATEGORY_CODE = 'FG'
                       AND SGM.GROUP_CODE         = 'PROCESS_GROUP_CAPA'
                       AND SGM.ENABLED_FLAG       = 'Y'
                       AND TRUNC(APPS.GET_LOCAL_DATE(90)) BETWEEN SGM.EFFECTIVE_DATE_FR
                                                         AND NVL(SGM.EFFECTIVE_DATE_TO, TRUNC(APPS.GET_LOCAL_DATE(90)))
                       AND OWNER_TYPE_LCODE IN ('INSIDE', 'NEAR_OUTSIDE') -- 사내, 사내외주
                     GROUP BY SGM.CODE1
                            , NVL(SGM.CODE1_DESC, TO_CHAR(WMT.FROM_OPERATION_ID))
                            , WMT.BOM_ITEM_ID
                            , SIR.BOM_ITEM_CODE
                            , SIR.BOM_ITEM_DESCRIPTION
                            , SGM.ATTRIBUTE_A
                            , SGM.ATTRIBUTE_1
                            , SIB.PNL_UOM_FACTOR
                            , SIB.MM_UOM_FACTOR
                            , SGM.SORT
                 ) T
           GROUP BY T.CODE1
                  , T.CODE1_DESC
                  , T.UOM
                  , T.CAPA
                  , T.SORT
       ) TT
 GROUP BY CODE1
        , CODE1_DESC
        , UOM
        , CAPA
        , SORT
 ORDER BY SORT