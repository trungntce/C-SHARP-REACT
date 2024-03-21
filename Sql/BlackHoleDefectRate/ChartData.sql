declare @tbl_ignore_param table (
        roll_id         varchar(40)
,       workorders      nvarchar(max)
,       create_dt       datetime
)
;

with cte as
(
   select
                roll_id
   ,   [4m].workorder
   ,   [4m].group_key
   ,   max(roll.create_dt) as create_dt
   from
      dbo.tb_panel_4m [4m]
   join
      dbo.erp_wip_job_entities job
      on [4m].workorder = job.JOB_NO
   join
      dbo.erp_inv_item_master item
      on job.INVENTORY_ITEM_ID = item.INVENTORY_ITEM_ID
   left outer join
      dbo.tb_roll_panel_map roll
      on [4m].workorder = roll.workorder
   where
      [4m].oper_code = 'V02010'
      and item.ITEM_CODE = @item_code
      and [4m].create_dt >= @from_dt and [4m].create_dt < @to_dt
	  and roll.roll_id = @roll_id
      and roll.roll_id is not null
   group by roll.roll_id, [4m].workorder, [4m].group_key
),cte_roll_workorder as
(
        select
                roll_id
        ,       STRING_AGG(workorder,',') within group(order by workorder) as workorders
        ,       max(create_dt) as create_dt
        from
                cte
        group by roll_id
)
insert into @tbl_ignore_param
select 
	* 
from
	cte_roll_workorder
where
	1 = 1
	and workorders like '%' + @workorder + '%'
;

--min,max,avg,usl,lsl
with cte as 
(
	select
		a.roll_id 
	,	a.workorders
	,	trpm.panel_id 
	from
		dbo.tb_roll_panel_map trpm 
	join
		@tbl_ignore_param a
		on a.roll_id = trpm.roll_id 
)
,cte_master as 
(
	select
		cte.*
	,	rbcm.*
	from
		cte
	left join
		dbo.raw_blackhole_cmi_master rbcm 
		on cte.panel_id = rbcm.barcode 
	where
		rbcm.fjd = @fjd 
),cte_calc as 
(
	select 
		roll_id 
	,	min(lsldata) as lsldata
	,	max(usldata) as usldata
	,	min(mindata) as mindata
	,	max(maxdata) as maxdata
	,	avg(averagedata) as averagedata
	from 
		cte_master 
	group by roll_id	
)select 
	a.*
,	isnull(lsldata,0) as lsldata
,	isnull(usldata,0) as usldata
,	isnull(mindata,0) as mindata
,	isnull(maxdata,0) as maxdata
,	isnull(averagedata,0) as averagedata
from
	@tbl_ignore_param a
left join
	cte_calc b
	on a.roll_id = b.roll_id
;

with cte as 
(
	select
		a.roll_id 
	,	a.workorders
	,	trpm.panel_id 
	from
		dbo.tb_roll_panel_map trpm 
	join
		@tbl_ignore_param a
		on a.roll_id = trpm.roll_id 
),cte_panel_cnt as 
(
	select
		roll_id 
	,	count(*) as total_panel_cnt 
	from
		cte
	group by roll_id 
),cte_cmi as 
(
	select
		cte.*
	,	rbc.pieces 
	,	rbc.rg
	from 
		cte
	join
		dbo.raw_blackhole_cmi rbc 
		on cte.panel_id = rbc.barcode 
	where
		rbc.fjd = @fjd
),cte_group as 
(
	select
		roll_id 
	,	max(workorders) as workorders
	,	panel_id 
	,	max(pieces) as pieces
	,	rg
	from
		cte_cmi
	group by roll_id, panel_id, rg
),cte2 as 
(
	select
		roll_id 
	,	max(pieces) as max_pieces
	,	count(*)   	as cnt
	from
		cte_group
	group by roll_id
),cte_last as 
(
	select
		a.roll_id
	,	a.workorders
	,	a.create_dt
	,	cnt.total_panel_cnt
	,	isnull(b.max_pieces,0) as max_pieces
	,	isnull(b.cnt,0) as cnt
	from
		@tbl_ignore_param a
	left join
		cte_panel_cnt cnt
		on a.roll_id = cnt.roll_id
	left join
		cte2 b
		on a.roll_id = b.roll_id
)
select
	roll_id 
