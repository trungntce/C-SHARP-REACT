declare @tbl table
(
	row_no			int
	
,	param_id		varchar(30)
,	param_name		nvarchar(100)
,	std				numeric(13, 3)
,	lcl				numeric(13, 3)
,	ucl				numeric(13, 3)
,	lsl				numeric(13, 3)
,	usl				numeric(13, 3)

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
	row_number() over (order by [param].param_id) as row_no

,	[param].param_id
,	[param].param_name
,	[param].std
,	[param].lcl
,	[param].ucl
,	[param].lsl
,	[param].usl

,	[param].raw_type	
,	[param].eqp_code	
,	[param].table_name	
,	[param].column_name	
,	@from_dt as from_dt
,	@to_dt as to_dt
,	ctq.eqp_code eqp_code_ctq
from
	dbo.tb_param_model model
join
	dbo.tb_param [param]
	on	model.group_code = param.group_code
left join
	dbo.tb_ctq ctq
	on	[param].eqp_code = ctq.eqp_code
	and	[param].table_name = ctq.table_name
	and	[param].column_name = ctq.column_name
where
	model.eqp_code = @eqp_code
and	model.model_code = @model_code
and	model.operation_seq_no = @oper_seq_no
and len([param].table_name) > 0 and len([param].column_name) > 0
and [param].judge_yn = 'Y'
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
		when b.min_val < a.lsl or b.max_val > a.usl then 'N'
		when b.min_val < a.lcl or b.max_val > a.ucl then 'C'
		else 'O' 
	end as judge
from
	@tbl a
join
	@tbl_calc b
	on a.row_no = b.row_no
order by 
	param_id
;
