with cte_vrs as 
(
select
      vrs.mesdate
   ,    vrs.eqp_code
   ,    vrs.workorder
--   ,    vrs.vendor_code
--   ,    vrs.item_code
--   ,    vrs.item_use_code
   ,    vrs.model_code
   ,    vrs.model_description
   ,    vrs.pnlno
   ,    vrs.layer
   ,    vrs.ngcode
   ,    vrs.create_dt
   ,    vrs.piece_no
   ,    vrs.oper_seq_no
   ,    vrs.panel_qty
   ,   isnull(ele.ENTRY_DESCRIPTION, (select ENTRY_DESCRIPTION from erp_eapp_lookup_entry where LOOKUP_TYPE = 'SDM_ITEM_DIFFICULT' and ENTRY_DESCRIPTION like 'C%')) as grade
   ,   sis.PCS_PER_PNL_QTY as pcs_per_pnl_qty
   ,   grp.rule_val as ng_code
   ,   grpval.code_name as ng_name
   ,    vrs.filelocation
--   ,   cte_item_with_aoi.panel_id as barcode
   from
      dbo.tb_vrs vrs
   left join
      dbo.erp_sdm_item_revision sir 
      on sir.BOM_ITEM_CODE = vrs.model_code
   left join
      dbo.erp_sdm_item_spec sis
      on sis.BOM_ITEM_ID = sir.BOM_ITEM_ID
   left join 
      dbo.erp_eapp_lookup_entry ele
      on ele.ENTRY_CODE = sis.ITEM_DIFFICULT_LCODE
      and ele.LOOKUP_TYPE = 'SDM_ITEM_DIFFICULT'
   left join 
      dbo.tb_code grp
      on grp.code_id = vrs.ngcode
      and grp.codegroup_id = 'VRS_NG_CODE'
   left join    
      dbo.tb_code grpval
      on grpval.code_id = grp.rule_val
      and grpval.codegroup_id = 'VRS_NG_GROUP'
--   left join 
--      cte_item_with_aoi
--      on cte_item_with_aoi.panelnumber = vrs.pnlno
--      and cte_item_with_aoi.workorder = vrs.workorder
   where
      vrs.corp_id = 'SIFLEX'
   and   vrs.fac_id = 'SIFLEX'
   and   vrs.create_dt >= @from_dt and vrs.create_dt < @to_dt
--   and vrs.item_code is not null   
--   and vrs.workorder = 'VPN231126160-00027'
), cte as
(-- aoi ³»¿ÜÃþ °øÁ¤ÄÚµå »Ì±â
   select
      code_oper.*
   from
      dbo.tb_code code_type
   join
      dbo.tb_code code_oper
      on   code_type.code_id = code_oper.codegroup_id
   where
      code_type.codegroup_id = 'FDC_TYPE'
   and   code_type.code_id like '%AOI%'
), cte_aoi as
(
   select
      aoi_map.operation_seq_no as oper_seq_no
   ,   aoi_map.operation_code as oper_code
   ,   aoi_map.job_no as workorder
   ,   aoi_map.pnl_id as panel_id 
   ,   cast(aoi_map.pnl_no as varchar) as panelnumber
   from
      dbo.tb_panel_aoi_mapping aoi_map
)
select 
   cte_vrs.*
,   cte_aoi.panel_id as barcode
from 
   cte_vrs
left join
   cte_aoi
   on cte_aoi.panelnumber = cte_vrs.pnlno
   and cte_aoi.workorder = cte_vrs.workorder
   and cte_aoi.oper_seq_no = cte_vrs.oper_seq_no