with cte as 
(
	select
		roll_id 
	,	panel_id 
	from
		dbo.tb_roll_panel_map trpm 
	where
		trpm.roll_id = @roll_id
),cte2 as 
(
	select
		roll_id 
	,	panel_id
	,	rbc.pieces 
	,	rbc.fjd 
	,	rbc.rg
	from
		cte
	join
		dbo.raw_blackhole_cmi rbc 
		on cte.panel_id = rbc.barcode 
),cte_max as 
(
	select
		max(pieces) as pieces_cnt
	from
		cte
	join
		dbo.raw_blackhole_cmi rbc 
		on cte.panel_id = rbc.barcode
	where
		rbc.fjd = @fjd
),cte3 as 
(
	select 
		panel_id 
	,	max(pieces) as total_pieces
	,	count(*) as ng_cnt
	from 
		cte2
	group by panel_id, rg		
),cte4 as 
(
	select
		panel_id
	,	max(total_pieces) 	as total_pieces
	,   count(*) as ng_cnt
	from
		cte3
	group by panel_id
)
select
	cte.roll_id
,	cte.panel_id
,	isnull(total_pieces,0) as total_pieces
,	isnull(ng_cnt,0) as defect_cnt
from
	cte
left join
	cte4
	on cte.panel_id = cte4.panel_id
;


--with cte as 
--(
--	select
--	[4m].workorder
--,	[4m].group_key 
--,	item.panel_id 
--from
--	dbo.tb_panel_4m [4m]
--join
--	dbo.tb_panel_item item
--	on [4m].group_key = item.panel_group_key 
--where
--    [4m].workorder = @work_order
--	 and [4m].oper_code = 'V02010'
--),cte_cmi_rg as 
--(
--	select
--		barcode
--	,	rg
--	,	max(rbc.pieces) as pieces
--	from
--		raw_blackhole_cmi rbc 
--	where
--		rbc.barcode in (select panel_id from cte)
--		and rbc.fjd = @fjd
--	group by barcode, rg
--),cte_cmi as
--(
--       select
--                cmi.barcode
--        ,       max(cmi.pieces) as total_pieces
--        ,       count(*) as defect_cnt
--        from
--                cte_cmi_rg cmi
--        group by cmi.barcode
--)
--select
--	a.panel_id
--,	isnull(b.total_pieces,0) as total_pieces
--,	isnull(b.defect_cnt,0) as defect_cnt
--from
--	cte a
--left join 
--	cte_cmi b
--	on a.panel_id = b.barcode
--;


--with cte as 
--(
--	select
--		DISTINCT
--		[4m].workorder
--	,	[4m].group_key
--	from
--		dbo.tb_panel_4m [4m]
--	join
--		dbo.tb_panel_item tpi
--		on [4m].group_key = tpi.panel_group_key
--	where
--		[4m].workorder = @work_order
--		and [4m].oper_code = 'V02010'
--),cte2 as 
--(
--	select
--		a.workorder
--	,	tpi.panel_id 
--	from
--		cte a
--	join
--		dbo.tb_panel_item tpi 
--		on a.group_key = tpi.panel_group_key 
--	group by workorder, panel_id
--),cte3 as 
--(
--	select
--		cte2.*
--	,	max(rbc.pieces) as total_pieces
--	,	rbc.rg
--	from
--		cte2
--	join
--		dbo.raw_blackhole_cmi rbc 
--		on cte2.panel_id = rbc.barcode 
--	where
--		rbc.fjd = @fjd
--	group by workorder, panel_id, rg
--)
--select
--	workorder 
--,	panel_id
--,	count(*) as ng_cnt
--,	max(total_pieces) as total_cnt
--from
--	cte3
--group by workorder ,panel_id