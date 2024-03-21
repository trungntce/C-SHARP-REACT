with cte as
(
	select distinct [value] from string_split(@workorder_list, ',')
	union all -- @workorder_list, @panel_id
	--select workorder from dbo.tb_panel_realtime where panel_id = @panel_id
	select workorder from tb_panel_4m where oper_code = 'V02010' and group_key in (select panel_group_key from tb_panel_item where panel_id = @panel_id)
), cte_max_blackhole as 
(
        select
			[master].fjd as ng_type
        ,	[4m].workorder
        ,	[master].barcode as panel_id
        ,	max([master].[time]) as max_time
        from
                dbo.raw_blackhole_cmi_master [master]
        join
                dbo.tb_panel_item [item]
                on [item].panel_id = [master].barcode
        join
                dbo.tb_panel_4m [4m]
                on [4m].oper_code = 'V02010'
                and [4m].group_key = [item].panel_group_key
                and [4m].workorder in (select * from cte)
        where
                1=1
        group by
                [master].barcode, [4m].workorder , [master].fjd
), cte_cmi as
(
	select
		[master].fjd as ng_type
	,  	[4m].workorder
	,   [master].barcode as panel_id
	,	[raw].rg as ng_pcs_no
	,	max([master].lsldata) as [lsl]
	,	max([master].usldata) as [usl]
	,	min([master].mindata) as [min]
    ,	max([master].maxdata) as [max]
    ,	avg([master].averagedata) as [avg]
	from
		dbo.raw_blackhole_cmi_master [master]
	join
		dbo.tb_panel_item [item]
		on [item].panel_id = [master].barcode
		and [master].barcode = @panel_id
	join 
		dbo.tb_panel_4m [4m]
		on [4m].oper_code = 'V02010'
		and [4m].group_key = [item].panel_group_key 
		and [4m].workorder in (select * from cte)
	left join 	
		dbo.raw_blackhole_cmi [raw]
		on [raw].barcode = [master].barcode
		and [raw].fjd = [master].fjd
		and [raw].[time] in (select max_time from cte_max_blackhole group by max_time)
		and [raw].[time] = (select max([time]) from  raw_blackhole_cmi_master where barcode = @panel_id)
	where 
		1=1
	and [master].[time] = (select max([time]) from  raw_blackhole_cmi_master where barcode = @panel_id)
	group by 
		[master].barcode, [4m].workorder , [master].fjd, [raw].rg
), cte_total as 
(
	select
		workorder
		, panel_id
		, ng_pcs_no
		, count(ng_pcs_no) as ng_cnt
		, 0 as [lsl]     
		, 0 as [usl]     
		, 0 as [min]     
		, 0 as [max]     
		, 0 as [avg] 
	from
		cte_cmi
	group by
		workorder, panel_id, ng_pcs_no
), cte_pcs_total as 
(
	select 
		[master].barcode 
	,	max([master].pieces) as pcs_per_pnl
	from
		dbo.raw_blackhole_cmi_master [master]
	join
		dbo.tb_panel_item [item]
		on [item].panel_id = [master].barcode
		and [master].barcode = @panel_id
	join 
		dbo.tb_panel_4m [4m]
		on [4m].oper_code = 'V02010'
		and [4m].group_key = [item].panel_group_key 
		and [4m].workorder in (select * from cte)
	group by 
		[master].barcode 
), cte_cmi_ng as 
(
	select
		ng_type
	,	workorder
	,	panel_id
	,	count(ng_pcs_no) as ng_cnt
	,	max(cte_pcs_total.pcs_per_pnl) as pcs_per_pnl
	,	min([lsl]) as [lsl]
	,	max([usl]) as [usl]
	,	min([min]) as [min]
	,	max([max]) as [max]
	,	max([avg]) as [avg]
	from
		cte_cmi
	left join
		cte_pcs_total
		on cte_pcs_total.barcode = cte_cmi.panel_id
	group by
		ng_type, workorder, panel_id
), cte_cmi_ng_sum as 
(
	select 
		ng_type
	,	workorder
	,	sum(ng_cnt) as total_ng_cnt
	,	sum(pcs_per_pnl) as total_pcs_cnt
	,	min([lsl]) as [lsl]
	,	max([usl]) as [usl]
	,	min([min]) as [min]
	,	max([max]) as [max]
	,	max([avg]) as [avg]
	,	@panel_id as panel_id
	from 
		cte_cmi_ng
	group by
		workorder, ng_type
), cte_cmi_thick as
(
	select
		[4m].workorder
	,	[raw].barcode
	,	count
	    	(
	        	case
	            	when up1_judge = 'NG' or up2_judge = 'NG' or up3_judge = 'NG' or
	                	down1_judge = 'NG' or down2_judge = 'NG' or down3_judge = 'NG'
	                    	then 1
				end
			) as ng_per_panel
	,	0 as [lsl]
	,	0 as [usl]
	,	min(cast(thickness as float)) as [min]
	,	max(cast(thickness as float)) as [max]
	,	avg(cast(thickness as float)) as [avg]
	from
		dbo.raw_blackhole_cmi_thickness [raw]
	cross apply (values ([raw].up1_thickness), ([raw].up2_thickness), ([raw].up3_thickness), ([raw].down1_thickness), ([raw].down2_thickness), ([raw].down3_thickness)) as v(thickness)
	join
		dbo.tb_panel_item [item]
		on [item].panel_id = [raw].barcode
		and [raw].barcode = @panel_id
	join 
		dbo.tb_panel_4m [4m]
		on [4m].oper_code = 'V02010'
		and [4m].group_key = [item].panel_group_key 
		and [4m].workorder in (select * from cte)
	group by
	        [4m].workorder, [raw].barcode
), cte_cmi_think_sum as
(
	select
		workorder
	,	sum(ng_per_panel) total_ng_cnt
	,	count(*) as pnl_cnt
	,	min([lsl]) as [lsl]
	,	max([usl]) as [usl]
	,	min([min]) as [min]
	,	max([max]) as [max]
	,	max([avg]) as [avg]
	,	@panel_id as panel_id
	from
		cte_cmi_thick
	group by
		workorder
)
select
	'V02010' as oper_code
,	*
from
	cte_cmi_ng_sum
union all
select
	'V02010' as oper_code
,	'Thickness' as ng_type
,	*
from
	cte_cmi_think_sum
union all
select 
	'V02010' as oper_code
,	'Totalng' as ng_type
,	cte_total.workorder
,	sum(ng_cnt) as total_ng_cnt
,	(select top 1 total_pcs_cnt from cte_cmi_ng_sum)  as total_pcs_cnt
,	0 as lsl
,	0 as usl
,	0 as min
,	0 as max
,	0 as avg
,	@panel_id as panel_id
from 
	cte_total
group by
	cte_total.workorder
;