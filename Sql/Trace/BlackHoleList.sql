with cte_blackhole as 
(
	select
		cmi.equip
	,	cmi.barcode
	,	max([4m].workorder) as workorder
	,	cmi.rg as ng_pcs_no
	,	cmi.fjd as ng_name
	,	max([4m].oper_seq_no) as oper_seq_no
	from
		raw_blackhole_cmi cmi
	join
		tb_panel_item item
		on item.panel_id = cmi.barcode
	join 
		tb_panel_4m [4m]
		on [4m].group_key = item.panel_group_key
	where 
		[4m].workorder = @workorder
	and [4m].oper_seq_no = @oper_seq_no
	group by 
		cmi.equip, cmi.barcode, cmi.rg, cmi.fjd
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
	and [4m].oper_seq_no = @oper_seq_no
	group by
		raw.equip, raw.barcode, raw.up1_judge, raw.up2_judge, raw.up3_judge, raw.down1_judge, raw.down2_judge, raw.down3_judge
), cte_ng as 
(
	select 
		barcode
	,	count(ng_pcs_no) as ng_cnt
	,	max(workorder) as workorder
	,	ng_name
	,	max(oper_seq_no) as oper_seq_no
	from 
		cte_blackhole
	group by 
		barcode, ng_name
), cte_thickness_ng as 
(
	select 
		workorder
	,	sum(ng_pnl_cnt) as ng_cnt
	,	'Thickness' as ng_name
	,	oper_seq_no
	from 
		cte_thickness
	group by 
		workorder, oper_seq_no
)
select 
	workorder
	, sum(ng_cnt) as ng_cnt
	, ng_name
	, max(oper_seq_no) as oper_seq_no
from 
	cte_ng
group by 
	workorder, ng_name
union all
select 
	workorder 
,	ng_cnt
,	ng_name
,	oper_seq_no
from 
	cte_thickness_ng
;