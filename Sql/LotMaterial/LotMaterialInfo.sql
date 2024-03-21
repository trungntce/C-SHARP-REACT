with cte as (
	select distinct
		0 as level
	,	[4m].oper_seq_no as oper_seq_no_4m
	,	[4m].oper_code as oper_code_4m
	,	soper.OPERATION_DESCRIPTION as oper_name_4m
	,	mat.material_lot 
	,	mat.material_code 
	,	mat.material_name
	,	mat.expired_dt
	,	isnull(oper.JOB_ID, hand.WIP_JOB_ID) as id
	,	mat.create_dt
	,	[4m].row_key
	from 
		tb_panel_4m 			[4m]
	join
		tb_panel_material 		mat
		on
		[4m].row_key = mat.row_key
	left join 
		erp_wip_operations oper
		on mat.material_lot = oper.JOB_NO
	left join 
		erp_inv_item_onhand hand
		on mat.material_lot = hand.PACKING_BOX_NO
	left join 
		erp_inv_item_master master
		on hand.INVENTORY_ITEM_ID = hand.INVENTORY_ITEM_ID
	left join
		erp_sdm_standard_operation soper
		on [4m].oper_code = soper.OPERATION_CODE
	where 
		[4m].workorder = @workorder
), cte_sort as(
	select
		*
	,	row_number() over(order by oper_seq_no_4m asc, row_key asc) AS sort
	from	
		cte
)
, cte2 as 
(
	select distinct 
		cte_sort.level
	,	oper_seq_no_4m
	,	oper_code_4m
	,	oper_name_4m
	,	cte_sort.material_lot
	,	cte_sort.material_code
	,	cte_sort.material_name
	,	cte_sort.expired_dt
	,	id		
	,	STRU.LAYER_NO as layer_no
	,	isnull(STRU.MAIN_BASE_FLAG, 'N') as main
	,	STRU.STRUCT_LAYER_CODE as type
	,	oper.OPERATION_SEQ_NO as oper_seq_no	
	,	soper.OPERATION_DESCRIPTION as oper_desc
	,	center.WORKCENTER_DESCRIPTION as workcenter
	,	cte_sort.sort
	from
		cte_sort 
	left join
		dbo.erp_sdm_item_structure STRU 
		on  cte_sort.material_code = STRU.SG_ITEM_CODE
	left join 
		erp_wip_operations oper
		on cte_sort.id = oper.JOB_ID
	left join 
		erp_sdm_standard_workcenter center
		on oper.WORKCENTER_ID = center.WORKCENTER_ID
	left join 
		erp_sdm_standard_operation soper 
		on oper.OPERATION_ID  = soper.OPERATION_ID
),cte3 as ( 
	select 
		*
	,	row_number() over(partition by material_lot order by oper_seq_no desc) AS group_no
	from 
		cte2 
)select 
		level
	,	oper_seq_no_4m
	,	oper_code_4m
	,	oper_name_4m
	,	material_lot
	,	material_code
	,	material_name
	,	expired_dt
	,	id		
	,	layer_no
	,	main
	,	type
	,	oper_seq_no	
	,	oper_desc
	,	workcenter
	,	sort
	,	case 
			when oper_seq_no is null then group_no + 1
			else group_no 
		end as group_no
from 
	cte3
order by 
		sort asc
	,	oper_seq_no asc
	,	group_no desc
;