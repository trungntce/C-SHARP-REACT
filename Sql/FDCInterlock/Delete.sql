declare @tbl table
(
	table_row_no int
,	header_group_key	varchar(32)
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
		,	header_group_key	varchar(32) '$.headerGroupKey'
		)
)
insert into 
	@tbl
select
	*
from
	cte
;

delete from
	dbo.tb_panel_fdc
from
	dbo.tb_panel_fdc panel
join
	@tbl cte
	on	panel.header_group_key = cte.header_group_key
;

delete from
	dbo.tb_fdc_interlock_process
from
	dbo.tb_fdc_interlock_process process
join
	@tbl cte
	on	process.interlock_row_no = cte.table_row_no
where
	corp_id				= @corp_id
and	fac_id				= @fac_id
;

delete
	dbo.tb_fdc_interlock
from
	dbo.tb_fdc_interlock interlock
join
	@tbl cte
	on	interlock.table_row_no = cte.table_row_no
where
	corp_id				= @corp_id
and	fac_id				= @fac_id
;