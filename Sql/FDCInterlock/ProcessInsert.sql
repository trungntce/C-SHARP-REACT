declare @tbl table
(
	table_row_no int
);

with cte as 
(
	select
		*
	from
		openjson(@json)
		with
		(
			table_row_no int '$.tableRowNo'
		)
)
insert into 
	@tbl
select
	*
from
	cte
;

insert into
	dbo.tb_fdc_interlock_process
(
	corp_id
,	fac_id
,	interlock_row_no

,	handle_code
,	handle_remark
,	handle_attach
,	handle_user
,	handle_dt

,	reference_code
)
select
	@corp_id
,	@fac_id
,	table_row_no

,	@handle_code
,	@handle_remark
,	@handle_attach
,	@create_user
,	getdate()

,	@reference_code
from
	@tbl
;