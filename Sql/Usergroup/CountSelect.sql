select 
	count(*) as cnt
from 
	dbo.tb_usergroup
where
	corp_id = @corp_id
and	fac_id = @fac_id
and	usergroup_id = @usergroup_id
;