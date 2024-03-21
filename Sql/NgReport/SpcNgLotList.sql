-- SPC
SELECT INSPECTION_TIME as insp_dt
     , CTQ_FLAG
     , TYPE_DESC
     , OPERATION_DESCRIPTION as oper_description
     , BOM_ITEM_CODE
     , BOM_ITEM_DESCRIPTION as model_description
     , JOB_NO   as workorder
     , AFFECT_PNL   as panel_id
     , NG_DESCRIPTION  
     , CUSTOMER_STANDARD_MIN AS cust_min
     , CUSTOMER_STANDARD_MAX AS cust_max
     , INNER_STANDARD_MIN   as inner_min
     , INNER_STANDARD_MAX  as inner_max
     , (CASE WHEN INNER_STANDARD_MIN - VALUE_LEAST > VALUE_GREATEST - INNER_STANDARD_MAX THEN VALUE_LEAST
                                                                                         ELSE VALUE_GREATEST END) AS insp_val
     , eqp_name
 FROM (
          SELECT IOH.INSPECTION_DATE
               , CONVERT(VARCHAR(10), IOH.INSPECTION_DATE, 11) + ' ' + CONVERT(VARCHAR(5), IOH.INSPECTION_DATE, 108) AS INSPECTION_TIME
               , 'IPQC' AS TYPE_DESC
               , SSO.OPERATION_DESCRIPTION
               , SIR.BOM_ITEM_CODE
               , SIR.BOM_ITEM_DESCRIPTION
               , IOH.JOB_NO
               , '' AS AFFECT_PNL
               , LE.ENTRY_DESCRIPTION +
                 CASE WHEN LE2.ENTRY_DESCRIPTION IS NOT NULL THEN ' - ' + LE2.ENTRY_DESCRIPTION ELSE '' END +
                 CASE WHEN LE3.ENTRY_DESCRIPTION IS NOT NULL THEN ' - ' + LE3.ENTRY_DESCRIPTION ELSE '' END     AS NG_DESCRIPTION
               , IOC.CUSTOMER_STANDARD_MIN
               , IOC.CUSTOMER_STANDARD_MAX
               , IOC.INNER_STANDARD_MIN
               , IOC.INNER_STANDARD_MAX
               --, IOC.STATUS_CUSTOMER -- [고객기준 상태] ADD, 2022-06-13, BY JHHAN
               , (select min(k) as least_value from (values (isnull(IOC.N_VALUE1,999999999)), (isnull(IOC.N_VALUE2,999999999)), (isnull(IOC.N_VALUE3,999999999)), (isnull(IOC.N_VALUE4,999999999)), (isnull(IOC.N_VALUE5,999999999)), (isnull(IOC.N_VALUE6,999999999)), (isnull(IOC.N_VALUE7,999999999)), (isnull(IOC.N_VALUE8,999999999)), (isnull(IOC.N_VALUE9,999999999)), (isnull(IOC.N_VALUE10,999999999)), (isnull(IOC.N_VALUE11,999999999)), (isnull(IOC.N_VALUE12,999999999)), (isnull(IOC.N_VALUE13,999999999)), (isnull(IOC.N_VALUE14,999999999)), (isnull(IOC.N_VALUE15,999999999)), (isnull(IOC.N_VALUE16,999999999)), (isnull(IOC.N_VALUE17,999999999)), (isnull(IOC.N_VALUE18,999999999)), (isnull(IOC.N_VALUE19,999999999)), (isnull(IOC.N_VALUE20,999999999))) as v (k)) AS VALUE_LEAST
                , (select max(k) as least_value from (values (isnull(IOC.N_VALUE1,-999999999)), (isnull(IOC.N_VALUE2,-999999999)), (isnull(IOC.N_VALUE3,-999999999)), (isnull(IOC.N_VALUE4,-999999999)), (isnull(IOC.N_VALUE5,-999999999)), (isnull(IOC.N_VALUE6,-999999999)), (isnull(IOC.N_VALUE7,-999999999)), (isnull(IOC.N_VALUE8,-999999999)), (isnull(IOC.N_VALUE9,-999999999)), (isnull(IOC.N_VALUE10,-999999999)), (isnull(IOC.N_VALUE11,-999999999)), (isnull(IOC.N_VALUE12,-999999999)), (isnull(IOC.N_VALUE13,-999999999)), (isnull(IOC.N_VALUE14,-999999999)), (isnull(IOC.N_VALUE15,-999999999)), (isnull(IOC.N_VALUE16,-999999999)), (isnull(IOC.N_VALUE17,-999999999)), (isnull(IOC.N_VALUE18,-999999999)), (isnull(IOC.N_VALUE19,-999999999)), (isnull(IOC.N_VALUE20,-999999999))) as v (k)) AS VALUE_GREATEST
               , CASE WHEN isnull(LE.SEGMENT1,'N') = 'Y' THEN 'Y' ELSE '' END AS CTQ_FLAG
               , sse.EQUIPMENT_DESCRIPTION as eqp_name
            FROM dbo.erp_qm_inspection_op_header IOH 
                 INNER      JOIN dbo.erp_qm_inspection_op_cs    IOC ON IOH.INSPECTION_OP_HEADER_ID = IOC.INSPECTION_OP_HEADER_ID
                INNER      JOIN dbo.erp_sdm_standard_operation SSO ON IOH.OPERATION_ID = SSO.OPERATION_ID
                INNER      JOIN dbo.erp_sdm_item_revision      SIR ON IOH.BOM_ITEM_ID = SIR.BOM_ITEM_ID
                LEFT OUTER JOIN dbo.erp_eapp_lookup_entry      LE  ON IOC.CHECK_TYPE_ID           = LE.LOOKUP_ENTRY_ID
                LEFT OUTER JOIN dbo.erp_eapp_lookup_entry      LE2 ON IOC.CHECK_POSITION_ID       = LE2.LOOKUP_ENTRY_ID
                LEFT OUTER JOIN dbo.erp_eapp_lookup_entry      LE3 ON IOC.CHECK_NUMBER_ID         = LE3.LOOKUP_ENTRY_ID
                LEFT JOIN dbo.erp_sdm_standard_equipment sse on sse.EQUIPMENT_ID in (IOH.EQUIPMENT_ID_3, IOH.EQUIPMENT_ID_2, IOH.EQUIPMENT_ID_1)
           WHERE IOH.SOB_ID = 90
             AND IOH.ORG_ID = 901
             AND IOH.IPQC_FLAG = 'A'
             AND IOH.EXTEND_DATE >= @from_dt and IOH.EXTEND_DATE < @to_dt
             --AND IOH.EXTEND_DATE BETWEEN @from_dt and @to_dt
          AND IOH.JOB_NO = @workorder
          AND SIR.BOM_ITEM_CODE = @model_code
             AND IOC.STATUS = 'NG'
             AND IOC.N_VALUE1 IS NOT NULL
        UNION ALL      
             -- 신뢰성 (신뢰성 등록 데이터 중 공정타입코드 V06)
          SELECT MRH.INSPECTION_DATE
               , CONVERT(VARCHAR(10), MRH.CREATION_DATE, 11) + ' ' + CONVERT(VARCHAR(5), MRH.CREATION_DATE, 108) AS INSPECTION_TIME
               , '신뢰성' AS TYPE_DESC
               , SSO.OPERATION_DESCRIPTION
               , SIR.BOM_ITEM_CODE
               , SIR.BOM_ITEM_DESCRIPTION
               , MRH.JOB_NO
               , '' AS AFFECT_PNL
               , QC.CODE_NAME+'-' + QC2.CODE_NAME    AS NG_DESCRIPTION
               , isnull(MRH.SPEC,0) - isnull(MRH.SPEC_MINUS_TOL,999999999) AS CUSTOMER_STANDARD_MIN
               , isnull(MRH.SPEC,0) + isnull(MRH.SPEC_PLUS_TOL,999999999) AS CUSTOMER_STANDARD_MAX
               , isnull(MRH.SPEC,0) - isnull(MRH.SPEC_MINUS_TOL,999999999) AS INNER_STANDARD_MIN
               , isnull(MRH.SPEC,0) + isnull(MRH.SPEC_PLUS_TOL,999999999) AS INNER_STANDARD_MAX
               , MIN(MRL.COLUMN_VALUE) AS VALUE_LEAST
               , MAX(MRL.COLUMN_VALUE) AS VALUE_GREATEST
               , '' AS  CTQ_FLAG
               , max(sse.EQUIPMENT_DESCRIPTION) as eqp_name
            FROM dbo.erp_z_mes_reliability_header MRH 
               INNER      JOIN dbo.erp_z_mes_reliability_line    MRL ON MRH.RELIABILITY_HEADER_ID  = MRL.RELIABILITY_HEADER_ID 
                INNER      JOIN dbo.erp_sdm_standard_operation    SSO ON MRH.OPERATION_ID          = SSO.OPERATION_ID
                INNER      JOIN dbo.erp_sdm_item_revision       SIR ON MRH.BOM_ITEM_ID          = SIR.BOM_ITEM_ID
                INNER      JOIN dbo.erp_z_mes_reliability_item    MRI ON MRI.RELIABILITY_ITEM_ID    = MRH.RELIABILITY_ITEM_ID 
                LEFT OUTER JOIN dbo.erp_qm_common              QC  ON MRI.MES_Y_FACTOR_ID        = QC.COMMON_ID 
                LEFT OUTER JOIN dbo.erp_qm_common              QC2 ON MRI.MES_Y_FACTOR_DTL_ID    = QC2.COMMON_ID 
                LEFT JOIN dbo.tb_panel_4m  [4m] on [4m].workorder = MRH.JOB_NO and [4m].oper_seq_no = MRH.OPERATION_SEQ_NO
                LEFT JOIN dbo.erp_sdm_standard_equipment sse on sse.EQUIPMENT_CODE = [4m].eqp_code
           WHERE SSO.SOB_ID = 90 AND SSO.ORG_ID =901
             AND SSO.OPERATION_TYPE_ID = 199 -- 공정 타입 [유산동/V06], 신뢰성 검사 공정
             AND MRH.INSPECTION_DATE >= @from_dt and MRH.INSPECTION_DATE < @to_dt
             --AND MRH.INSPECTION_DATE BETWEEN @from_dt and @to_dt
          AND MRH.JOB_NO = @workorder  
          AND SIR.BOM_ITEM_CODE = @model_code
             AND MRL.COLUMN_VALUE IS NOT NULL
           GROUP BY MRH.INSPECTION_DATE
             , CONVERT(VARCHAR(10), MRH.CREATION_DATE, 11) + ' ' + CONVERT(VARCHAR(5), MRH.CREATION_DATE, 108)
               , SSO.OPERATION_DESCRIPTION
               , SIR.BOM_ITEM_CODE
               , SIR.BOM_ITEM_DESCRIPTION
               , MRH.JOB_NO
               , QC.CODE_NAME
               , QC2.CODE_NAME
               , isnull(MRH.SPEC,0) - isnull(MRH.SPEC_MINUS_TOL,999999999)
               , isnull(MRH.SPEC,0) + isnull(MRH.SPEC_PLUS_TOL,999999999)
          HAVING 
        (
         MIN(MRL.COLUMN_VALUE) < isnull(MRH.SPEC,0) - isnull(MRH.SPEC_MINUS_TOL,999999999) 
            OR 
         MAX(MRL.COLUMN_VALUE) > isnull(MRH.SPEC,0) + isnull(MRH.SPEC_PLUS_TOL,999999999)
        ) -- 검사 데이터 기준 결과 NG체크
        UNION ALL      
             -- 출하검사 (신뢰성 등록 데이터 중 공정타입코드 S03 )
          SELECT MRH.INSPECTION_DATE
               , CONVERT(VARCHAR(10), MRH.CREATION_DATE, 11) + ' ' + CONVERT(VARCHAR(5), MRH.CREATION_DATE, 108) AS INSPECTION_TIME
               , 'OQC' AS TYPE_DESC
               , SSO.OPERATION_DESCRIPTION
               , SIR.BOM_ITEM_CODE
               , SIR.BOM_ITEM_DESCRIPTION
               , MRH.JOB_NO
               , '' AS AFFECT_PNL
               , QC.CODE_NAME+'-' + QC2.CODE_NAME    AS NG_DESCRIPTION
               , isnull(MRH.SPEC,0) - isnull(MRH.SPEC_MINUS_TOL,999999999) AS CUSTOMER_STANDARD_MIN
               , isnull(MRH.SPEC,0) + isnull(MRH.SPEC_PLUS_TOL,999999999) AS CUSTOMER_STANDARD_MAX
               , isnull(MRH.SPEC,0) - isnull(MRH.SPEC_MINUS_TOL,999999999) AS INNER_STANDARD_MIN
               , isnull(MRH.SPEC,0) + isnull(MRH.SPEC_PLUS_TOL,999999999) AS INNER_STANDARD_MAX
               , MIN(MRL.COLUMN_VALUE) AS VALUE_LEAST
               , MAX(MRL.COLUMN_VALUE) AS VALUE_GREATEST
               , '' AS  CTQ_FLAG
               , max(sse.EQUIPMENT_DESCRIPTION) as eqp_name
            FROM dbo.erp_z_mes_reliability_header MRH 
               INNER      JOIN dbo.erp_z_mes_reliability_line    MRL ON MRH.RELIABILITY_HEADER_ID  = MRL.RELIABILITY_HEADER_ID 
                INNER      JOIN dbo.erp_sdm_standard_operation    SSO ON MRH.OPERATION_ID          = SSO.OPERATION_ID
                INNER      JOIN dbo.erp_sdm_item_revision       SIR ON MRH.BOM_ITEM_ID          = SIR.BOM_ITEM_ID
                INNER      JOIN dbo.erp_z_mes_reliability_item    MRI ON MRI.RELIABILITY_ITEM_ID    = MRH.RELIABILITY_ITEM_ID 
                LEFT OUTER JOIN dbo.erp_qm_common              QC  ON MRI.MES_Y_FACTOR_ID        = QC.COMMON_ID 
                LEFT OUTER JOIN dbo.erp_qm_common              QC2 ON MRI.MES_Y_FACTOR_DTL_ID    = QC2.COMMON_ID 
                LEFT JOIN dbo.tb_panel_4m  [4m] on [4m].workorder = MRH.JOB_NO and [4m].oper_seq_no = MRH.OPERATION_SEQ_NO
                LEFT JOIN dbo.erp_sdm_standard_equipment sse on sse.EQUIPMENT_CODE = [4m].eqp_code
           WHERE SSO.SOB_ID = 90 AND SSO.ORG_ID =901
             AND SSO.OPERATION_TYPE_ID = 191 -- 공정 타입 [베트남선적/S03], 출하 검사 공정
             AND MRH.INSPECTION_DATE BETWEEN @from_dt and @to_dt
          AND MRH.JOB_NO = @workorder           
          AND SIR.BOM_ITEM_CODE = @model_code
             AND MRL.COLUMN_VALUE IS NOT NULL
           GROUP BY MRH.INSPECTION_DATE
                 , CONVERT(VARCHAR(10), MRH.CREATION_DATE, 11) + ' ' + CONVERT(VARCHAR(5), MRH.CREATION_DATE, 108)
               , SSO.OPERATION_DESCRIPTION
               , SIR.BOM_ITEM_CODE
               , SIR.BOM_ITEM_DESCRIPTION
               , MRH.JOB_NO
               , QC.CODE_NAME
               , QC2.CODE_NAME
               , isnull(MRH.SPEC,0) - isnull(MRH.SPEC_MINUS_TOL,999999999)
               , isnull(MRH.SPEC,0) + isnull(MRH.SPEC_PLUS_TOL,999999999)
          HAVING 
        (
         MIN(MRL.COLUMN_VALUE) < isnull(MRH.SPEC,0) - isnull(MRH.SPEC_MINUS_TOL,999999999) 
            OR 
         MAX(MRL.COLUMN_VALUE) > isnull(MRH.SPEC,0) + isnull(MRH.SPEC_PLUS_TOL,999999999)
        ) -- 검사 데이터 기준 결과 NG체크
         UNION ALL      
             -- 외주 수입검사 (IQC 치수 데이터)
          SELECT QIJ.INSPECT_DATE
                , CONVERT(VARCHAR(10), QIJ.INSPECT_DATE, 11) + ' ' + CONVERT(VARCHAR(5), QIJ.INSPECT_DATE, 108) AS INSPECTION_TIME
               , 'IQC' AS TYPE_DESC
               , SSO.OPERATION_DESCRIPTION
               , SIR.BOM_ITEM_CODE
               , SIR.BOM_ITEM_DESCRIPTION
               , QIJ.JOB_NO
               , '' AS AFFECT_PNL
               , '치수'    AS NG_DESCRIPTION
               , isnull(QIS.SPEC,0) - isnull(QIS.SPEC_MINUS ,999999999) AS CUSTOMER_STANDARD_MIN
               , isnull(QIS.SPEC,0) + isnull(QIS.SPEC_PLUS,999999999) AS CUSTOMER_STANDARD_MAX
               , isnull(QIS.SPEC,0) - isnull(QIS.SPEC_MINUS ,999999999) AS INNER_STANDARD_MIN
               , isnull(QIS.SPEC,0) + isnull(QIS.SPEC_PLUS,999999999) AS INNER_STANDARD_MAX
               ,(
               select min([least]) AS VALUE_LEAST from 
               (
                  select isnull(QIM.DATA_01,999999999) as [least] from dbo.erp_qm_out_iqc_measure QIM union all
                  select isnull(QIM.DATA_02,999999999) from dbo.erp_qm_out_iqc_measure QIM union all
                  select isnull(QIM.DATA_03,999999999) from dbo.erp_qm_out_iqc_measure QIM union all
                  select isnull(QIM.DATA_04,999999999) from dbo.erp_qm_out_iqc_measure QIM union all
                  select isnull(QIM.DATA_05,999999999) from dbo.erp_qm_out_iqc_measure QIM
               ) a
            ) 
            ,(
               select max([greatest]) AS VALUE_GREATEST from 
               (
                  select isnull(QIM.DATA_01,-999999999) as [greatest] from dbo.erp_qm_out_iqc_measure QIM union all
                  select isnull(QIM.DATA_02,-999999999) from dbo.erp_qm_out_iqc_measure QIM union all
                  select isnull(QIM.DATA_03,-999999999) from dbo.erp_qm_out_iqc_measure QIM union all
                  select isnull(QIM.DATA_04,-999999999) from dbo.erp_qm_out_iqc_measure QIM union all
                  select isnull(QIM.DATA_05,-999999999) from dbo.erp_qm_out_iqc_measure QIM
               ) a
            )  
               , '' AS  CTQ_FLAG
               , '' as eqp_name
            FROM dbo.erp_qm_out_iqc_measure QIM 
               INNER      JOIN dbo.erp_qm_out_iqc_spec            QIS ON QIM.QM_OUT_IQC_SPEC_ID      = QIS.QM_OUT_IQC_SPEC_ID
               INNER      JOIN dbo.erp_qm_out_inspect_job         QIJ ON QIJ.OUT_INSPECT_ID         = QIM.OUT_INSPECT_ID                                  
               INNER      JOIN   dbo.erp_wip_out_receipt_operation    RO  ON RO.RECEIPT_OP_ID           = QIJ.OUT_RECEIPT_ID
               INNER      JOIN dbo.erp_sdm_standard_operation       SSO ON RO.OPERATION_ID            = SSO.OPERATION_ID
               INNER      JOIN dbo.erp_sdm_item_revision         SIR ON QIJ.BOM_ITEM_ID            = SIR.BOM_ITEM_ID
           WHERE
                QIJ.INSPECT_DATE >= @from_dt and QIJ.INSPECT_DATE < @to_dt
                --QIJ.INSPECT_DATE BETWEEN @from_dt and @to_dt
         AND QIJ.JOB_NO = @workorder
         AND SIR.BOM_ITEM_CODE = @model_code
            AND QIM.DATA_01 IS NOT NULL
            AND QIM.PASS_FLAG_AT_INSPECTION = 'NG'
        UNION ALL
        -- CMI 두께측정
        SELECT DTSTARTTIME
               , CONVERT(VARCHAR(10), DTSTARTTIME, 11) + ' ' + CONVERT(VARCHAR(5), DTSTARTTIME, 108) AS DTSTARTTIME
               , 'CMI두께' AS TYPE_DESC
               , SPROCESS
               , SMODELCODE
               , SMODELNAME
               , SLOTNUMBER
               , '' AS AFFECT_PNL
               , SPHANLOAI
               , CAST(SLCL as INT) AS CUSTOMER_STANDARD_MIN
               , CAST(SUCL as INT) AS CUSTOMER_STANDARD_MAX
               , CAST(SLCL2 as INT) As LCL
               , CAST(SUCL2 as INT) As UCL
               , cast((select min(k) as least_value from (values (isnull(SP1,999999999)), (isnull(SP2,999999999)), (isnull(SP3,999999999)), (isnull(SP4,999999999)), (isnull(SP5,999999999)), (isnull(SP6,999999999)), (isnull(SP7,999999999)), (isnull(SP8,999999999)), (isnull(SP9,999999999)), (isnull(SP10,999999999)), (isnull(SP11,999999999)), (isnull(SP12,999999999)), (isnull(SP13,999999999)), (isnull(SP14,999999999)), (isnull(SP15,999999999)), (isnull(SP16,999999999)), (isnull(SP17,999999999)), (isnull(SP18,999999999))) as v (k)) as float) AS VALUE_LEAST
               , cast((select max(k) as least_value from (values (isnull(SP1,-999999999)), (isnull(SP2,-999999999)), (isnull(SP3,-999999999)), (isnull(SP4,-999999999)), (isnull(SP5,-999999999)), (isnull(SP6,-999999999)), (isnull(SP7,-999999999)), (isnull(SP8,-999999999)), (isnull(SP9,-999999999)), (isnull(SP10,-999999999)), (isnull(SP11,-999999999)), (isnull(SP12,-999999999)), (isnull(SP13,-999999999)), (isnull(SP14,-999999999)), (isnull(SP15,-999999999)), (isnull(SP16,-999999999)), (isnull(SP17,-999999999)), (isnull(SP18,-999999999))) as v (k)) as float) AS VALUE_GREATEST
               , 'Y' AS  CTQ_FLAG
               , SEQUIPMENTNAME as eqp_name
            From dbo.erp_tblthickness
           Where
                EXTEND_DATE >= @from_dt and EXTEND_DATE < @to_dt
                --EXTEND_DATE BETWEEN @from_dt and @to_dt --DATEADD(MONTH, -1, GETDATE()) and GETDATE()
             AND SSPECRESULT2 != 'OK'

      ) T
 ORDER BY T.INSPECTION_TIME desc
 
 
 
 