,	workorders
,	create_dt 
,	total_panel_cnt * max_pieces as total_cnt
,	cnt	as ng_cnt
from
	cte_last
;


--declare @tbl_ignore_param table (
--	workorder varchar(50)
--,	group_key varchar(30)
--,	create_dt datetime
--)
--;
--
--with cte as 
--(
--   select
--      roll.roll_id 
--   ,   [4m].workorder 
--   ,   [4m].group_key 
--   ,   min([4m].create_dt) as create_dt
--   from
--      dbo.tb_panel_4m [4m]
--   join
--      dbo.erp_wip_job_entities job
--      on [4m].workorder = job.JOB_NO 
--   join
--      dbo.erp_inv_item_master item
--      on job.INVENTORY_ITEM_ID = item.INVENTORY_ITEM_ID
--   left outer join
--      dbo.tb_roll_panel_map roll
--      on [4m].workorder = roll.workorder 
--   where
--      [4m].oper_code = 'V02010'
--      and item.ITEM_CODE = @item_code
--      and [4m].create_dt between @from_dt and @to_dt
--      and roll.roll_id = @roll_id
--      and [4m].workorder = @workorder
--   group by roll.roll_id, [4m].workorder, [4m].group_key 
--),cte_group as 
--(
--   select
--      max(workorder) as workorder 
--   ,   group_key 
--   ,  min(create_dt) as create_dt
--   from
--      cte
--   group by group_key 
--)
--insert into 
--    @tbl_ignore_param
--select * from cte_group
--;
--
--
----min,max,avg 차트
--with cte_cmi_master as 
--(
--	select
--		a.workorder
--	,	min(cmi.mindata) as mindata
--	,	max(cmi.maxdata) as maxdata
--	,	avg(cmi.averagedata) as averagedata
--    ,   max(cmi.usldata) as usldata
--    ,   max(cmi.lsldata) as lsldata
--	from
--		@tbl_ignore_param a
--	left join
--		dbo.tb_panel_item tpi 
--		on a.group_key = tpi.panel_group_key 
--	join
--		dbo.raw_blackhole_cmi_master cmi 
--		on tpi.panel_id = cmi.barcode 
--	where
--		cmi.fjd = @fjd
--	group by
--		workorder
--)
--select
--	a.workorder
--,	isnull(mindata,0) as min_data
--,	isnull(maxdata,0) as max_data
--,	isnull(averagedata,0) as avg_data
--,	isnull(usldata,0) as usl_data
--,	isnull(lsldata,0) as lsl_data
--,	a.create_dt
--from
--	@tbl_ignore_param a
--left join
--	cte_cmi_master [master]
--	on a.workorder = [master].workorder
--;
--
----불량률 차트
--with cte_item as
--(
--   select
--      a.workorder
--   ,   a.group_key
--   ,   a.create_dt
--   ,   b.panel_id
--   from
--      @tbl_ignore_param a
--   left join
--      dbo.tb_panel_item b
--      on a.group_key = b.panel_group_key
--),cte_item_cnt as --배치별 아이템 총 카운트
--(
--   select
--        workorder
--   ,    min(create_dt) as create_dt
--   ,    count(*) as total_item_cnt
--   from
--      cte_item
--   group by workorder
--),cte_cmi as 
--(
--   select
--      a.workorder
--   ,   max(rbc.pieces) as max_pieces
--   ,   rbc.rg
--   from
--      cte_item a
--   join
--      dbo.raw_blackhole_cmi rbc 
--      on a.panel_id = rbc.barcode
--   where
--      rbc.fjd = @fjd
--   group by 
--      a.workorder, rbc.barcode, rbc.rg
--),cte_cnt as 
--(
--   select
--      workorder
--   ,   max(max_pieces) as max_pieces
--   ,   count(*) as cnt
--   from
--      cte_cmi
--   group by workorder
--)
--select
-- 	a.workorder
--,   a.create_dt
--,	a.total_item_cnt * isnull(b.max_pieces,0) as total_cnt
--,	isnull(cnt,0) as ng_cnt
--from
--   cte_item_cnt a
--left join
--   cte_cnt b
--   on a.workorder = b.workorder	
	

