﻿with cte as
(
	select distinct
		material_code
	from
		dbo.tb_panel_material
	where
		material_lot is not null
)
select
	cte.*
,	item.ITEM_DESCRIPTION as material_name
from
	cte
join
	dbo.erp_inv_item_master item
	on	cte.material_code = item.ITEM_CODE
;