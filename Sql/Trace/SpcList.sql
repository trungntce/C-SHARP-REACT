-- LOT 종합이력 SPC 상세
SELECT 
    INSPECTION_DATE
,   INSPECTION_TIME
,   TYPE_DESC
,   OPERATION_DESCRIPTION
,   INSPECTION_DESC
,   STATUS_FLAG
,   CUSTOMER_LSL as lsl
,   CUSTOMER_USL as usl
,   INTERNAL_LSL as lcl
,   INTERNAL_USL as ucl
,   spc_rule
,   spc_rule_ng_list
,   VALUE_MIN
,   VALUE_MAX
,   search_from
,   search_to
,   search_item_code
,   search_oper_code
,   search_eqp_code
,   search_inspection_desc
 FROM (
    SELECT 
        IOH.INSPECTION_DATE
--             , RIGHT('0' + CONVERT(VARCHAR, DATEPART(HOUR, IOH.INSPECTION_DATE)), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEPART(minute, IOH.INSPECTION_DATE)), 2) AS INSPECTION_TIME
--  , FORMAT(IOH.INSPECTION_DATE, 'HH:mi:ss') AS INSPECTION_TIME
    ,   convert(varchar, IOH.INSPECTION_DATE, 8) AS INSPECTION_TIME
    ,   'IPQC 치수검사' AS TYPE_DESC
    ,   SSO.OPERATION_DESCRIPTION
    ,   LE.ENTRY_DESCRIPTION +
                 CASE WHEN LE2.ENTRY_DESCRIPTION IS NOT NULL THEN LE2.ENTRY_DESCRIPTION ELSE '' END +
                 CASE WHEN LE3.ENTRY_DESCRIPTION IS NOT NULL THEN LE3.ENTRY_DESCRIPTION ELSE '' END     AS INSPECTION_DESC
               , IOC.STATUS_MES AS STATUS_FLAG --23.09.14 MES용 판정 FLAG  
              /*, CASE WHEN IOC.STATUS_CUSTOMER <> IOC.STATUS THEN 'CHK'
               		  WHEN IOC.STATUS = 'OK' AND IOC.STATUS_CUSTOMER ='OK' THEN 'OK'
               		  WHEN IOC.STATUS = 'NG' AND IOC.STATUS_CUSTOMER ='NG' THEN 'NG' 
               	  END AS STATUS_FLAG*/ 
--               , IOC.STATUS AS STATUS_FLAG
               , 'X' as spc_rule
               , 'NONE' as spc_rule_ng_list
               , IOC.CUSTOMER_STANDARD_MIN AS CUSTOMER_LSL 
               , IOC.CUSTOMER_STANDARD_MAX AS CUSTOMER_USL
               , IOC.INNER_STANDARD_MIN AS INTERNAL_LSL
               , IOC.INNER_STANDARD_MAX AS INTERNAL_USL
