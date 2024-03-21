SELECT top 1 
	WJE.JOB_NO as workorder
,	IIM.ITEM_CODE as material_code
,	IIM.ITEM_DESCRIPTION as material_name
,	'' as maker_name
,	MLE.EXPIRED_DATE as  expired_dt 
,   IIO.ONHAND_QTY as onhand_qty
,   IIO.PACKING_BOX_NO
from 
	dbo.erp_wip_job_entities		 WJE
	join dbo.erp_inv_item_onhand		 IIO on IIO.WIP_JOB_ID        = WJE.JOB_ID
	join dbo.erp_inv_item_master		 IIM on IIO.INVENTORY_ITEM_ID = IIM.INVENTORY_ITEM_ID
	join dbo.erp_inv_warehouse			 IW  on IIO.WAREHOUSE_ID      = IW.WAREHOUSE_ID
	LEFT JOIN dbo.erp_inv_mat_lot_expire MLE on WJE.JOB_NO     = MLE.PACKING_BOX_NO  
WHERE
	IIM.ITEM_CODE in (select material_code from fn_material_by_mat_lot (@lots)) 
and
	IIO.ONHAND_QTY > 0
and
	MLE.EXPIRED_DATE > getDate()
and 
	MLE.EXPIRED_DATE < @expired_dt
 order by MLE.EXPIRED_DATE asc