with cte as
(
	select 
		menu_id
	,	sort
	from 
		openjson(@json) 
		with 
		(
			menu_id varchar(40) '$.MenuId'
		,	sort int '$.Sort'
	)
)
update
	dbo.tb_favorite
set
	sort = cte.sort
from
	dbo.tb_favorite a
join
	cte
	on	a.corp_id = @corp_id
	and	a.fac_id = @fac_id
	and	a.[user_id] = @create_user
	and	a.menu_id = cte.menu_id
;