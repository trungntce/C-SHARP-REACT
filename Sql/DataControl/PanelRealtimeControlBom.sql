select
   sir.BOM_ITEM_CODE as model_code
from
   dbo.erp_wip_job_entities wje
join
   dbo.erp_sdm_item_revision sir
   on wje.BOM_ITEM_ID = sir.BOM_ITEM_ID
where 
   JOB_NO = @workorder;