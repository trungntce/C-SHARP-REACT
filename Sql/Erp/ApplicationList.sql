with cte as
(
	select
		ITEM_USE_LCODE
	,	SOB_ID
	,	ORG_ID
	from 
		dbo.erp_inv_item_master
	where
		SOB_ID = 90
	and	ORG_ID = 901
	and	ITEM_CATEGORY_CODE = 'FG'
), 
cte2 as
(
	select distinct
		ITEM_USE_LCODE as app_code
	,	common.ENTRY_DESCRIPTION as [app_name]
	from
		cte
	join
		dbo.erp_eapp_lookup_entry common
		on	cte.ITEM_USE_LCODE = common.ENTRY_CODE
	where
		LOOKUP_TYPE = 'ITEM_USE'
)
select
	app_code
,	app_name
from
	cte2
where
	app_code is not null
and	app_name is not null
order by
	app_code