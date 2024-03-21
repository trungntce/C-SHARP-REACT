declare @tbl table
(
	group_key varchar(32)
,	judge_code char(1)
);

with cte as 
(
	select
		group_key
	,	isnull(judge_code_second, judge_code_first) as judge_code -- ������ ��� settleCode �� judgeCode �� ����ϱ�����
	from
		openjson(@json)
		with
		(
			group_key varchar(32) '$.groupKey'
		,	judge_code_first char(1) '$.judgeCodeFirst'
		,	judge_code_second char(1) '$.judgeCodeSecond'
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
	settle_code			= isnull(@settle_code, cte.judge_code) -- ������ ��� settleCode �� judgeCode �� ���
,	settle_remark		= @settle_remark
,	settle_attach		= @settle_attach
,	settle_user			= @settle_user
,	settle_dt			= getdate()

--,	reference_code		= @reference_code
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