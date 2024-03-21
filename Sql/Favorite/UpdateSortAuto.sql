with cte as
(
	select 
		* 
	,	row_number() over(order by sort) as new_sort
	from 
		tb_favorite
	where
		corp_id = @corp_id
	and	fac_id = @fac_id
	and	[user_id] = @create_user
)
update
	dbo.tb_favorite
set
	sort = cte.new_sort
from
	dbo.tb_favorite a
join
	cte
	on	a.corp_id = cte.corp_id
	and	a.fac_id = cte.fac_id
	and	a.[user_id] = cte.[user_id]
	and	a.menu_id = cte.menu_id
;