select 
	count(*) as cnt
from 
	dbo.tb_user
where
	[user_id] = @user_id
;