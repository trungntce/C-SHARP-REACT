with cte as 
(
	select
		roll_id 
	,	panel_id 
	from
		dbo.tb_roll_panel_map trpm
	where
		roll_id = @roll_id
),cte2 as 
(
	select
		cte.roll_id
	,	cte.panel_id
	,	rbcm.*
	from
		cte
	join
		dbo.raw_blackhole_cmi_master rbcm 
		on cte.panel_id = rbcm.barcode 
	where
		rbcm.fjd = @fjd
),cte3 as 
(
	select
		roll_id 
	,	panel_id 
	,	min(lsldata) as lsldata
	,	max(usldata) as usldata
	,	min(mindata) as mindata
	,	max(maxdata) as maxdata
	,	avg(averagedata) as averagedata
	from
		cte2
	group by roll_id,panel_id 
)
select 
	trpm2.roll_id 
,	trpm2.panel_id 
,	isnull(lsldata,0) as lsl_data
,	isnull(usldata,0) as usl_data
,	isnull(mindata,0) as min_data
,	isnull(maxdata,0) as max_data
,	isnull(averagedata,0) as avg_data 
from
	dbo.tb_roll_panel_map trpm2 
left join
	cte3
	on trpm2.panel_id = cte3.panel_id and trpm2.roll_id = cte3.roll_id
where
	trpm2.roll_id = @roll_id
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
--     [4m].workorder = @work_order
--	 and [4m].oper_code = 'V02010'
--),cte_minmax as 
--(
--	select
--		mas.barcode 
--	,	max(mas.lsldata) as lsl_data
--	,	max(mas.usldata) as usl_data
--	,	min(mas.mindata) as min_data
--	,	max(mas.maxdata) as max_data
--	,	avg(mas.averagedata) as avg_data
--	,	min(mas.[time]) as [time]
--	from
--		dbo.raw_blackhole_cmi_master mas
--	where
--		mas.barcode in (select panel_id from cte)
--		and mas.fjd = @fjd
--	group by mas.barcode 
--)
--select
--	b.[time]
--,	a.*
--,	b.barcode
--,	isnull(lsl_data,0) as lsl_data
--,	isnull(usl_data,0) as usl_data
--,	isnull(min_data,0) as min_data
--,	isnull(max_data,0) as max_data
--,	isnull(avg_data,0) as avg_data
--from
--	cte a
--left join
--	cte_minmax b 
--	on a.panel_id = b.barcode
--;



--select
--	[4m].workorder
--,	[4m].create_dt 
--,	b.panel_id 
--,	bm.mindata 
--,	bm.averagedata 
--,	bm.maxdata 
--,	bm.lsldata
--,	bm.usldata
--from
--	tb_panel_4m [4m]
--join
--	dbo.tb_panel_item b
--	on [4m].group_key = b.panel_group_key
--join
--	dbo.raw_blackhole_cmi_master bm
--	on b.panel_id = bm.barcode
--where
--	[4m].oper_code = 'V02010'
--	and [4m].workorder = @work_order
--	and bm.fjd = @fjd
--;