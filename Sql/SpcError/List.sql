SELECT 
	  INSPECTION_TIME
     , INSPECTION_DATE
     , OPERATION_DESCRIPTION
     , tran_oper_name
     , BOM_ITEM_CODE
     , BOM_ITEM_DESCRIPTION
     , JOB_NO
     , AFFECT_PNL
     , NG_DESCRIPTION
     , INNER_STANDARD_MIN
     , INNER_STANDARD_MAX
     , (CASE WHEN VALUE_LEAST    < INNER_STANDARD_MIN THEN VALUE_LEAST
             WHEN VALUE_GREATEST > INNER_STANDARD_MAX THEN VALUE_GREATEST
                                                      ELSE 0 END) AS VALUE_NG
 FROM (
          SELECT IOH.INSPECTION_DATE
               ,  CONVERT(varchar(5), IOH.INSPECTION_DATE, 108) AS INSPECTION_TIME
               , SSO.OPERATION_DESCRIPTION
               , concat_ws('::', SSO.OPERATION_DESCRIPTION, oper_tl.OPERATION_DESCRIPTION, '') as tran_oper_name
               , SIR.BOM_ITEM_CODE
               , SIR.BOM_ITEM_DESCRIPTION
               , IOH.JOB_NO
               , '' AS AFFECT_PNL
               , LE.ENTRY_DESCRIPTION +
                 CASE WHEN LE2.ENTRY_DESCRIPTION IS NOT NULL THEN LE2.ENTRY_DESCRIPTION ELSE '' END +
                 CASE WHEN LE3.ENTRY_DESCRIPTION IS NOT NULL THEN LE3.ENTRY_DESCRIPTION ELSE '' END     AS NG_DESCRIPTION
               , IOC.INNER_STANDARD_MIN
               , IOC.INNER_STANDARD_MAX
                , IOC.STATUS
                , (select min(k) as least_value from (values (isnull(IOC.N_VALUE1,999999999)), (isnull(IOC.N_VALUE2,999999999)), (isnull(IOC.N_VALUE3,999999999)), (isnull(IOC.N_VALUE4,999999999)), (isnull(IOC.N_VALUE5,999999999)), (isnull(IOC.N_VALUE6,999999999)), (isnull(IOC.N_VALUE7,999999999)), (isnull(IOC.N_VALUE8,999999999)), (isnull(IOC.N_VALUE9,999999999)), (isnull(IOC.N_VALUE10,999999999)), (isnull(IOC.N_VALUE11,999999999)), (isnull(IOC.N_VALUE12,999999999)), (isnull(IOC.N_VALUE13,999999999)), (isnull(IOC.N_VALUE14,999999999)), (isnull(IOC.N_VALUE15,999999999)), (isnull(IOC.N_VALUE16,999999999)), (isnull(IOC.N_VALUE17,999999999)), (isnull(IOC.N_VALUE18,999999999)), (isnull(IOC.N_VALUE19,999999999)), (isnull(IOC.N_VALUE20,999999999))) as v (k)) AS VALUE_LEAST
                , (select max(k) as least_value from (values (isnull(IOC.N_VALUE1,-999999999)), (isnull(IOC.N_VALUE2,-999999999)), (isnull(IOC.N_VALUE3,-999999999)), (isnull(IOC.N_VALUE4,-999999999)), (isnull(IOC.N_VALUE5,-999999999)), (isnull(IOC.N_VALUE6,-999999999)), (isnull(IOC.N_VALUE7,-999999999)), (isnull(IOC.N_VALUE8,-999999999)), (isnull(IOC.N_VALUE9,-999999999)), (isnull(IOC.N_VALUE10,-999999999)), (isnull(IOC.N_VALUE11,-999999999)), (isnull(IOC.N_VALUE12,-999999999)), (isnull(IOC.N_VALUE13,-999999999)), (isnull(IOC.N_VALUE14,-999999999)), (isnull(IOC.N_VALUE15,-999999999)), (isnull(IOC.N_VALUE16,-999999999)), (isnull(IOC.N_VALUE17,-999999999)), (isnull(IOC.N_VALUE18,-999999999)), (isnull(IOC.N_VALUE19,-999999999)), (isnull(IOC.N_VALUE20,-999999999))) as v (k)) AS VALUE_GREATEST
            FROM dbo.erp_qm_inspection_op_header IOH 
            	INNER      JOIN dbo.erp_qm_inspection_op_cs    IOC ON IOH.INSPECTION_OP_HEADER_ID = IOC.INSPECTION_OP_HEADER_ID
                INNER      JOIN dbo.erp_sdm_standard_operation SSO ON IOH.OPERATION_ID = SSO.OPERATION_ID
                INNER      JOIN dbo.erp_sdm_item_revision      SIR ON IOH.BOM_ITEM_ID = SIR.BOM_ITEM_ID
                LEFT OUTER JOIN dbo.erp_eapp_lookup_entry      LE  ON IOC.CHECK_TYPE_ID           = LE.LOOKUP_ENTRY_ID
                LEFT OUTER JOIN dbo.erp_eapp_lookup_entry      LE2 ON IOC.CHECK_POSITION_ID       = LE2.LOOKUP_ENTRY_ID
                LEFT OUTER JOIN dbo.erp_eapp_lookup_entry      LE3 ON IOC.CHECK_NUMBER_ID         = LE3.LOOKUP_ENTRY_ID
                JOIN	        dbo.erp_sdm_standard_operation_tl oper_tl on SSO.OPERATION_ID = oper_tl.OPERATION_ID
           WHERE IOH.SOB_ID = 90
             AND IOH.ORG_ID = 901
             AND IOH.IPQC_FLAG = 'A'
             AND IOH.EXTEND_DATE >= @from_dt and IOH.EXTEND_DATE < @to_dt
             AND IOH.JOB_NO like '%' + @workorder + '%'
             AND SIR.BOM_ITEM_CODE = @model_code
             AND IOC.STATUS = 'NG'
             AND IOC.N_VALUE1 IS NOT NULL
      ) T
 ORDER BY T.INSPECTION_DATE DESC