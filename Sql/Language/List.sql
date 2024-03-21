with cte as 
(
	select
		lang_code
	from
		dbo.tb_lang_code
	where
	corp_id			= @corp_id
	and	fac_id			= @fac_id
	and lang_code		like '%' + @lang_code + '%'
	and lang_text		like '%' + @lang_text + '%'
)
select
	lang_code
,	nation_code
,	lang_text
,	create_dt
,	create_user
,	update_dt
,	update_user
from
	dbo.tb_lang_code total_list
where
	total_list.lang_code in (select * from cte)
	and nation_code		= @nation_code
order by
	create_dt desc, total_list.lang_code 
offset 
	(@page_no - 1) * @page_size rows
fetch next 
	@page_size rows only
;