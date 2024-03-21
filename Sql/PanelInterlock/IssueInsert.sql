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

insert into
	dbo.tb_panel_interlock_issue
(
	corp_id
,	fac_id
,	interlock_group_key

,	issue_remark
,	issue_attach
,	issue_user
,	issue_dt
)
select
	@corp_id
,	@fac_id
,	group_key

,	@issue_remark
,	@issue_attach
,	@issue_user
,	getdate()
from
	@tbl
;
