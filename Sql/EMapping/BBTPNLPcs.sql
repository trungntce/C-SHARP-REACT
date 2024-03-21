with cte as
(
	select
		panel_id
	,	panel_seq
	,	mes_date
	,	workorder
	,	eqp_code
	,	eqp_description as eqp_name
	,	vendor_code
	,	vendor_name
	,	item_code
	,	item_name
	,	item_use_code
	,	item_use_description as [app_name]
	,	model_code
	,	start_dt
	,	end_dt
	,	ok_cnt
	,	ng_cnt
	,	create_dt
	from
		dbo.tb_bbt a
	where
		workorder = @workorder
	and panel_seq = @panel_seq
	and item_code is not null
),
cte2 as
(
	select
		a.panel_id
	,	a.piece_no
    ,   isnull(sum(case c.code_name     when '4W'           then 1 else 0 end), 0) as [4w_cnt]
    ,   isnull(sum(case c.code_name     when 'AUX'          then 1 else 0 end), 0) as [aux_cnt]
    ,   isnull(sum(case c.code_name     when 'Both'         then 1 else 0 end), 0) as [both_cnt]
    ,   isnull(sum(case c.code_name     when 'C'            then 1 else 0 end), 0) as [c_cnt]
    ,   isnull(sum(case c.code_name     when 'ER'           then 1 else 0 end), 0) as [er_cnt]
    ,   isnull(sum(case c.code_name     when 'Open'         then 1 else 0 end), 0) as [open_cnt]
    ,   isnull(sum(case c.code_name     when 'SPK'          then 1 else 0 end), 0) as [spk_cnt]
    ,   isnull(sum(case c.code_name     when 'Short'        then 1 else 0 end), 0) as [short_cnt]
	from
		dbo.tb_bbt_piece a
	join
		dbo.tb_code c
		on	a.judge = c.code_id
		and c.codegroup_id = 'BBT_DEFECT_MPD'
	where
		a.panel_id in (select cte.panel_id from cte)
	and	a.judge = @judge_name
	group by
		a.panel_id, piece_no
), 
cte4 as
(
	select
		max(cte.create_dt)								as create_dt
	,	max(cte.mes_date)								as mes_date
	,	max(cte.panel_id)								as panel_id
	,	max(cte2.piece_no)								as piece_no
	,	max(cte.eqp_code)								as eqp_code
	,	max(cte.eqp_name)								as eqp_name
	,	max(cte.workorder)								as workorder
	,	max(cte.vendor_code)							as vendor_code
	,	max(cte.vendor_name)							as vendor_name
	,	max(cte.item_code)								as item_code
	,	max(cte.item_name)								as item_name
	,	max(cte.item_use_code)							as app_code
	,	max(cte.[app_name])								as [app_name]
	,	max(cte.model_code)								as model_code

	,	isnull(sum(cte2.[4w_cnt]), 0)					as [4w_cnt]
	,	isnull(sum(cte2.[aux_cnt]), 0)					as [aux_cnt]
	,	isnull(sum(cte2.[both_cnt]), 0)					as [both_cnt]
	,	isnull(sum(cte2.[c_cnt]), 0)					as [c_cnt]
	,	isnull(sum(cte2.[er_cnt]), 0)					as [er_cnt]
	,	isnull(sum(cte2.[open_cnt]), 0)					as [open_cnt]
	,	isnull(sum(cte2.[spk_cnt]), 0)					as [spk_cnt]
	,	isnull(sum(cte2.[short_cnt]), 0)				as [short_cnt]
	from
		cte
	join
		cte2
		on	cte.panel_id = cte2.panel_id
	group by
		cte2.piece_no
)
select
	*
from
	cte4
;
