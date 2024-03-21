select
	count(*) as cnt
from
	dbo.tb_menu
where
	corp_id				= @corp_id
and	fac_id				= @fac_id
and	parent_id			= @menu_id
;