--               , IOC.STATUS_CUSTOMER -- [고객기준 상태] ADD, 2022-06-13, BY JHHAN
               , (select min(k) from (values (isnull(IOC.N_VALUE1,999999999)), (isnull(IOC.N_VALUE2,999999999)), (isnull(IOC.N_VALUE3,999999999)), (isnull(IOC.N_VALUE4,999999999)), (isnull(IOC.N_VALUE5,999999999)), (isnull(IOC.N_VALUE6,999999999)), (isnull(IOC.N_VALUE7,999999999)), (isnull(IOC.N_VALUE8,999999999)), (isnull(IOC.N_VALUE9,999999999)), (isnull(IOC.N_VALUE10,999999999)), (isnull(IOC.N_VALUE11,999999999)), (isnull(IOC.N_VALUE12,999999999)), (isnull(IOC.N_VALUE13,999999999)), (isnull(IOC.N_VALUE14,999999999)), (isnull(IOC.N_VALUE15,999999999)), (isnull(IOC.N_VALUE16,999999999)), (isnull(IOC.N_VALUE17,999999999)), (isnull(IOC.N_VALUE18,999999999)), (isnull(IOC.N_VALUE19,999999999)), (isnull(IOC.N_VALUE20,999999999))) as v (k)) AS VALUE_MIN
               , (select max(k) from (values (isnull(IOC.N_VALUE1,-999999999)), (isnull(IOC.N_VALUE2,-999999999)), (isnull(IOC.N_VALUE3,-999999999)), (isnull(IOC.N_VALUE4,-999999999)), (isnull(IOC.N_VALUE5,-999999999)), (isnull(IOC.N_VALUE6,-999999999)), (isnull(IOC.N_VALUE7,-999999999)), (isnull(IOC.N_VALUE8,-999999999)), (isnull(IOC.N_VALUE9,-999999999)), (isnull(IOC.N_VALUE10,-999999999)), (isnull(IOC.N_VALUE11,-999999999)), (isnull(IOC.N_VALUE12,-999999999)), (isnull(IOC.N_VALUE13,-999999999)), (isnull(IOC.N_VALUE14,-999999999)), (isnull(IOC.N_VALUE15,-999999999)), (isnull(IOC.N_VALUE16,-999999999)), (isnull(IOC.N_VALUE17,-999999999)), (isnull(IOC.N_VALUE18,-999999999)), (isnull(IOC.N_VALUE19,-999999999)), (isnull(IOC.N_VALUE20,-999999999))) as v (k)) AS VALUE_MAX
               , dateadd(day, -7, IOH.INSPECTION_DATE) as search_from
               , dateadd(ss, 1, IOH.INSPECTION_DATE) as search_to
               , null as search_item_code
               , null as search_oper_code
               , null as search_eqp_code
               , null as search_inspection_desc
            FROM dbo.erp_qm_inspection_op_header IOH
                INNER      JOIN dbo.erp_qm_inspection_op_cs   		IOC ON IOH.INSPECTION_OP_HEADER_ID  = IOC.INSPECTION_OP_HEADER_ID
                INNER      JOIN dbo.erp_sdm_standard_operation 		SSO ON IOH.OPERATION_ID 			= SSO.OPERATION_ID               
                LEFT OUTER JOIN dbo.erp_eapp_lookup_entry          	LE  ON IOC.CHECK_TYPE_ID       		= LE.LOOKUP_ENTRY_ID
                LEFT OUTER JOIN dbo.erp_eapp_lookup_entry      		LE2 ON IOC.CHECK_POSITION_ID       	= LE2.LOOKUP_ENTRY_ID
                LEFT OUTER JOIN dbo.erp_eapp_lookup_entry      		LE3 ON IOC.CHECK_NUMBER_ID         	= LE3.LOOKUP_ENTRY_ID
           WHERE 
            IOH.SOB_ID = 90
             AND IOH.ORG_ID = 901
             AND IOH.IPQC_FLAG = 'A'
             AND IOH.JOB_ID 		= @job_id
             AND IOH.OPERATION_ID	= @oper_id
             AND IOH.ATTRIBUTE_1	= @oper_seq_no
             AND IOC.N_VALUE1 IS NOT NULL
        UNION ALL
             -- 신뢰성 (신뢰성 등록 데이터 중 공정타입코드 V06)
          SELECT 
            MRH.INSPECTION_DATE as INSPECTION_DATE
          	--    , FORMAT(MRH.CREATION_DATE, 'HH:mm:ss') AS INSPECTION_TIME
               ,   convert(varchar, MRH.INSPECTION_DATE, 8) AS INSPECTION_TIME
