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

insert into
	dbo.tb_panel_interlock
(
	corp_id
,	fac_id
,	roll_id
,	panel_id
,	item_key
,	interlock_code
,	auto_yn
,	on_remark
,	on_update_user
,	on_dt
)
select
	@corp_id
,	@fac_id
,	null
,	panel_id
,	item_key
,	@interlock_code
,	'N'
,	@remark
,	@create_user
,	getdate()
from
	@tbl
;

update
	dbo.tb_panel_realtime
set
	interlock_yn = 'Y'
from
	dbo.tb_panel_realtime [real]
join
	@tbl cte
	on	[real].panel_id = cte.panel_id
;