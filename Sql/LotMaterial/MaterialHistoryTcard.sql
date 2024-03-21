﻿/*WOS.JOB_ID, WOS.JOB_NO, WOS.OPERATION_SEQ_NO, *//*LPAD('ㄴ', 5*(LEVEL-1)) ||*/
SELECT LEVEL
	,	CASE WHEN ROP.PACKING_BOX_NO != 'NOT_PACKING'	THEN LPAD('', 3*(LEVEL-1)) || ROP.PACKING_BOX_NO 
														ELSE LPAD('', 3*(LEVEL-1)) || WJE.JOB_NO END AS material_lot
	,	IIM.ITEM_CODE AS material_code
	,	IIM.ITEM_DESCRIPTION AS material_name
	,	ROP.ENTIRE_ISSUE_QTY
	,	MLE.EXPIRED_DATE AS expired_dt
	,	STRU.LAYER_NO AS layer_no
	,	NVL(STRU.MAIN_BASE_FLAG, 'N') as main
	,	STRU.STRUCT_LAYER_CODE AS type
	,	NVL(maker.MAKER_DESCRIPTION, '') as maker
	,	'' as create_dt
FROM 
	APPS.WIP_OPERATIONS WOS INNER JOIN 
	APPS.WIP_REQUIREMENT_OP_PULL			ROP ON WOS.Wip_Operation_Id			= ROP.Wip_Operation_Id
	INNER JOIN APPS.INV_ITEM_MASTER			IIM ON ROP.Component_Inv_Item_Id	= IIM.INVENTORY_ITEM_ID
	LEFT OUTER JOIN APPS.INV_MAT_LOT_EXPIRE	MLE ON ROP.PACKING_BOX_NO			= MLE.PACKING_BOX_NO
	LEFT OUTER JOIN APPS.WIP_JOB_ENTITIES	WJE ON ROP.COMPONENT_WIP_JOB_ID		= WJE.JOB_ID
	LEFT JOIN APPS.SDM_ITEM_STRUCTURE		STRU	ON IIM.INVENTORY_ITEM_ID		= STRU.SG_ITEM_ID
	LEFT JOIN APPS.INV_ITEM_MAKER			MAKER	ON IIM.MAT_MAKER_ID      = MAKER.MAKER_ID
START WITH 
	WOS.JOB_NO = :workorder
CONNECT BY PRIOR 
	ROP.COMPONENT_WIP_JOB_ID = WOS.JOB_ID