--                   , RIGHT('0' + CONVERT(VARCHAR, DATEPART(HOUR, MRH.CREATION_DATE)), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEPART(minute, MRH.CREATION_DATE)), 2) AS INSPECTION_TIME
               , '신뢰성 검사' AS TYPE_DESC
               , SSO.OPERATION_DESCRIPTION
               , QC.CODE_NAME+'-'+ QC2.CODE_NAME    AS INSPECTION_DESC
               , CASE WHEN (MIN(MRL.COLUMN_VALUE) >= isnull(MRH.SPEC,0) - isnull(MRH.SPEC_MINUS_TOL,999999999)
                          AND MAX(MRL.COLUMN_VALUE) <= isnull(MRH.SPEC,0) + isnull(MRH.SPEC_PLUS_TOL,999999999)) THEN 'OK'
                      ELSE 'NG' END AS STATUS_FLAG
               , 'X' as spc_rule
               , 'NONE' as spc_rule_ng_list
               , isnull(MRH.SPEC,0) - isnull(MRH.SPEC_MINUS_TOL,999999999) AS CUSTOMER_LSL
               , isnull(MRH.SPEC,0) + isnull(MRH.SPEC_PLUS_TOL,999999999) AS CUSTOMER_USL
               , isnull(MRH.SPEC,0) - isnull(MRH.SPEC_MINUS_TOL,999999999) AS INTERNAL_LSL
               , isnull(MRH.SPEC,0) + isnull(MRH.SPEC_PLUS_TOL,999999999) AS INTERNAL_USL
               , MIN(MRL.COLUMN_VALUE) AS VALUE_MIN
               , MAX(MRL.COLUMN_VALUE) AS VALUE_MAX
               , dateadd(day, -7, MRH.INSPECTION_DATE) as search_from
               , dateadd(ss, 1, MRH.INSPECTION_DATE) as search_to
               , null as search_item_code
               , null as search_oper_code
               , null as search_eqp_code
               , null as search_inspection_desc
            FROM dbo.erp_z_mes_reliability_header MRH
                INNER      JOIN dbo.erp_z_mes_reliability_line      MRL ON MRH.RELIABILITY_HEADER_ID  = MRL.RELIABILITY_HEADER_ID
                INNER      JOIN dbo.erp_sdm_standard_operation    	SSO ON MRH.OPERATION_ID           = SSO.OPERATION_ID
                INNER      JOIN dbo.erp_z_mes_reliability_item      MRI ON MRI.RELIABILITY_ITEM_ID    = MRH.RELIABILITY_ITEM_ID
                LEFT OUTER JOIN dbo.erp_qm_common                   QC  ON MRI.MES_Y_FACTOR_ID        = QC.COMMON_ID
                LEFT OUTER JOIN dbo.erp_qm_common                   QC2 ON MRI.MES_Y_FACTOR_DTL_ID    = QC2.COMMON_ID
           WHERE 
            SSO.SOB_ID = 90 
            AND SSO.ORG_ID =901
             AND SSO.OPERATION_TYPE_ID = 199 -- 공정 타입 [유산동/V06], 신뢰성 검사 공정
--             AND MRH.INSPECTION_DATE BETWEEN ZF_GET_EXTEND_DATE(SYSDATE - 1) AND ZF_GET_EXTEND_DATE(SYSDATE)          
             AND MRL.COLUMN_VALUE IS NOT NULL
             AND MRH.JOB_ID 			= @job_id
             AND MRH.OPERATION_ID 		= @oper_id
             AND MRH.OPERATION_SEQ_NO 	= @oper_seq_no	 
           GROUP BY MRH.INSPECTION_DATE
           	   , FORMAT(MRH.CREATION_DATE, 'HH:mm:ss')
