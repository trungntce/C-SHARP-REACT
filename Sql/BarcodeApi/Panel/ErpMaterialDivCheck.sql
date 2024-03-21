select
   ITEM_CODE
,   ITEM_DESCRIPTION
from 
   dbo.erp_inv_item_master
where
   SOB_ID             = 90    --º£Æ®³²
AND ORG_ID             = 901    --FPCB
AND   ITEM_DIVISION_CODE = 'GOODS' 
AND ITEM_CODE         = @barcode