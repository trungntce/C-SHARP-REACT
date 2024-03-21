set transaction isolation level read uncommitted;

declare @tbl_ignore_param table
(
	model_name		nvarchar(200)
--,	PTS_TYPE_LCODE	varchar(15)
,	corp_id			varchar(40)
,	fac_id			varchar(40)
,	row_no			int
,	row_dt			date
,	row_key			varchar(30)
,	group_key		varchar(30)
,	device_id		varchar(30)
,	workorder		varchar(50)
,	oper_seq_no		int
,	oper_code		varchar(30)
,	eqp_code		varchar(30)
,	scan_dt			datetime
,	create_dt		datetime
,	start_dt		datetime
,	end_dt			datetime
,	real_seq_no		int
,	recipe_judge	char(1)
,	param_judge		char(1)
,	qty				int
,	model_code		varchar(50)
,	workcenter_code	varchar(50)
--,	roll_seq_no		int
,	panel_cnt		int
,	barcode_cnt		int
,	scan_dt_min		datetime
,	scan_dt_max		datetime
,	eqp_nm			nvarchar(200)	
);

with cte_roll as  -- QR각인 공정
(
	select
		[4m].workorder
		, [4m].oper_seq_no as roll_seq_no
	from
		dbo.tb_panel_4m [4m]
	join
		dbo.tb_code roll
		on roll.code_name = [4m].oper_code
		and roll.codegroup_id = 'LASER_OPER'
	where 
		[4m].create_dt >= @from_dt and [4m].create_dt < @to_dt
	and [4m].eqp_code = @eqp_code
	and [4m].workorder like '%' + @workorder + '%'
), cte_4m as
(
	select
		model.BOM_ITEM_DESCRIPTION as model_name
	,	[4m].*
	--,	ssw.WORKCENTER_DESCRIPTION as workcenter_desc
	,	ssw.WORKCENTER_CODE as workcenter_code
	from
		dbo.tb_panel_4m [4m]
	join
		dbo.erp_wip_job_entities job
		on   [4m].workorder 	= job.JOB_NO
	join
		dbo.erp_sdm_item_revision model
		on job.BOM_ITEM_ID 	= model.BOM_ITEM_ID
	join 
		dbo.erp_sdm_item_structure sis
	    on job.BOM_ITEM_ID = sis.BOM_ITEM_ID 
	left join 	
        dbo.tb_barcode_eqp barcode
        on barcode.eqp_code = [4m].eqp_code
	left join 
	    cte_roll roll
	    on [4m].workorder = roll.workorder
	    and [4m].oper_seq_no < roll.roll_seq_no -- QR각인 공정 전: ROLL 공정
	left join
		dbo.erp_sdm_standard_workcenter ssw
	    on ssw.WORKCENTER_CODE = barcode.workcenter_code
	where
		create_dt >= @from_dt and create_dt < @to_dt
	and sis.PTS_TYPE_LCODE !='PTS_0'
	and roll.roll_seq_no is null  -- QR각인 전 제외한 나머지
	and [4m].end_dt is not null -- 4M이 종료된것만 보여주기
	and [4m].eqp_code = @eqp_code
	and [4m].workorder like '%' + @workorder + '%'
	and model.BOM_ITEM_CODE = @model_code
), cte_item_cnt as
(
	select
		cte_4m.group_key
	,	count(distinct item.panel_id) as panel_cnt
	,	min(item.create_dt) as scan_dt_min
    ,	max(item.create_dt) as scan_dt_max
	from
		cte_4m
	join
		dbo.tb_panel_item item
		on	cte_4m.group_key = item.panel_group_key
	group by
		cte_4m.group_key
), cte_scanner as 
(
	select 
		cte_4m.group_key
	,	max(scanner.total_count) as barcode_cnt
	from
		cte_4m
	join 
		tb_panel_scanner_count scanner
		on cte_4m.group_key = scanner.panel_group_key
	group by
		cte_4m.group_key
), cte as
(
	select
		distinct
		[4m].*
	,	item.panel_cnt
	,	scanner.barcode_cnt
	,	item.scan_dt_min
    ,	item.scan_dt_max
	,	sse.EQUIPMENT_DESCRIPTION as eqp_nm
	from
		cte_4m [4m]
	left join
		cte_item_cnt item
		on	[4m].group_key = item.group_key
	left join
		cte_scanner scanner
		on [4m].group_key = scanner.group_key
	left join 
		dbo.erp_sdm_standard_equipment sse
		on sse.EQUIPMENT_CODE = [4m].eqp_code
		and SOB_ID = 90
		and ORG_ID = 901
)
insert into
	@tbl_ignore_param
