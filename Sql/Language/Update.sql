update 
	dbo.tb_lang_code
set 
	nation_code		= @nation_code
,	lang_text		= @lang_text
,	update_user		= @update_user
,	update_dt		= getdate()
where 
	corp_id			= @corp_id
and	fac_id			= @fac_id
and lang_code		= @lang_code
and nation_code		= @nation_code
;
