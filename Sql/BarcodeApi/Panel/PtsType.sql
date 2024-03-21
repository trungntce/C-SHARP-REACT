select 
	a.JOB_NO
,	isnull(b.PTS_TYPE_LCODE, 'PTS_0') as pts_type 
from 
	erp_wip_job_entities a
join
	erp_sdm_item_structure b
	on
	a.BOM_ITEM_ID = b.SG_BOM_ITEM_ID
where 	
	a.JOB_NO = @workorder