select 
	* 
from 
	cte
;


with cte_multi_workorder_sum as 
(
	select 
		group_key
	,	max(oper_seq_no) as oper_seq_no
	,	max(oper_code) as oper_code
	,	min(workorder) as workorder
	,	string_agg(workorder , ',') as workorder_multi
	,	count(*) as workorder_cnt
	,	sum(isnull(qty, 0)) as erp_cnt
	,	sum(panel_cnt) as sum_panel_cnt
	,	sum(barcode_cnt) as sum_barcode_cnt
	from
		@tbl_ignore_param cte	
	group by 
		group_key, eqp_code
	having 
		count(*) > 1
)
, cte_multi_workorder as -- 그룹키로 그룹
(
	select
		case when cte.workorder = max(cnt.workorder) 
			then 'CHK' 
			else '' end as chk
	,	cte.group_key
	--,	max(status) as status
	,	cte.workorder
	,	max(cnt.workorder_multi) as workorder_multi
	,	max(model_name) as model_name
	,	max(model_code) as model_code
	,	cte.oper_seq_no
	,	cte.oper_code
	,	max(SSO.OPERATION_DESCRIPTION) as oper_desc
	,	case when max(cnt.workorder_multi) is null then count(*)
			else max(cnt.workorder_cnt) end as [4m_cnt]
	,	isnull(max(cnt.sum_panel_cnt), 0) as panel_cnt 
	,	max(isnull(cnt.erp_cnt, 0)) as erp_cnt	
	,	max(isnull(barcode_cnt, 0)) as barcode_cnt
	,	max(isnull(cnt.sum_barcode_cnt, 0)) as sum_barcode_cnt
	,	max(create_dt) as create_dt
	,	max(eqp_code) as eqp_code
	,	'' as eqp_name_multi
	,	start_dt
    ,	end_dt
    ,	min(scan_dt_min) as scan_dt_min
    ,	max(scan_dt_max) as scan_dt_max
	--,	max(workcenter_desc) as workcenter_desc
	,	max(workcenter_code) as workcenter_code
	from
		@tbl_ignore_param cte
	left join
		dbo.erp_sdm_standard_operation SSO
	  	on SSO.OPERATION_CODE = cte.oper_code 
	left join
		cte_multi_workorder_sum cnt
		on cnt.group_key = cte.group_key 
		--and cnt.oper_seq_no = cte.oper_seq_no
		--and cnt.oper_code = cte.oper_code
	group by
		cte.group_key, cte.workorder, cte.oper_seq_no, cte.oper_code, start_dt, end_dt
), cte_multi_eqp_sum as 
(
	select 
		workorder
	,	min(group_key) as group_key
	,	oper_seq_no
	,	oper_code
	,	isnull(max(cte.qty), 0) as erp_cnt
	,	sum(cte.panel_cnt) as sum_panel_cnt
	,	sum(cte.barcode_cnt) as sum_barcode_cnt
	,	string_agg(eqp_nm, ',') as eqp_name_multi
	,	count(eqp_nm) as eqp_cnt
	from
		@tbl_ignore_param cte
	group by 
		workorder, oper_seq_no, oper_code
), cte_multi_eqp as -- 워크오더로 그룹
(
	select
		case when max(cnt.group_key) = max(cte.group_key) then ''
			else 'CHK' end as chk
	,	string_agg(cte.group_key, ', ') as group_key
	--,       max(status) as status
	,	cte.workorder
	,	'' as workorder_multi
	,	max(model_name) as model_name
	,	max(model_code) as model_code
	,	cte.oper_seq_no
	,	cte.oper_code
	,	max(SSO.OPERATION_DESCRIPTION) as oper_desc
	,	max(cnt.eqp_cnt) as [4m_cnt]
	,	isnull(max(cnt.sum_panel_cnt), 0) as panel_cnt
	,	isnull(max(cte.qty), 0) as erp_cnt	
	,	max(isnull(barcode_cnt, 0)) as barcode_cnt
	,	max(isnull(sum_barcode_cnt, 0)) as sum_barcode_cnt
	,	max(create_dt) as create_dt
	,	max(cte.eqp_code) as eqp_code
	,	max(cnt.eqp_name_multi) as eqp_name_multi
	,	start_dt
    ,	end_dt
    ,	min(scan_dt_min) as scan_dt_min
    ,	max(scan_dt_max) as scan_dt_max
	--,	max(workcenter_desc) as workcenter_desc
	,	max(workcenter_code) as workcenter_code
	from
		@tbl_ignore_param cte
	left join
		dbo.erp_sdm_standard_operation SSO
	  	on SSO.OPERATION_CODE = cte.oper_code
	left join 
		cte_multi_eqp_sum cnt
		on cnt.workorder = cte.workorder 
		and cnt.oper_seq_no = cte.oper_seq_no
		and cnt.oper_code = cte.oper_code
	group by
		cte.workorder, cte.oper_seq_no, cte.oper_code, start_dt, end_dt
), cte_both_single as -- 1워크오더 1eqp 
(
	select
		cte_multi_eqp.*
	from
		cte_multi_eqp
	join
		cte_multi_workorder
		on	cte_multi_workorder.group_key = cte_multi_eqp.group_key
		and cte_multi_workorder.[4m_cnt] <= 1
	where
		cte_multi_eqp.[4m_cnt] <= 1
	--and cte_multi_workorder.[4m_cnt] <= 1
), cte_sum as
(
	select
		'group_by_group_key' as gubun
	,	*
	,	datediff(minute, start_dt, scan_dt_min) as start_to_mes_min
    ,	datediff(minute, scan_dt_max, end_dt) as end_to_mes_max
	from
		cte_multi_workorder
	where
		[4m_cnt] > 1
	union all
	select
		'group_by_workorder' as gubun
	,	*
	,	datediff(minute, start_dt, scan_dt_min) as start_to_mes_min
    ,	datediff(minute, scan_dt_max, end_dt) as end_to_mes_max
	from
		cte_multi_eqp
	where
		[4m_cnt] > 1
	union all
	select
		'both_single' as gubun
	,	*
	,	datediff(minute, start_dt, scan_dt_min) as start_to_mes_min
    ,	datediff(minute, scan_dt_max, end_dt) as end_to_mes_max
	from
		cte_both_single
)
select
	distinct
	cte_sum.*
	, wo.RTR_SHEET
	, barcode.ATTRIBUTE_D as barcode_yn
from
	cte_sum
left outer join 
	dbo.erp_wip_operations wo
	on wo.JOB_NO = cte_sum.workorder
	and wo.OPERATION_SEQ_NO = cte_sum.oper_seq_no
	and wo.SOB_ID = 90
	and wo.ORG_ID = 901
left join 
	dbo.erp_sdm_standard_equipment barcode
	on barcode.EQUIPMENT_CODE = cte_sum.eqp_code
	and barcode.SOB_ID = 90
	and barcode.ORG_ID = 901
where 
	1=1 
and wo.RTR_SHEET = @rtr_sheet
and barcode.ATTRIBUTE_D = @barcode
order by 
	create_dt
;