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
	dbo.tb_panel_interlock_process
set
	judge_code			= @judge_code
,	judge_method		= @judge_method
,	judge_remark		= @judge_remark
,	judge_attach		= @judge_attach
,	judge_user			= @judge_user
,	judge_dt			= getdate()

,	reference_code		= @reference_code
from
	dbo.tb_panel_interlock_process process
join
	@tbl cte
	on	process.interlock_group_key = cte.group_key
where
	corp_id				= @corp_id
and	fac_id				= @fac_id
and	step				= @step
;