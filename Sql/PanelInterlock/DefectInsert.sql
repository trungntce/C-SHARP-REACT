declare @tbl table
(
	group_key varchar(32)

,	panel_interlock_id int
,	roll_id varchar(40)
,	panel_id varchar(40)

,	judge_remark_first nvarchar(200)
,	judge_remark_second nvarchar(200)

,	reference_code_first varchar(40)
,	reference_code_second varchar(40)
);

declare @tbl_inserted table
(
	panel_interlock_id int
,	panel_defect_id int
);

with cte as 
(
	select
		grp.group_key

	,	interlock.panel_interlock_id
	,	interlock.roll_id
	,	interlock.panel_id

	,	grp.judge_remark_first
	,	grp.judge_remark_second
			
	,	grp.reference_code_first 
	,	grp.reference_code_second
	from
		openjson(@json)
		with
		(
			group_key varchar(32) '$.groupKey'

		,	judge_remark_first nvarchar(200) '$.judgeRemarkFirst'
		,	judge_remark_second nvarchar(200) '$.judgeRemarkSecond'

		,	reference_code_first varchar(40) '$.referenceCodeFirst'
		,	reference_code_second varchar(40) '$.referenceCodeSecond'
		) grp
	join
		dbo.tb_panel_interlock interlock
		on	grp.group_key = interlock.group_key
)
insert into 
	@tbl
select
	*
from
	cte
;

merge into
	dbo.tb_panel_defect
using
	@tbl cte
	on 1 = 0
	when not matched then
		insert
		(
			corp_id
		,	fac_id
		,	roll_id
		,	panel_id
		,	defect_code
		,	auto_yn
		,	on_remark
		,	on_update_user
		,	on_dt
		,	panel_interlock_id
		)
		values
		(
			@corp_id
		,	@fac_id
		,	cte.roll_id
		,	cte.panel_id
		,	isnull(cte.reference_code_second, cte.reference_code_first)
		,	'N'
		,	isnull(cte.judge_remark_second, cte.judge_remark_first)
		,	@create_user
		,	getdate()			
		,	cte.panel_interlock_id
		)
		output
			cte.panel_interlock_id
		,	inserted.panel_defect_id
		into
			@tbl_inserted
;

--update
--	dbo.tb_panel_interlock_process
--set
--	reference_id = panel_defect_id
--from
--	dbo.tb_panel_interlock_process process
--join
--	@tbl_inserted defect
--	on	process.panel_interlock_id = defect.panel_interlock_id
--	and process.step = @step
--;