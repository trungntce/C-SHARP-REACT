with cte as
(
	select
		group_key
	,	panel_seq
	,	max(panel_id)	as panel_id
	,	max(item_key)	as item_key
	,	case min
		(
			case 
				when judge = 'N' then 1
				when judge = 'C' then 2
			end
		)	when 1 then 'N'
			when 2 then 'C'
			else 'O'
		end
		as	judge
	,	sum(case judge when 'O' then 1 else 0 end) as ok_cnt
	,	sum(case judge when 'C' then 1 else 0 end) as chk_cnt
	,	sum(case judge when 'N' then 1 else 0 end) as ng_cnt
	,	max(raw_dt)	as raw_dt
	from
		dbo.tb_panel_param_cuplating
	where
		group_key = @group_key
	group by
		group_key, panel_seq
)
select
	cte.*

,	item.create_dt		as panel_create_dt

,	d001.std			as d001_std
,	d001.lcl			as d001_lcl
,	d001.ucl			as d001_ucl
,	d001.lsl			as d001_lsl	--추가
,	d001.usl			as d001_usl	--추가
,	d001.eqp_min_val	as d001_min
,	d001.eqp_max_val	as d001_max
,	d001.eqp_avg_val	as d001_avg
,	d001.judge			as d001_judge

,	d002.std			as d002_std
,	d002.lcl			as d002_lcl
,	d002.ucl			as d002_ucl
,	d002.eqp_min_val	as d002_min
,	d002.lsl			as d002_lsl	--추가
,	d002.usl			as d002_usl	--추가
,	d002.eqp_max_val	as d002_max
,	d002.eqp_avg_val	as d002_avg
,	d002.judge			as d002_judge

,	d003.std			as d003_std
,	d003.lcl			as d003_lcl
,	d003.ucl			as d003_ucl
,	d003.lsl			as d003_lsl	--추가
,	d003.usl			as d003_usl	--추가
,	d003.eqp_min_val	as d003_min
,	d003.eqp_max_val	as d003_max
,	d003.eqp_avg_val	as d003_avg
,	d003.judge			as d003_judge

,	d004.std			as d004_std
,	d004.lcl			as d004_lcl
,	d004.ucl			as d004_ucl
,	d004.lsl			as d004_lsl --추가
,	d004.usl			as d004_usl --추가
,	d004.eqp_min_val	as d004_min
,	d004.eqp_max_val	as d004_max
,	d004.eqp_avg_val	as d004_avg
,	d004.judge			as d004_judge

,	d005.std			as d005_std
,	d005.lcl			as d005_lcl
,	d005.ucl			as d005_ucl
,	d005.lsl			as d005_lsl --추가
,	d005.usl			as d005_usl --추가
,	d005.eqp_min_val	as d005_min
,	d005.eqp_max_val	as d005_max
,	d005.eqp_avg_val	as d005_avg
,	d005.judge			as d005_judge

,	d006.std			as d006_std
,	d006.lcl			as d006_lcl
,	d006.ucl			as d006_ucl
,	d006.lsl			as d006_lsl	--추가
,	d006.usl			as d006_usl	--추가
,	d006.eqp_min_val	as d006_min
,	d006.eqp_max_val	as d006_max
,	d006.eqp_avg_val	as d006_avg
,	d006.judge			as d006_judge
from
	cte
join
	dbo.tb_panel_param_cuplating d001
	on	cte.panel_seq = d001.panel_seq
	and d001.column_name = 'd001'
join
	dbo.tb_panel_param_cuplating d002
	on	cte.panel_seq = d002.panel_seq
	and d002.column_name = 'd002'
join
	dbo.tb_panel_param_cuplating d003
	on	cte.panel_seq = d003.panel_seq
	and d003.column_name = 'd003'
join
	dbo.tb_panel_param_cuplating d004
	on	cte.panel_seq = d004.panel_seq
	and d004.column_name = 'd004'
join
	dbo.tb_panel_param_cuplating d005
	on	cte.panel_seq = d005.panel_seq
	and d005.column_name = 'd005'
join
	dbo.tb_panel_param_cuplating d006
	on	cte.panel_seq = d006.panel_seq
	and d006.column_name = 'd006'
left join
	dbo.tb_panel_item item
	on	cte.item_key = item.item_key
where
	d001.group_key = @group_key
and d002.group_key = @group_key
and d003.group_key = @group_key
and d004.group_key = @group_key
and d005.group_key = @group_key
and d006.group_key = @group_key
order by
	panel_seq
;