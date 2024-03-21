select
	iim.ITEM_CODE
,	iim.ITEM_DESCRIPTION
,	imk.MAKER_CODE
,	imk.MAKER_DESCRIPTION
from 
	dbo.erp_inv_item_master iim inner join dbo.erp_inv_item_maker imk on iim.MAT_MAKER_ID = imk.MAKER_ID
where
	iim.SOB_ID             = 90    --º£Æ®³²
	and iim.ORG_ID             = 901    --FPCB
	and iim.ITEM_DIVISION_CODE = 'MATERIAL' 
	and iim.ITEM_CODE		   = @barcode