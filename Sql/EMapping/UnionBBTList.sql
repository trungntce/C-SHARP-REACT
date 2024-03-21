declare @tbl_raw table
(
	workorder varchar(50)
,	panel_id varchar(50)
,	match_panel_id varchar(50)
,	panel_seq int
)
;

insert into
	@tbl_raw
select
	bbt.workorder
,	bbt.panel_id
,	bbt.match_panel_id
,	bbt.panel_seq
--,	case 
--		when proctime is null then dasinserttime 
--		else dateadd(ms, -(
--				isnull(panelprocesstime, 0) + 
--				isnull(timertime * 1000 / 2, 0) + 
--				isnull(gathertime * 1000, 0) + 
--				isnull(proctime * 1000, 0)), 
--				inserttime)
--	end as start_time
--,	dateadd(ms, -isnull(cast(panelprocesstime as int), 0), finishtime) as start_time
from
	dbo.tb_bbt bbt
where
	workorder = @workorder
;

with cte as
(
	select
		bbt.workorder
	,	isnull(bbt.match_panel_id, bbt.panel_id) as panel_id
	,	bbt.panel_seq
	,	pcs.piece_no
	,	count(*) as ng_cnt
	from
		@tbl_raw bbt
	join
		dbo.tb_bbt_piece pcs
		on	bbt.panel_id = pcs.panel_id
	join
		dbo.tb_code code
		on	pcs.judge = code.code_id
		and	code.codegroup_id = 'BBT_DEFECT_MPD'
	group by
		bbt.workorder, isnull(bbt.match_panel_id, bbt.panel_id), bbt.panel_seq, pcs.piece_no
)
select
	panel_id
,	cte.panel_seq
,	cte.piece_no
from
	cte
;
