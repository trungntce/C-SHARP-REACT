declare @lang_table table
(
	nation_code varchar(40)
,	updated bit
,	sort int
);

insert into
	@lang_table
select
	code_id
,	0
,	sort
from
	dbo.tb_code
where
	corp_id = @corp_id
and	fac_id = @fac_id
and	codegroup_id = 'LANG_CODE'
;

while((select count(*) from @lang_table where updated = 0) != 0)
begin
	declare @nation_code varchar(40);
	select top 1 @nation_code = nation_code from @lang_table where updated = 0 order by sort;

	select 
		lang_code
	,	lang_text
	from 
		dbo.tb_lang_code
	where
		corp_id = @corp_id
	and	fac_id = @fac_id
	and	nation_code = @nation_code
	;

	update
		@lang_table
	set
		updated = 1
	where
		nation_code = @nation_code
	;
end
