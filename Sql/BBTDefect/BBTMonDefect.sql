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
	,	match_panel_id
	from
		dbo.tb_bbt a
	where
		corp_id = @corp_id
	and	fac_id = @fac_id
	and	mes_date >= dateadd(month, -3, dateadd(month, datediff(month, 0, @to_dt), 0))
	and eqp_code = @eqp_code
	and	model_code = @model_code
	and model_description like '%' + @model_name + '%'
	and item_use_code = @app_code
	and item_code is not null
), cte2 as 
(
	select
		a.panel_id

	,	isnull(sum(case c.code_name	when '4W'		then 1 else 0 end), 0) as [4w_cnt]
	,	isnull(sum(case c.code_name	when 'AUX'		then 1 else 0 end), 0) as aux_cnt
	,	isnull(sum(case c.code_name	when 'Both'		then 1 else 0 end), 0) as both_cnt
	,	isnull(sum(case c.code_name	when 'C'		then 1 else 0 end), 0) as c_cnt
	,	isnull(sum(case c.code_name	when 'ER'		then 1 else 0 end), 0) as er_cnt
	,	isnull(sum(case c.code_name	when 'Open'		then 1 else 0 end), 0) as open_cnt
	,	isnull(sum(case c.code_name	when 'SPK'		then 1 else 0 end), 0) as spk_cnt
	,	isnull(sum(case c.code_name	when 'Short'	then 1 else 0 end), 0) as short_cnt

	from
		dbo.tb_bbt_piece a
	join
		dbo.tb_code c
		on	a.judge = c.code_id
		and c.codegroup_id = 'BBT_DEFECT_MPD'
	where
		a.panel_id in (select cte.panel_id from cte)
	group by
		a.panel_id
), cte3 as 
(
	select
		max(cte.create_dt)							as create_dt
	,	max(cte.mes_date)							as mes_date
	,	max(cte.panel_id)							as panel_id
	,	max(cte.match_panel_id)						as match_panel_id
	,	max(cte.eqp_code)							as eqp_code
	,	max(cte.eqp_name)							as eqp_name
	,	max(cte.workorder)							as workorder
	,	isnull(sum(cte.ok_cnt), 0)					as ok_cnt
	,	isnull(sum(cte.ng_cnt), 0)					as ng_cnt
	,	isnull(sum(cte.ok_cnt + cte.ng_cnt), 0)		as total_cnt

	,	isnull(sum(cte2.[4w_cnt]), 0)				as [4w_cnt]
	,	isnull(sum(cte2.aux_cnt), 0)				as aux_cnt
	,	isnull(sum(cte2.both_cnt), 0)				as both_cnt
	,	isnull(sum(cte2.c_cnt), 0)					as c_cnt
	,	isnull(sum(cte2.er_cnt), 0)					as er_cnt
	,	isnull(sum(cte2.open_cnt), 0)				as open_cnt
	,	isnull(sum(cte2.spk_cnt), 0)				as spk_cnt
	,	isnull(sum(cte2.short_cnt), 0)				as short_cnt

	from
		cte
	left join
		cte2
		on cte.panel_id = cte2.panel_id
	group by
		case when 'LOT' = 'EQP' then cte.eqp_code end
	,	case when 'LOT' != 'EQP' then vendor_code end
	,	case when 'LOT' != 'EQP' and ('LOT' = 'PANEL' or 'LOT' = 'LOT' or 'LOT' = 'MODEL' or 'LOT' = 'ITEM') then cte.item_code end
	,	case when 'LOT' != 'EQP' and ('LOT' = 'PANEL' or 'LOT' = 'LOT' or 'LOT' = 'MODEL') then cte.model_code end
	,	case when 'LOT' != 'EQP' and ('LOT' = 'PANEL' or 'LOT' = 'LOT') then cte.workorder end
	,	case when 'LOT' != 'EQP' and ('LOT' = 'PANEL') then cte.panel_id end
)
select 
	cast(((sum([4w_cnt]) + sum(aux_cnt) + sum(both_cnt) + sum(c_cnt) + sum(er_cnt) + sum(open_cnt) + sum(spk_cnt) + sum(short_cnt) ) * 100) as decimal) / cast(sum(total_cnt) as decimal) total_ng
,	convert(nvarchar(10), month(dateadd(month, datediff(month, 0, mes_date), 0)), 30) + 'M' as date_mwd
,	cast((sum([4w_cnt]) * 100)	as decimal) / cast(sum(total_cnt) as decimal) [4w]
,	cast((sum(aux_cnt) * 100)	as decimal) / cast(sum(total_cnt) as decimal) [aux]
,	cast((sum(both_cnt) * 100)	as decimal) / cast(sum(total_cnt) as decimal) [both]
,	cast((sum(c_cnt) * 100)		as decimal) / cast(sum(total_cnt) as decimal) [c]
,	cast((sum(er_cnt) * 100)	as decimal) / cast(sum(total_cnt) as decimal) [er]
,	cast((sum(open_cnt) * 100)	as decimal) / cast(sum(total_cnt) as decimal) [open]
,	cast((sum(spk_cnt) * 100)	as decimal) / cast(sum(total_cnt) as decimal) [spk]
,	cast((sum(short_cnt) * 100)	as decimal) / cast(sum(total_cnt) as decimal) [short]
from
	cte3
group by 
	dateadd(month, datediff(month, 0, mes_date), 0)
order by
	dateadd(month, datediff(month, 0, mes_date), 0)
;