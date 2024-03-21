with cte as
(
	select distinct
		tool_code
	from
		dbo.tb_panel_tool
	union
	select distinct
		tool_code_spt
	from
		dbo.tb_panel_tool
)
select
	cte.*
,	item.ITEM_DESCRIPTION as tool_name
from
	cte
join
	dbo.erp_inv_item_master item
	on	cte.tool_code = item.ITEM_CODE
where
	item.ITEM_DIVISION_CODE = 'TOOL'
;
