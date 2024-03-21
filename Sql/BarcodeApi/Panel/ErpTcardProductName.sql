select
	sir.BOM_ITEM_ID
,   sir.BOM_ITEM_CODE 
,   sir.BOM_ITEM_DESCRIPTION 
from
	dbo.erp_wip_job_entities wje
join
	dbo.erp_sdm_item_revision sir
	on wje.BOM_ITEM_ID = sir.BOM_ITEM_ID
where 
	JOB_NO = @barcode
	--'VPN220328139-00008'
