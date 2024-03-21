declare @tbl table
(
	workorder varchar(50)
,	group_key varchar(32)

,	judge_remark_first nvarchar(200)
,	judge_remark_second nvarchar(200)
);

with cte as 
(
	select
		*
	from
		openjson(@json)
		with
		(
			workorder varchar(50) '$.workorder'
		,	group_key varchar(32) '$.groupKey'

		,	judge_remark_first nvarchar(200) '$.judgeRemarkFirst'
		,	judge_remark_second nvarchar(200) '$.judgeRemarkSecond'
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
	dbo.tb_panel_4m_interlock
set
	off_remark		= isnull(cte.judge_remark_second, cte.judge_remark_first)
,	off_update_user	= @update_user
,	off_dt			= getdate()
from
	dbo.tb_panel_4m_interlock interlock
join
	@tbl cte
	on	interlock.group_key = cte.group_key
;

update
	dbo.tb_workorder_interlock
set
	off_remark		= isnull(cte.judge_remark_second, cte.judge_remark_first)
,	off_update_user	= @update_user
,	off_dt			= getdate()
from
	dbo.tb_workorder_interlock interlock
join
	@tbl cte
	on	interlock.workorder = cte.workorder
;

update
	dbo.tb_panel_interlock
set
	off_remark		= isnull(cte.judge_remark_second, cte.judge_remark_first)
,	off_update_user	= @update_user
,	off_dt			= getdate()
from
	dbo.tb_panel_interlock interlock
join
	@tbl cte
	on	interlock.group_key = cte.group_key
;

update
	dbo.tb_panel_realtime
set
	interlock_yn = 'N'
from
	dbo.tb_panel_realtime [real]
join
	dbo.tb_panel_interlock interlock
	on	[real].panel_id = interlock.panel_id
join
	@tbl cte
	on	interlock.group_key = cte.group_key
;