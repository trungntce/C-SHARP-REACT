declare @tbl table
(
	panel_id varchar(40)
,	item_key varchar(30)
);

with cte as 
(
	select
		*
	from
		openjson(@json)
		with
		(
			panel_id varchar(40) '$.panelId'
		,	item_key varchar(30) '$.itemKey'
		)
)
insert into 
	@tbl
select
	*
from
	cte
;

with cte as
(
	select
		cte.*
	,	interlock.panel_interlock_id
	,	row_number() over (partition by interlock.panel_id order by interlock.panel_interlock_id desc) as row_no
	from
		@tbl cte
	join
		dbo.tb_panel_interlock interlock
		on	cte.panel_id = interlock.panel_id
)
update
	dbo.tb_panel_interlock
set
	off_remark = @remark
,	off_update_user = @update_user
,	off_dt = getdate()
from
	dbo.tb_panel_interlock interlock
join
	cte
	on	interlock.panel_id = cte.panel_id
	and	interlock.panel_interlock_id = cte.panel_interlock_id
where
	cte.row_no = 1
;

update
	dbo.tb_panel_realtime
set
	interlock_yn = 'N'
from
	dbo.tb_panel_realtime [real]
join
	@tbl cte
	on	[real].panel_id = cte.panel_id
;