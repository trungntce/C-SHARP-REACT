declare @tbl table
(
	group_key varchar(32)
);

with cte as 
(
	select
		*
	from
		openjson(@json)
		with
		(
			group_key varchar(32) '$.groupKey'
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
	dbo.tb_panel_interlock_issue
from
	dbo.tb_panel_interlock_issue issue
join
	@tbl cte
	on	issue.interlock_group_key = cte.group_key
where
	corp_id				= @corp_id
and	fac_id				= @fac_id
;

delete from
	dbo.tb_panel_interlock_process
from
	dbo.tb_panel_interlock_process process
join
	@tbl cte
	on	process.interlock_group_key = cte.group_key
where
	corp_id				= @corp_id
and	fac_id				= @fac_id
;

update
	dbo.tb_panel_interlock
set
	group_key = null
from
	dbo.tb_panel_interlock interlock
join
	@tbl cte
	on	interlock.group_key = cte.group_key
where
	corp_id				= @corp_id
and	fac_id				= @fac_id
;

update
	dbo.tb_panel_4m_interlock
set
	group_key = null
from
	dbo.tb_panel_4m_interlock interlock
join
	@tbl cte
	on	interlock.group_key = cte.group_key
where
	corp_id				= @corp_id
and	fac_id				= @fac_id
;