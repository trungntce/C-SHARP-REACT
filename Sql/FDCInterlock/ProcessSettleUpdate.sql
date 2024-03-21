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

update
	dbo.tb_fdc_interlock_process
set
	settle_remark		= @settle_remark
,	settle_attach		= @settle_attach
,	settle_user			= @update_user
,	settle_dt			= getdate()
from
	dbo.tb_fdc_interlock_process process
join
	@tbl cte
	on	process.interlock_row_no = cte.table_row_no
where
	corp_id				= @corp_id
and	fac_id				= @fac_id
;