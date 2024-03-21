select
	menu_id
,	sort
,	create_dt
from 
	dbo.tb_favorite a
where
	corp_id			= @corp_id
and	fac_id			= @fac_id
and	[user_id]		= @create_user
order by
	sort
;