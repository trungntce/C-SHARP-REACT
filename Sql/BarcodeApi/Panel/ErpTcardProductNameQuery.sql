select
	sir.BOM_ITEM_ID
,   sir.BOM_ITEM_CODE 
,   sir.BOM_ITEM_DESCRIPTION 
from
	APPS.WIP_JOB_ENTITIES wje
join
	APPS.SDM_ITEM_REVISION sir
	on wje.BOM_ITEM_ID = sir.BOM_ITEM_ID
where 
	JOB_NO = :barcode
	--'VPN220328139-00008'
