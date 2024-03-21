delete from 
	dbo.tb_lang_code
where 
	corp_id			= @corp_id
and	fac_id			= @fac_id
and lang_code		= @lang_code
and nation_code		= @nation_code
;
