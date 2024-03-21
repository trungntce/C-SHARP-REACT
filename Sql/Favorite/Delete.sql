delete from 
	dbo.tb_favorite
where 
	corp_id			= @corp_id
and	fac_id			= @fac_id
and	[user_id]		= @create_user
and menu_id			= @menu_id
;
