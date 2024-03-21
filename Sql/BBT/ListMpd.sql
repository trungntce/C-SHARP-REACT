with 
	cte_eqp as (select distinct [value] as eqp_code from openjson(@eqp_code) with ([value] varchar(50) '$.value')),
cte as
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
	and	mes_date between @from_dt and @to_dt
	and eqp_code in (select eqp_code from cte_eqp) -- @eqp_code
	and	workorder like '%' + @workorder + '%'
	and	vendor_code = @vendor_code
	and	vendor_name like '%' + @vendor_name + '%'
	and	item_code = @item_code
	and	item_name like '%' + @item_name + '%'
	and	model_code = @model_code
	and item_use_code = @app_code
	and item_code is not null
	and match_panel_id = @panel_id
), cte2 as
(
	select
		a.panel_id

	,	isnull(sum(case c.code_name	when '4W'				then 1 else 0 end), 0) as [4w_cnt]
	,	isnull(sum(case c.code_name	when 'AUX'				then 1 else 0 end), 0) as aux_cnt
	,	isnull(sum(case c.code_name	when 'Both'				then 1 else 0 end), 0) as both_cnt
	,	isnull(sum(case c.code_name	when 'C'				then 1 else 0 end), 0) as c_cnt
	,	isnull(sum(case c.code_name	when 'ER'				then 1 else 0 end), 0) as er_cnt
	,	isnull(sum(case c.code_name	when 'Open'				then 1 else 0 end), 0) as open_cnt
	,	isnull(sum(case c.code_name	when 'SPK'				then 1 else 0 end), 0) as spk_cnt
	,	isnull(sum(case c.code_name	when 'Short'			then 1 else 0 end), 0) as short_cnt

	,	isnull(sum(case a.judge		when 'OPEN uSH1' 		then 1 else 0 end), 0) as [raw_open ush1]
	,	isnull(sum(case a.judge		when 'ERROR' 			then 1 else 0 end), 0) as [raw_error]
	,	isnull(sum(case a.judge		when 'C' 				then 1 else 0 end), 0) as [raw_c]
	,	isnull(sum(case a.judge		when 'SHORTS' 			then 1 else 0 end), 0) as [raw_shorts]
	,	isnull(sum(case a.judge		when '4WNG uSH1' 		then 1 else 0 end), 0) as [raw_4wng ush1]
	,	isnull(sum(case a.judge		when '4WNG SHORTS' 		then 1 else 0 end), 0) as [raw_4wng shorts]
	,	isnull(sum(case a.judge		when 'OPEN uSH2' 		then 1 else 0 end), 0) as [raw_open ush2]
	,	isnull(sum(case a.judge		when '4WNG SPARK' 		then 1 else 0 end), 0) as [raw_4wng spark]
	,	isnull(sum(case a.judge		when 'SPARK' 			then 1 else 0 end), 0) as [raw_spark]
	,	isnull(sum(case a.judge		when 'OPEN SPARK' 		then 1 else 0 end), 0) as [raw_open spark]
	,	isnull(sum(case a.judge		when 'OPEN SHORT' 		then 1 else 0 end), 0) as [raw_open short]
	,	isnull(sum(case a.judge		when '4WNG SHORT' 		then 1 else 0 end), 0) as [raw_4wng short]
	,	isnull(sum(case a.judge		when 'AUX' 				then 1 else 0 end), 0) as [raw_aux]
	,	isnull(sum(case a.judge		when 'uSH1' 			then 1 else 0 end), 0) as [raw_ush1]
	,	isnull(sum(case a.judge		when 'OPEN SHORTS' 		then 1 else 0 end), 0) as [raw_open shorts]
	,	isnull(sum(case a.judge		when 'OPEN' 			then 1 else 0 end), 0) as [raw_open]
	,	isnull(sum(case a.judge		when '4WNG uSH2' 		then 1 else 0 end), 0) as [raw_4wng ush2]
	,	isnull(sum(case a.judge		when 'uSH2' 			then 1 else 0 end), 0) as [raw_ush2]
	,	isnull(sum(case a.judge		when 'SHORTS2' 			then 1 else 0 end), 0) as [raw_shorts2]
	,	isnull(sum(case a.judge		when 'SHORT' 			then 1 else 0 end), 0) as [raw_short]
	,	isnull(sum(case a.judge		when '4WNG' 			then 1 else 0 end), 0) as [raw_4wng]
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
), cte4 as
(
	select
		max(cte.create_dt)							as create_dt
	,	max(cte.start_dt)							as start_dt
	,	max(cte.end_dt)								as end_dt
	,	max(cte.mes_date)							as mes_date
	,	max(cte.panel_id)							as panel_id
	,	max(cte.match_panel_id)						as match_panel_id
	,	max(cte.eqp_code)							as eqp_code
	,	max(cte.eqp_name)							as eqp_name
	,	max(cte.workorder)							as workorder
	,	max(cte.vendor_code)						as vendor_code
	,	max(cte.vendor_name)						as vendor_name
	,	max(cte.item_code)							as item_code
	,	max(cte.item_name)							as item_name
	,	max(cte.item_use_code)						as app_code
	,	max(cte.[app_name])							as [app_name]
	,	max(cte.model_code)							as model_code
	,	count(*)									as panel_cnt
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

	,	isnull(sum(cte2.[raw_open ush1]), 0)		as [raw_open ush1]
	,	isnull(sum(cte2.[raw_error]), 0)			as [raw_error]	
	,	isnull(sum(cte2.[raw_c]), 0)				as [raw_c]	
	,	isnull(sum(cte2.[raw_shorts]), 0)			as [raw_shorts]	
	,	isnull(sum(cte2.[raw_4wng ush1]), 0)		as [raw_4wng ush1]	
	,	isnull(sum(cte2.[raw_4wng shorts]), 0)		as [raw_4wng shorts]	
	,	isnull(sum(cte2.[raw_open ush2]), 0)		as [raw_open ush2]	
	,	isnull(sum(cte2.[raw_4wng spark]), 0)		as [raw_4wng spark]	
	,	isnull(sum(cte2.[raw_spark]), 0)			as [raw_spark]	
	,	isnull(sum(cte2.[raw_open spark]), 0)		as [raw_open spark]	
	,	isnull(sum(cte2.[raw_open short]), 0)		as [raw_open short]	
	,	isnull(sum(cte2.[raw_4wng short]), 0)		as [raw_4wng short]	
	,	isnull(sum(cte2.[raw_aux]), 0)				as [raw_aux]	
	,	isnull(sum(cte2.[raw_ush1]), 0)				as [raw_ush1]	
	,	isnull(sum(cte2.[raw_open shorts]), 0)		as [raw_open shorts]	
	,	isnull(sum(cte2.[raw_open]), 0)				as [raw_open]	
	,	isnull(sum(cte2.[raw_4wng ush2]), 0)		as [raw_4wng ush2]	
	,	isnull(sum(cte2.[raw_ush2]), 0)				as [raw_ush2]	
	,	isnull(sum(cte2.[raw_shorts2]), 0)			as [raw_shorts2]	
	,	isnull(sum(cte2.[raw_short]), 0)			as [raw_short]	
	,	isnull(sum(cte2.[raw_4wng]), 0)				as [raw_4wng]
	from
		cte
	left join
		cte2
		on cte.panel_id = cte2.panel_id
	left join
		cte3
		on cte.panel_id = cte3.panel_id
	group by
		case when @groupby = 'EQP' then cte.eqp_code end
	,	case when @groupby != 'EQP' then vendor_code end
	,	case when @groupby != 'EQP' and (@groupby = 'PANEL' or @groupby = 'LOT' or @groupby = 'MODEL' or @groupby = 'ITEM') then cte.item_code end
	,	case when @groupby != 'EQP' and (@groupby = 'PANEL' or @groupby = 'LOT' or @groupby = 'MODEL') then cte.model_code end
	,	case when @groupby != 'EQP' and (@groupby = 'PANEL' or @groupby = 'LOT') then cte.workorder end
	,	case when @groupby != 'EQP' and (@groupby = 'PANEL') then cte.panel_id end
)
select
	cast((ng_cnt * 100) as decimal) / cast(total_cnt as decimal) ng_rate

,	cast(([4w_cnt] * 100)	as decimal) / cast(total_cnt as decimal) [4w_rate]
,	cast((aux_cnt * 100)	as decimal) / cast(total_cnt as decimal) [aux_rate]
,	cast((both_cnt * 100)	as decimal) / cast(total_cnt as decimal) [both_rate]
,	cast((c_cnt * 100)		as decimal) / cast(total_cnt as decimal) [c_rate]
,	cast((er_cnt * 100)		as decimal) / cast(total_cnt as decimal) [er_rate]
,	cast((open_cnt * 100)	as decimal) / cast(total_cnt as decimal) [open_rate]
,	cast((spk_cnt * 100)	as decimal) / cast(total_cnt as decimal) [spk_rate]
,	cast((short_cnt * 100)	as decimal) / cast(total_cnt as decimal) [short_rate]
,	*
from
	cte4
order by
	case when @orderby = 'DT' then create_dt end desc
,	case when @orderby = 'NG' then (ng_cnt * 100) / (ok_cnt + ng_cnt) end desc
;
