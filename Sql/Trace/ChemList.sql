SELECT
	T.MEASURE_DATETIME
,	T.TYPE_DESC
,	T.CHEMICAL_NAME
,	T.MEASURE_RANGE
,	T.CUSTOMER_LSL as lsl
,	T.CUSTOMER_USL as usl
,	T.INTERNAL_LSL as lcl
,	T.INTERNAL_USL as ucl
,	T.MEASURE_VALUE
,	T.STATUS_FLAG
  FROM (
          -- 약품
          SELECT MEASURE_DATETIME
               , '약품분석' AS TYPE_DESC
               , SEF.FACTOR_DESCRIPTION + ' - ' + SEF.CHEMICAL_NAME AS CHEMICAL_NAME
--               , SEM.CHEMICAL_NAME
               , SEM.MEASURE_RANGE
               , SEM.TOL_LSL_VALUE AS CUSTOMER_LSL
               , SEM.TOL_USL_VALUE AS CUSTOMER_USL
               , ISNULL(SEF.WARN_MIN_VALUE,0) AS INTERNAL_LSL
               , ISNULL(SEF.WARN_MAX_VALUE,0) AS INTERNAL_USL
               , SEM.MEASURE_VALUE
               , CASE WHEN SEM.MEASURE_VALUE BETWEEN ISNULL(SEF.WARN_MIN_VALUE,0) AND ISNULL(SEF.WARN_MAX_VALUE,0) THEN 'OK'
                      WHEN SEM.MEASURE_VALUE BETWEEN ISNULL(SEF.NORMINAL_VALUE,0) - ISNULL(SEF.TOL_LSL_VALUE,0) 
                      							 AND ISNULL(SEF.NORMINAL_VALUE,0) + ISNULL(SEF.TOL_USL_VALUE,0)
                      							 AND SEM.MEASURE_VALUE NOT BETWEEN ISNULL(SEF.WARN_MIN_VALUE,0) AND ISNULL(SEF.WARN_MAX_VALUE,0) THEN 'CHK'
                      ELSE 'NG'
                      END AS STATUS_FLAG
             FROM dbo.fn_spc_eqp_measure_upv()   SEM
             INNER JOIN dbo.erp_spc_eqp_category             SEC ON SEC.EQP_CATEGORY_ID      = SEM.EQP_CATEGORY_ID
             INNER JOIN dbo.erp_spc_eqp_factor               SEF ON SEF.SPC_FACTOR_ID        = SEM.SPC_FACTOR_ID
             WHERE SEC.SPC_TYPE_FLAG    = 'A'
--               AND SEM.SPC_TYPE = 'NORMAL'
               AND SEM.MEASURE_VALUE  IS NOT NULL
               AND SEM.EQUIPMENT_ID    = @eqp_id
	           AND SEM.ADJ_SEQ 	       = ( SELECT MAX(ADJ_SEQ)
					                         FROM dbo.fn_spc_eqp_measure_upv() 
					    					WHERE EQUIPMENT_ID      = SEM.EQUIPMENT_ID
					    					  AND SPC_FACTOR_ID		= SEM.SPC_FACTOR_ID
					                          AND MEASURE_DATETIME 	= SEM.MEASURE_DATETIME
			   					 		  ) 
			   AND SEM.MEASURE_DATETIME  = ( SELECT MAX(MEASURE_DATETIME)
				                               FROM dbo.fn_spc_eqp_measure_upv()
				                              WHERE EQUIPMENT_ID     = SEM.EQUIPMENT_ID
				                                AND MEASURE_DATETIME <= @start_dt
				                           )
          UNION ALL
          SELECT OPH.CREATION_DATE AS REAL_TIME
             ,   'E/T Rate' AS TYPE_DESC
             ,   SEF.FACTOR_DESCRIPTION + ' - ' + SEF.CHEMICAL_NAME AS MEASURE_ITEM
             ,   SEF.MEASURE_RANGE
             ,   ISNULL(SEF.NORMINAL_VALUE,0) - ISNULL(SEF.TOL_LSL_VALUE,0) AS CUSTOMER_LSL
             ,   ISNULL(SEF.NORMINAL_VALUE,0) + ISNULL(SEF.TOL_USL_VALUE,0) AS CUSTOMER_USL
             ,   ISNULL(SEF.WARN_MIN_VALUE,0) AS INTERNAL_LSL
             ,   ISNULL(SEF.WARN_MAX_VALUE,0) AS INTERNAL_USL
             ,   OPL.MEASURE_VALUE
             ,   CASE WHEN convert(numeric(10,5), OPL.MEASURE_VALUE) BETWEEN convert(numeric(10,4), ISNULL(SEF.WARN_MIN_VALUE,0)) AND convert(numeric(10,4), ISNULL(SEF.WARN_MAX_VALUE,0)) THEN 'OK'
                      WHEN convert(numeric(10,5), OPL.MEASURE_VALUE) BETWEEN convert(numeric(10,4), ISNULL(SEF.NORMINAL_VALUE,0) - ISNULL(SEF.TOL_LSL_VALUE,0)) AND convert(numeric(10, 4), ISNULL(SEF.NORMINAL_VALUE,0) + ISNULL(SEF.TOL_USL_VALUE,0)) THEN 'CHK'
              		  ELSE 'NG' END AS STATUS
            FROM dbo.erp_op_parameter_line  OPL
            INNER JOIN dbo.erp_op_parameter_header         OPH ON OPL.OP_PARAMETER_HEADER_ID = OPH.OP_PARAMETER_HEADER_ID
            INNER JOIN dbo.erp_spc_eqp_factor              SEF ON SEF.SPC_FACTOR_ID          = OPL.SPC_FACTOR_ID        
                                                               AND SEF.EQP_CATEGORY_ID    	 = OPH.EQP_CATEGORY_ID
            INNER JOIN dbo.erp_spc_eqp_category            SEC ON SEF.EQP_CATEGORY_ID        = SEC.EQP_CATEGORY_ID
            WHERE SEF.ENABLED_FLAG     = 'Y'
               AND OPH.SOB_ID          = 90
               AND OPH.ORG_ID          = 901
               AND SEF.CTQ_FLAG        = 'Y'
               AND SEC.SPC_TYPE_FLAG   = 'M'
               AND OPH.EQUIPMENT_ID    = @eqp_id
               AND OPL.MEASURE_VALUE is not null
               AND OPH.CREATION_DATE   = (
                                           SELECT MAX(CREATION_DATE)
                                             FROM erp_op_parameter_header
                                            WHERE EQUIPMENT_ID 	 = OPH.EQUIPMENT_ID
                                              AND CREATION_DATE  <= @start_dt
                                         )
       ) T
ORDER BY MEASURE_DATETIME, TYPE_DESC, CHEMICAL_NAME
;