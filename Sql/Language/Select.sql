select
	lang_code
,	nation_code
,	lang_text
,	create_dt
,	create_user
,	update_dt
,	update_user
from 
	dbo.tb_lang_code
where
	corp_id			= @corp_id
and	fac_id			= @fac_id
and	lang_code		= @lang_code
and	nation_code		= @nation_code
;