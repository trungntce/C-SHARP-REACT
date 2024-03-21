declare @tbl table
(
	panel_id varchar(40)
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
	,	defect.panel_defect_id
	,	row_number() over (partition by defect.panel_id order by defect.panel_defect_id desc) as row_no
	from
		@tbl cte
	join
		dbo.tb_panel_defect defect
		on	cte.panel_id = defect.panel_id
)
update
	dbo.tb_panel_defect
set
	off_remark = @remark
,	off_update_user = @update_user
,	off_dt = getdate()
from
	dbo.tb_panel_defect defect
join
	cte
	on	defect.panel_id = cte.panel_id
	and	defect.panel_defect_id = cte.panel_defect_id
where
	cte.row_no = 1
;

update
	dbo.tb_panel_realtime
set
	defect_yn = 'N'
from
	dbo.tb_panel_realtime [real]
join
	@tbl cte
	on	[real].panel_id = cte.panel_id
;