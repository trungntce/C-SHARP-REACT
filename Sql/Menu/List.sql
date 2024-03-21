with menu as
(
	select
		case when b.menu_id is null then 'Y' else 'N' end as anonymous_yn
	,	a.*
	,	isnull(lang.lang_text, a.menu_name) as menu_name_lang
	from
		dbo.tb_menu a
	left join
		dbo.tb_lang_code lang
		on	a.menu_name = lang.lang_code
		and	lang.nation_code = @nation_code
	left join
		dbo.tb_menu b
		on	a.corp_id = b.corp_id
		and	a.fac_id = b.fac_id
		and a.menu_id = b.menu_id
		and	b.menu_id in (select menu_id from tb_menu_auth)
	where
		a.corp_id			= @corp_id
	and	a.fac_id			= @fac_id
), cte as
(
	select
		a.menu_id
	,	power(cast(100 as bigint), cast(4 as bigint)) * a.menu_sort		as sort
	,	cast(a.menu_id as varchar(max)) as menu_path
	,	cast(a.menu_name as nvarchar(max)) as menu_path_name
	,	cast(a.menu_name_lang as nvarchar(max)) as menu_path_name_lang
	,	0 as depth
	,	a.menu_name
	,	a.menu_name_lang
	,	a.menu_type
	,	a.parent_id
	,	a.icon
	,	a.use_yn
	,	a.menu_sort
	,	a.menu_body
	,	a.anonymous_yn
	,	a.manager
	from
		menu a
	where
		a.parent_id		is null
	union all
	select
		a.menu_id
	,	b.sort + (power(cast(100 as bigint), cast(4 - (b.depth + 1) as bigint)) * a.menu_sort)
	,	b.menu_path + ',' + cast(a.menu_id as varchar(max)) as menu_path
	,	b.menu_path_name + ',' + cast(a.menu_name as nvarchar(max)) as menu_path_name
	,	b.menu_path_name_lang + ',' + cast(a.menu_name_lang as nvarchar(max)) as menu_path_name_lang
	,	b.depth + 1
	,	a.menu_name
	,	a.menu_name_lang
	,	a.menu_type
	,	a.parent_id
	,	a.icon
	,	a.use_yn
	,	a.menu_sort
	,	a.menu_body
	,	a.anonymous_yn
	,	a.manager
	from
		menu a
	join
		cte b on a.parent_id = b.menu_id
	where
		a.parent_id is not null			
)
select
	cte.*
,	a.menu_name as parent_name
,	isnull(lang.lang_text, a.menu_name) as parent_name_lang
,	(select count(*) from dbo.tb_menu x where x.parent_id = cte.menu_id)	as child_count
from
	cte
left join
	tb_menu a
	on cte.parent_id = a.menu_id
left join
	dbo.tb_lang_code lang
	on	a.menu_name = lang.lang_code
	and	lang.nation_code = @nation_code
order by
	sort
;