with cte_cmi as
(
	select
		fjd as ng_type
	,	barcode
	,	max([raw].pieces) as pcs_per_pnl
	,	[raw].rg as piece_no
	from
		raw_blackhole_cmi [raw]
	join
		dbo.tb_panel_realtime realtime
		on	[raw].barcode = realtime.panel_id
		and realtime.workorder = @workorder
		and [raw].barcode = @panel_id
	group by
		realtime.workorder, barcode, fjd, rg
), cte_cmi_ng as 
(
	select 
		ng_type
	,	piece_no
	,	string_agg(barcode, ',') as panel_id_list
	,	count(piece_no) as ng_cnt
	,	max(pcs_per_pnl) as pcs_per_pnl
	from 
		cte_cmi
	group by 
		ng_type, piece_no
)
select
	*
from
	cte_cmi_ng
;