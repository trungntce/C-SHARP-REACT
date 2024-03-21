with cte_cmi as
(
	select
		fjd as ng_type
	,	[raw].barcode as panel_id
	,	max([raw].pieces) as pcs_per_pnl
	,	[raw].rg as piece_no
	from
		raw_blackhole_cmi [raw]
	join
		dbo.tb_panel_realtime realtime
		on	[raw].barcode = realtime.panel_id
		and realtime.workorder = @workorder
	group by
		realtime.workorder, barcode, fjd, rg
)
select
	*
from
	cte_cmi
;