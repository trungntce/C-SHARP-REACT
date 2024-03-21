declare @tbl table
(
	workorder			varchar(50)
,	header_group_key	varchar(32)

,	handle_remark		nvarchar(200)
);

with cte as 
(
	select
		*
	from
		openjson(@json)
		with
		(
			workorder			varchar(50) '$.workorder'
		,	header_group_key	varchar(32) '$.headerGroupKey'

		,	handle_remark		nvarchar(200) '$.handleRemark'
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
	dbo.tb_workorder_interlock
set
	off_remark		= cte.handle_remark
,	off_update_user	= @update_user
,	off_dt			= getdate()
from
	dbo.tb_workorder_interlock interlock
join
	@tbl cte
	on	interlock.header_group_key = cte.header_group_key
;

declare @panels varchar(max);

select
	@panels = string_agg(panel.panel_id, ',')
from
	@tbl cte
join
	dbo.tb_panel_fdc panel
	on	panel.header_group_key = cte.header_group_key
;

-- 판넬 전부 확인해 인터락이 없는 경우만 realtime 업데이트 하도록 변경
exec dbo. sp_panel_realtime_update @panels;