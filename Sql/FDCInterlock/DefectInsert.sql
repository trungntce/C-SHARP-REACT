declare @tbl table
(
	fdc_row_no			int
,	workorder			varchar(50)
,	header_group_key	varchar(32)

,	handle_remark		nvarchar(200)
,	reference_code		varchar(40) 
);

with cte as 
(
	select
		*
	from
		openjson(@json)
		with
		(
			fdc_row_no			int '$.tableRowNo'
		,	workorder			varchar(50) '$.workorder'
		,	header_group_key	varchar(32) '$.headerGroupKey'

		,	handle_remark		nvarchar(200) '$.handleRemark'
		,	reference_code		varchar(40)  '$.referenceCode'
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
	dbo.tb_panel_defect
(
	corp_id
,	fac_id
,	roll_id
,	panel_id
,	defect_code
,	auto_yn
,	on_remark
,	on_update_user
,	on_dt
,	panel_interlock_id
,	fdc_row_no
)
select
	@corp_id
,	@fac_id
,	null
,	panel.panel_id
,	cte.reference_code
,	'N'
,	cte.handle_remark
,	@create_user
,	getdate()			
,	null
,	cte.fdc_row_no
from
	@tbl cte
join
	dbo.tb_panel_fdc panel
	on	cte.header_group_key = panel.header_group_key
;