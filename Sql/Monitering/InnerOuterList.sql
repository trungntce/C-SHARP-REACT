with erp_capa as 
(
	SELECT SGM.CODE1
	     , isnull(SGM.CODE1_DESC, CONVERT(varchar, WOS.OPERATION_ID)) AS CODE1_DESC
	     , SGM.ATTRIBUTE_A AS UOM
	     , SUM( CASE SGM.ATTRIBUTE_A WHEN 'PNL' THEN WOS.ONHAND_PNL_QTY
	                                 WHEN '㎡'  THEN WOS.ONHAND_MM_QTY  ELSE WOS.ONHAND_PCS_QTY END) AS ONHAND_QTY
	  FROM erp_wip_job_entities WJE 
	  		INNER      JOIN erp_wip_operations          WOS ON WJE.JOB_ID = WOS.JOB_ID
	        INNER      JOIN erp_sdm_item_revision       SIR ON WJE.BOM_ITEM_ID = SIR.BOM_ITEM_ID
	        INNER      JOIN erp_inv_item_master         IIM ON WJE.INVENTORY_ITEM_ID = IIM.INVENTORY_ITEM_ID
	        INNER      JOIN erp_si_group_detail         SGD ON WOS.OPERATION_ID = SGD.DETAIL_CODE_ID AND GROUP_CODE = 'PROCESS_GROUP_CAPA'
	        INNER      JOIN erp_si_group_master         SGM ON SGD.GROUP_MASTER_ID = SGM.GROUP_MASTER_ID
	        INNER      JOIN erp_sdm_standard_workcenter SSW ON WOS.WORKCENTER_ID = SSW.WORKCENTER_ID
	 WHERE WJE.SOB_ID = 90
	   AND WJE.ORG_ID = 901
	   AND WJE.JOB_STATUS_CODE = 'RELEASE'
	   AND WOS.ONHAND_FLAG = 'Y'
	   AND IIM.ITEM_CATEGORY_CODE = 'FG'
	   AND OWNER_TYPE_LCODE IN ('INSIDE', 'NEAR_OUTSIDE') -- 사내, 사내외주
	--   AND OWNER_TYPE_LCODE IN ('INSIDE') -- 사내
	--   AND OWNER_TYPE_LCODE = 'FAR_OUTSIDE' -- 사외외주
	 GROUP BY SGM.CODE1
	        , isnull(SGM.CODE1_DESC, CONVERT(varchar, WOS.OPERATION_ID))
	        , SGM.ATTRIBUTE_A
), oper_capa as 
(
	select
		  oper_group_code
		, oper_group_name
		, in_capa_val
		, unit
	from
		dbo.tb_oper_capa
)
select 
	oper_capa.in_capa_val as CAPA
	, isnull(ROUND(erp_capa.ONHAND_QTY,2), 0) as Perfomance
	, oper_capa.oper_group_name + '                   ' + unit  as capa_name
from 
	erp_capa
right join
	oper_capa
	on oper_capa.oper_group_code = erp_capa.CODE1
	and oper_capa.unit = erp_capa.UOM
order by oper_capa.in_capa_val
;