--불량률 차트
--   with cte_cmi_calc as 
--(
--   select
--         a.workorder
--   ,   a.group_key
--   ,   tpi.panel_id
--   ,   max(cmi.pieces) as pieces 
--   ,   max(cmi.fjd) as fjd 
--   ,   cmi.rg 
--   from
--      @tbl_ignore_param a
--   left join
--      dbo.tb_panel_item tpi
--      on a.group_key = tpi.panel_group_key 
--   join
--      dbo.raw_blackhole_cmi cmi
--      on tpi.panel_id = cmi.barcode 
--   where
--      cmi.fjd = @fjd
--   group by workorder,group_key,panel_id,rg
--),cte_statistics as 
--(
--   select
--      workorder 
--   ,   group_key    
--   ,   count(*) as defect_cnt
--   ,   sum(pieces) as total_pieces
--   from
--      cte_cmi_calc
--   group by 
--      workorder, group_key   
--)
--select
--   a.workorder
--,   a.group_key
--,   isnull(b.defect_cnt,0) as ng_cnt
--,   isnull(b.total_pieces,0) as total_cnt
--,	a.create_dt
--from
--   @tbl_ignore_param a
--left join
--   cte_statistics b
--   on a.workorder = b.workorder
--   and a.group_key = b.group_key
--;



--declare @tbl_batch table
--(
--	workorder 	varchar(100)
--,	panel_id	varchar(100)
--,	create_dt	datetime
--);
--
----declare @item_code 		varchar(50)		= 'B0900504222-CHC';
----declare @hang_mog		varchar(20)		= 'HoleSize';
--
--with cte as 
--(
--	select 
--		max([4m].workorder) as workorder
--	,	[4m].group_key 
--	,	max([4m].create_dt) as create_dt
--	from
--		tb_panel_4m [4m]
--	join
--		erp_wip_job_entities job
--		on [4m].workorder = job.JOB_NO 
--	join
--		erp_inv_item_master item
--		on job.INVENTORY_ITEM_ID = item.INVENTORY_ITEM_ID 
--	where
--		[4m].oper_code = 'V02010'
--		and item.ITEM_CODE = @item_code
--		and create_dt between @from_dt and @to_dt
--	group by [4m].group_key 
--),cte2 as 
--(
--	select
--		a.workorder 
--	,	b.panel_id 
--   	,	max(a.create_dt)	as create_dt 
--	from
--		cte a
--	left outer join
--		tb_panel_item b
--		on a.group_key = b.panel_group_key 
--	group by workorder, panel_id
--)
--insert into @tbl_batch
--select * from cte2;
--
----min,max,avg 차트
--with cte as 
--(
--	select 
--		a.*
--	,	rbcm.mindata
--	,	rbcm.maxdata
--	,	rbcm.averagedata
--	,	rbcm.usldata 
--    ,	rbcm.lsldata 
--	from
--		@tbl_batch a
--	left outer join
--		dbo.raw_blackhole_cmi_master rbcm
--		on a.panel_id = rbcm.barcode
--	where
--		rbcm.fjd = @fjd
--)
--select 
--	workorder
--,	max(cte.create_dt) 		as create_dt	
--,	min(mindata) 			as min_data
--,	max(maxdata) 			as max_data
--,	avg(averagedata)		as avg_data
--,	max(usldata)			as usl_data
--,	max(lsldata)			as lsl_data
--from 
--	cte
--group by 
--	workorder 
--;
--
----불량률 차트
--with cte as 
--(
--	select
--		a.workorder
--	,	a.panel_id
--	,	max(a.create_dt)	as create_dt
--	,	max(rbc.pieces) 	as total_pieces
--	,	rbc.rg 
--	from
--		@tbl_batch a
--	join
--		dbo.raw_blackhole_cmi rbc 
--		on a.panel_id = rbc.barcode 
--	where
--		rbc.fjd = @fjd
--	group by workorder, panel_id, rg 
--),cte2 as 
--(
--	select
--		workorder 
--	,	panel_id
--	,	max(create_dt)		as create_dt
--	,	count(*) 			as ng_cnt
--	,	max(total_pieces) 	as total_cnt
--	from
--		cte
--	group by workorder, panel_id
--)
--select
--	workorder
--,	max(create_dt)			as create_dt
--,	sum(ng_cnt) 			as ng_cnt
--,	sum(total_cnt)			as total_cnt
--from
--	cte2
--group by workorder
--;