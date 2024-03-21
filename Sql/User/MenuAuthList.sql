with cte as
(
	select
		a.menu_id
	,	a.auth
	from 
		dbo.tb_menu_auth a
	where
		corp_id = @corp_id
	and	fac_id = @fac_id
	and target_id = @user_id
	and target_type = 'U'
	union
	select
		b.menu_id
	,	b.auth
	from
		openjson(@usergroup_json) a
	join
		dbo.tb_menu_auth b
		on	a.[value] = b.target_id
		and b.target_type = 'G'
	where
		corp_id = @corp_id
	and	fac_id = @fac_id
)
select
	menu_id
,	max(auth) as auth
from
	cte
group by
	menu_id
;