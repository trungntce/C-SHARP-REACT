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

update
	dbo.tb_panel_interlock_issue
set
	issue_remark		= @issue_remark
,	issue_attach		= @issue_attach
,	issue_user			= @issue_user
,	issue_dt			= getdate()
from
	dbo.tb_panel_interlock_issue issue
join
	@tbl cte
	on	issue.interlock_group_key = cte.group_key
where
	corp_id				= @corp_id
and	fac_id				= @fac_id
;