--               , RIGHT('0' + CONVERT(VARCHAR, DATEPART(HOUR, MRH.CREATION_DATE)), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEPART(minute, MRH.CREATION_DATE)), 2)
               , SSO.OPERATION_DESCRIPTION
               , QC.CODE_NAME
               , QC2.CODE_NAME
               , isnull(MRH.SPEC,0) - isnull(MRH.SPEC_MINUS_TOL,999999999)
               , isnull(MRH.SPEC,0) + isnull(MRH.SPEC_PLUS_TOL,999999999)
        --UNION ALL
        --     -- 출하검사 (신뢰성 등록 데이터 중 공정타입코드 S03 )
        --  SELECT MRH.INSPECTION_DATE
        --       , RIGHT('0' + CONVERT(VARCHAR, DATEPART(HOUR, MRH.CREATION_DATE)), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEPART(minute, MRH.CREATION_DATE)), 2) AS INSPECTION_TIME
        --       , '출하검사' AS TYPE_DESC
        --       , SSO.OPERATION_DESCRIPTION
        --       , QC.CODE_NAME + '-' + QC2.CODE_NAME    AS INSPECTION_DESC
        --       , CASE WHEN (MIN(MRL.COLUMN_VALUE) >= isnull(MRH.SPEC,0) - isnull(MRH.SPEC_MINUS_TOL,999999999)
        --                AND MAX(MRL.COLUMN_VALUE) <= isnull(MRH.SPEC,0) + isnull(MRH.SPEC_PLUS_TOL,999999999)) THEN 'OK' ELSE 'NG' END AS STATUS_FLAG
        --       , isnull(MRH.SPEC,0) - isnull(MRH.SPEC_MINUS_TOL,999999999) AS SPEC_LSL
        --       , isnull(MRH.SPEC,0) + isnull(MRH.SPEC_PLUS_TOL,999999999) AS SPEC_USL
        --       , MIN(MRL.COLUMN_VALUE) AS VALUE_MIN
        --       , MAX(MRL.COLUMN_VALUE) AS VALUE_MAX
        --    FROM dbo.erp_z_mes_reliability_header  MRH
        --      INNER      JOIN dbo.erp_z_mes_reliability_line      MRL ON MRH.RELIABILITY_HEADER_ID  = MRL.RELIABILITY_HEADER_ID
        --        INNER      JOIN dbo.erp_sdm_standard_operation                SSO ON MRH.OPERATION_ID                = SSO.OPERATION_ID
        --        INNER      JOIN dbo.erp_z_mes_reliability_item      MRI ON MRI.RELIABILITY_ITEM_ID    = MRH.RELIABILITY_ITEM_ID
        --        LEFT OUTER JOIN dbo.erp_qm_common               QC  ON MRI.MES_Y_FACTOR_ID        = QC.COMMON_ID
        --        LEFT OUTER JOIN dbo.erp_qm_common                       QC2 ON MRI.MES_Y_FACTOR_DTL_ID    = QC2.COMMON_ID
        --   WHERE SSO.SOB_ID = 90 AND SSO.ORG_ID =901
        --     AND SSO.OPERATION_TYPE_ID = 191 -- 공정 타입 [베트남선적/S03], 출하 검사 공정
        --     AND MRL.COLUMN_VALUE IS NOT NULL
        --     AND MRH.JOB_ID 			= @job_id
        --     AND MRH.OPERATION_ID 		= @oper_id
        --     AND MRH.OPERATION_SEQ_NO 	= @oper_seq_no	
        --   GROUP BY MRH.INSPECTION_DATE
        --       , RIGHT('0' + CONVERT(VARCHAR, DATEPART(HOUR, MRH.CREATION_DATE)), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEPART(minute, MRH.CREATION_DATE)), 2)
        --       , SSO.OPERATION_DESCRIPTION
        --       , QC.CODE_NAME
        --       , QC2.CODE_NAME
        --       , isnull(MRH.SPEC,0) - isnull(MRH.SPEC_MINUS_TOL,999999999)
        --       , isnull(MRH.SPEC,0) + isnull(MRH.SPEC_PLUS_TOL,999999999)
         UNION ALL
             -- 외주 수입검사 (IQC 치수 데이터)
          SELECT 
            QIJ.INSPECT_DATE AS INSPECTION_DATE
               -- , FORMAT(QIJ.INSPECT_DATE, 'HH:mm:ss') AS INSPECTION_TIME
               ,   convert(varchar, QIJ.INSPECT_DATE, 8) AS INSPECTION_TIME
