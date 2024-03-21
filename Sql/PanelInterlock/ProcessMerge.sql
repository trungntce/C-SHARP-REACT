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

merge into dbo.tb_panel_interlock_process as target_tbl
using
(
	select
		@corp_id		as corp_id
	,	@fac_id			as fac_id
	,	group_key		as interlock_group_key
	,	@step			as step

	,	null			as roll_id
	,	null			as panel_id

	,	@judge_code		as judge_code
	,	@judge_method	as judge_method
	,	@judge_remark	as judge_remark
	,	@judge_attach	as judge_attach
	,	@judge_user		as judge_user
	,	getdate()		as judge_dt

	,	@reference_code	as reference_code
	from
		@tbl
) cte
on 
(
	target_tbl.corp_id				= cte.corp_id
and	target_tbl.fac_id				= cte.fac_id
and	target_tbl.interlock_group_key	= cte.interlock_group_key
and	target_tbl.step					= cte.step
)
when matched then
    update set
		target_tbl.judge_code			= cte.judge_code
	,	target_tbl.judge_method			= cte.judge_method
	,	target_tbl.judge_remark			= cte.judge_remark
	,	target_tbl.judge_attach			= cte.judge_attach
	,	target_tbl.judge_user			= cte.judge_user
	,	target_tbl.judge_dt				= cte.judge_dt

	,	target_tbl.reference_code		= cte.reference_code
when not matched then
    insert 
    (
		corp_id
	,	fac_id
	,	interlock_group_key
	,	step

	,	roll_id
	,	panel_id

	,	judge_code
	,	judge_method
	,	judge_remark
	,	judge_attach
	,	judge_user
	,	judge_dt
	
	,	reference_code
    )
    values
    (
		cte.corp_id
	,	cte.fac_id
	,	cte.interlock_group_key
	,	cte.step

	,	cte.roll_id
	,	cte.panel_id

	,	cte.judge_code
	,	cte.judge_method
	,	cte.judge_remark
	,	cte.judge_attach
	,	cte.judge_user
	,	cte.judge_dt
	
	,	cte.reference_code
    )
;