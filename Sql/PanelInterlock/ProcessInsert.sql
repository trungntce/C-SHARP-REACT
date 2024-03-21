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
	dbo.tb_panel_interlock_process
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
select
	@corp_id
,	@fac_id
,	group_key
,	@step

,	null
,	null

,	@judge_code
,	@judge_method
,	@judge_remark
,	@judge_attach
,	@judge_user
,	getdate()

,	@reference_code
from
	@tbl
;