--                   , RIGHT('0' + CONVERT(VARCHAR, DATEPART(HOUR, QIJ.INSPECT_DATE)), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEPART(minute, QIJ.INSPECT_DATE)), 2) AS INSPECTION_TIME
               , 'IQC 치수검사' AS TYPE_DESC
               , SSO.OPERATION_DESCRIPTION
               , '치수'    AS INSPECTION_DESC
               , QIM.PASS_FLAG_AT_INSPECTION AS STATUS_FLAG
               , 'X' as spc_rule
               , 'NONE' as spc_rule_ng_list
               , isnull(QIS.SPEC,0) - isnull(QIS.SPEC_MINUS ,999999999) AS CUSTOMER_LSL
               , isnull(QIS.SPEC,0) + isnull(QIS.SPEC_PLUS,999999999) AS CUSTOMER_USL
               , isnull(QIS.SPEC,0) - isnull(QIS.SPEC_MINUS ,999999999) AS INTERNAL_LSL
               , isnull(QIS.SPEC,0) + isnull(QIS.SPEC_PLUS,999999999) AS INTERNAL_USL
               , (select min(k) as least_value from (values (isnull(QIM.DATA_01,999999999)), (isnull(QIM.DATA_03,999999999)), (isnull(QIM.DATA_04,999999999)), (isnull(QIM.DATA_05,999999999))) as v (k)) AS VALUE_MIN
               , (select max(k) as least_value from (values (isnull(QIM.DATA_01,-999999999)), (isnull(QIM.DATA_02,-999999999)), (isnull(QIM.DATA_03,-999999999)), (isnull(QIM.DATA_04,-999999999)), (isnull(QIM.DATA_05,-999999999))) as v (k)) AS VALUE_MAX
               , dateadd(day, -7, QIJ.INSPECT_DATE) as search_from
               , QIJ.INSPECT_DATE as search_to
               , null as search_item_code
               , null as search_oper_code
               , null as search_eqp_code
               , null as search_inspection_desc
            FROM dbo.erp_qm_out_iqc_measure QIM
                INNER      JOIN dbo.erp_qm_out_iqc_spec           QIS ON QIM.QM_OUT_IQC_SPEC_ID      = QIS.QM_OUT_IQC_SPEC_ID
                INNER      JOIN dbo.erp_qm_out_inspect_job        QIJ ON QIJ.OUT_INSPECT_ID              = QIM.OUT_INSPECT_ID
                INNER      JOIN dbo.erp_wip_out_receipt_operation RO  ON RO.RECEIPT_ID                           = QIJ.OUT_RECEIPT_ID
                    INNER      JOIN dbo.erp_sdm_standard_operation        SSO ON RO.OPERATION_ID                        = SSO.OPERATION_ID
           WHERE 
               QIM.DATA_01 IS NOT NULL
             AND QIJ.JOB_ID 			= @job_id
             AND RO.OPERATION_ID 		= @oper_id
             AND RO.OPERATION_SEQ_NO  	= @oper_seq_no
        UNION ALL
         -- CMI 두께측정
            SELECT 
            	MAX(CMI_S.DTENDTIME) 		as INSPECTION_DATE
               , MAX(CMI_S.INSPECTION_TIME) as INSPECTION_TIME
               , MAX(CMI_S.TYPE_DESC) 		as TYPE_DESC
               , MAX(CMI_S.SPROCESS) 		as OPERATION_DESCRIPTION
               , MAX(CMI_S.SPHANLOAI) 		as INSPECTION_DESC
               , CASE MIN(STATUS_FLAG) WHEN 'CHECK' THEN 'CHK'
               WHEN 'NG' THEN 'NG'     WHEN 'OK' THEN 'OK' END AS STATUS_FLAG
               , 'X' as spc_rule
               , 'NONE' as spc_rule
               , MIN(CMI_S.CUSTOMER_LSL) 	as CUSTOMER_LSL
               , MAX(CMI_S.CUSTOMER_USL) 	as CUSTOMER_USL
               , MIN(CMI_S.INTERNAL_LSL) 	as INTERNAL_LSL
               , MAX(CMI_S.INTERNAL_USL) 	as INTERNAL_USL
               , MIN(CMI_S.VALUE_LEAST) 	as VALUE_MIN
               , MAX(CMI_S.VALUE_GREATEST) 	as VALUE_MAX
               , dateadd(day, -7, MAX(CMI_S.DTENDTIME)) as search_from
               , dateadd(ss, 1, MAX(CMI_S.DTENDTIME)) as search_to
               , null as search_item_code
               , null as search_oper_code
               , null as search_eqp_code
               , null as search_inspection_desc
               FROM (
                        SELECT DTENDTIME
                    --             , RIGHT('0' + CONVERT(VARCHAR, DATEPART(HOUR, DTSTARTTIME)), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEPART(minute, DTSTARTTIME)), 2) AS INSPECTION_TIME
					,   convert(varchar, DTENDTIME, 8) AS INSPECTION_TIME
                    , 'CMI두께' AS TYPE_DESC
                    , SPROCESS
                    , SPHANLOAI
                    , CASE WHEN ISNULL(SSPECRESULT,'NG') <> ISNULL(SSPECRESULT2,'NG') THEN 'CHECK'
                              WHEN ISNULL(SSPECRESULT2,'NG') = 'OK' AND ISNULL(SSPECRESULT,'NG') ='OK' THEN 'OK'
                              WHEN ISNULL(SSPECRESULT2,'NG') = 'NG' AND ISNULL(SSPECRESULT,'NG') ='NG' THEN 'NG'
                         END AS STATUS_FLAG
                    , FORMAT(CONVERT(FLOAT,SLCL), '0.00') As CUSTOMER_LSL
                    , FORMAT(CONVERT(FLOAT,SUCL), '0.00') As CUSTOMER_USL
                    , FORMAT(CONVERT(FLOAT,SLCL2), '0.00') As INTERNAL_LSL
                    , FORMAT(CONVERT(FLOAT,SUCL2), '0.00') As INTERNAL_USL
                    ,  (select FORMAT(CONVERT(FLOAT,min(k)),'0.00')
                              from (values (isnull(SP1,999999999)), (isnull(SP2,999999999)), (isnull(SP3,999999999)), (isnull(SP4,999999999)), (isnull(SP5,999999999)), (isnull(SP6,999999999)), (isnull(SP7,999999999)), (isnull(SP8,999999999)), (isnull(SP9,999999999)), (isnull(SP10,999999999)), (isnull(SP11,999999999)), (isnull(SP12,999999999)), (isnull(SP13,999999999)), (isnull(SP14,999999999)), (isnull(SP15,999999999)), (isnull(SP16,999999999)), (isnull(SP17,999999999)), (isnull(SP18,999999999))) as v (k)
                         ) AS VALUE_LEAST
                    ,  (select FORMAT(CONVERT(FLOAT,max(k)),'0.00') from (values (isnull(SP1,-999999999)), (isnull(SP2,-999999999)), (isnull(SP3,-999999999)), (isnull(SP4,-999999999)), (isnull(SP5,-999999999)), (isnull(SP6,-999999999)), (isnull(SP7,-999999999)), (isnull(SP8,-999999999)), (isnull(SP9,-999999999)), (isnull(SP10,-999999999)), (isnull(SP11,-999999999)), (isnull(SP12,-999999999)), (isnull(SP13,-999999999)), (isnull(SP14,-999999999)), (isnull(SP15,-999999999)), (isnull(SP16,-999999999)), (isnull(SP17,-999999999)), (isnull(SP18,-999999999))) as v (k)
                              ) AS VALUE_GREATEST
                    From dbo.erp_tblthickness
                    where    
                        SNO = 1
                        and SLOTNUMBER         = @workorder
                        AND OPERATION_SEQ_NO   = @oper_seq_no
                    ) CMI_S
        union all
        select
            inspection_date 
        ,   inspection_time
        ,   case 
                when type_desc = 'IPQC' then 'IPQC 치수 검사'
                when type_desc = 'CMI' then 'CMI두께'
                when type_desc = 'IQC' then 'IQC 치수 검사'
                when type_desc = 'TRUST' then '신뢰성 검사'
                else type_desc
            end as type_desc
        ,   oper_name
        ,   inspection_desc
        ,   case 
                when judge_spec_ng = 'NG' then 'NG'
                when judge_rule_1_x = 'CHK'  or judge_rule_1_r = 'CHK' or judge_rule_2 = 'CHK' or judge_rule_3 = 'CHK' or judge_rule_4 = 'CHK' or judge_rule_5 = 'CHK' or judge_rule_6 = 'CHK' or judge_rule_7 = 'CHK' or judge_rule_8 = 'CHK' then 'CHK'
                else 'OK' 
            end  as STATUS_FLAG 
        ,   'X' as spc_rule
        ,   case when remark like '%임시%' then 'TEST ' else '' end
            +   case when judge_spec_ng = 'NG' then 'SPEC ' else '' end
            +   case when judge_rule_1_x = 'CHK' then 'X ' else '' end
            +   case when judge_rule_1_r = 'CHK' then 'R ' else '' end
            +   case when judge_rule_2 = 'CHK' then '2 ' else '' end
            +   case when judge_rule_3 = 'CHK' then '3 ' else '' end
            +   case when judge_rule_4 = 'CHK' then '4 ' else '' end
            +   case when judge_rule_5 = 'CHK' then '5 ' else '' end
            +   case when judge_rule_6 = 'CHK' then '6 ' else '' end
            +   case when judge_rule_7 = 'CHK' then '7 ' else '' end
            +   case when judge_rule_8 = 'CHK' then '8 ' else '' end
            +   case when judge_spec_ng = 'OK' and judge_rule_1_x  = 'OK'  and judge_rule_1_r = 'OK' and judge_rule_2 = 'OK' and judge_rule_3 = 'OK' and judge_rule_4 = 'OK' and judge_rule_5 = 'OK' and judge_rule_6 = 'OK' and judge_rule_7 = 'OK' and judge_rule_8 = 'OK' then 'OK' else '' end
                as spc_rule_ng_list
        ,   lsl             as CUSTOMER_LSL --lsl
        ,   usl             as CUSTOMER_USL
        ,   lcl             as INTERNAL_LSL
        ,   ucl             as INTERNAL_USL
        ,   [min]           as VALUE_MIN
        ,   [max]           as VALUE_MAX
        ,   search_from
        ,   search_to   
        ,   item_code as search_item_code
        ,   oper_code as search_oper_code
        ,   eqp_code  as search_eqp_code
        ,   inspection_desc + ' (' + convert(varchar, lsl) + ' ~ ' + convert(varchar, usl) + ')' as search_inspection_desc
        from
            tb_panel_4m_spc_8rule
        where
            workorder = @workorder
            and oper_seq_no = @oper_seq_no
      ) T
where 
    T.TYPE_DESC is not null
 ORDER BY T.INSPECTION_DATE DESC
;