with cte_roll_map as
(
	select top 1
		0 as depth
	,	child.*
	,	cast(child.group_key as varchar(max)) as group_list
	from
		dbo.tb_roll_map child
	where
		child.child_id = @barcode
	order by 
		create_dt desc
	union all
	select
		cte_roll_map.depth + 1 as depth
	,	parent.*
	,	cast(cte_roll_map.group_key + ',' + parent.group_key as varchar(max)) 
	from
		dbo.tb_roll_map parent
	join
		cte_roll_map
		on  parent.child_id = cte_roll_map.parent_id
		and parent.group_key not in (select [value] from string_split(cte_roll_map.group_list, ','))
)
select top 1
	parent_id 
from 
	cte_roll_map
order by depth desc



