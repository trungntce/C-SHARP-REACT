select 
	count(*) as cnt
from 
	dbo.tb_menu_auth
where
	corp_id = @corp_id
and	fac_id = @fac_id
and	menu_id = @menu_id
and	target_id = @target_id
and	target_type = @target_type
;