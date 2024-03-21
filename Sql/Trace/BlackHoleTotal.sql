with cte_blackhole as 
(
	select
		 	raw.equip
	, 		raw.barcode
	, 		max([4m].workorder) as workorder
	, 		max([4m].oper_seq_no) as oper_seq_no
	, 		max(raw.pieces) as pcs_total
	,		raw.rg as ng_pcs_no
	from
		raw_blackhole_cmi raw
	join
		tb_panel_item item
		on item.panel_id = raw.barcode
	join 
		tb_panel_4m [4m]
		on [4m].group_key = item.panel_group_key
	where 
		[4m].workorder = @workorder
	group by 
		raw.equip, raw.barcode, raw.rg, raw.fjd
), cte_thickness as 
(
	select
		raw.equip
	,	raw.barcode 
	, 	max([4m].workorder) as workorder
	, 	max([4m].oper_seq_no) as oper_seq_no
	, 	count(raw.equip) as pnl_total
	,	case when raw.up1_judge = 'NG' or raw.up2_judge = 'NG' or raw.up3_judge = 'NG' or
			raw.down1_judge = 'NG' or raw.down2_judge = 'NG' or raw.down3_judge = 'NG'	then 1
			else 0 end as ng_pnl_cnt
	from
		raw_blackhole_cmi_thickness raw
	join
		tb_panel_item item
		on item.panel_id = raw.barcode
	join 
		tb_panel_4m [4m]
		on [4m].group_key = item.panel_group_key
	where 
		[4m].workorder = @workorder
	group by
		raw.equip, raw.barcode, raw.up1_judge, raw.up2_judge, raw.up3_judge, raw.down1_judge, raw.down2_judge, raw.down3_judge
), cte_ng as 
(
	select 
		barcode
		, count(ng_pcs_no) as ng_cnt
		, max(pcs_total) as pcs_total
		, max(workorder) as workorder
		, max(oper_seq_no) as oper_seq_no
	from 
		cte_blackhole
	group by 
		barcode
), cte_pcs_ng as 
(
	select 
		workorder
		, oper_seq_no
		, sum(ng_cnt) as ng_cnt
		, sum(pcs_total) as pcs_total
	from 
		cte_ng
	group by 
		workorder, oper_seq_no
)
select 
	cte_pcs_ng.workorder
,	cte_pcs_ng.oper_seq_no
,	max(ng_cnt) as ng_pcs_cnt
,	max(pcs_total) as blackhole_pcs_total
,	count(pnl_total) as blackhole_pnl_total
,	sum(ng_pnl_cnt) as ng_pnl_cnt
from 
	cte_pcs_ng
join
	cte_thickness
	on cte_thickness.workorder = cte_pcs_ng.workorder
group by
	cte_pcs_ng.workorder, cte_pcs_ng.oper_seq_no
;