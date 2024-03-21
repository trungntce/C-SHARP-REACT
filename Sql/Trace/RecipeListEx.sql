declare @tbl table
(
	row_no			int

,	recipe_code		varchar(30)
,	recipe_name		nvarchar(100)
,	base_val		numeric(13, 3)

,	raw_type		char(1)
,	eqp_code		varchar(50)
,	table_name		varchar(50)
,	column_name		varchar(50)
,	from_dt			datetime
,	to_dt			datetime
,	eqp_code_ctq	varchar(30)
)	
;

declare @tbl_calc table
(
	row_no				int

,	raw_type			char(1)
,	table_name			varchar(50)
,	column_name			varchar(50)
,	min_val				numeric(13, 3)
,	max_val				numeric(13, 3)
,	avg_val				numeric(13, 3)
,	min_dt				datetime
,	max_dt				datetime
)
;

insert into
	@tbl
select
	row_number() over (order by recipe.recipe_code) as row_no

,	recipe.recipe_code
,	recipe.recipe_name
,	recipe.base_val

,	recipe.raw_type	
,	recipe.eqp_code	
,	recipe.table_name	
,	recipe.column_name	
,	@from_dt as from_dt
,	@to_dt as to_dt
,	ctq.eqp_code eqp_code_ctq
from
	dbo.tb_recipe_model model
join
	dbo.tb_recipe recipe
	on	model.group_code = recipe.group_code
left join
	dbo.tb_ctq ctq
	on	recipe.eqp_code = ctq.eqp_code
	and	recipe.table_name = ctq.table_name
	and	recipe.column_name = ctq.column_name
where
	model.eqp_code = @eqp_code
and	model.model_code = @model_code
and	model.operation_seq_no = @oper_seq_no
and len(recipe.table_name) > 0 and len(recipe.column_name) > 0
and recipe.judge_yn = 'Y'
;
	
declare @json nvarchar(max);

select @json = 
(
	select
		*
	from
		@tbl
	for json auto
)
;

insert into @tbl_calc
exec dbo.sp_raw_table_select_calc @json
;

select
	a.*
,	b.min_val		
,	b.max_val		
,	b.avg_val		
,	b.min_dt		
,	b.max_dt
,	case 
		when b.min_val < a.base_val or b.max_val > a.base_val then 'N' 
		else 'O' 
	end as judge
from
	@tbl a
join
	@tbl_calc b
	on a.row_no = b.row_no
order by
	recipe_code
;
