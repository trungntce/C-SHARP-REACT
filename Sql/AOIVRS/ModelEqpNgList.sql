with 
	cte_eqp as (select distinct [value] as eqp_code from openjson(@eqp_code) with ([value] varchar(50) '$.value')),
cte as
(
	select
		a.mesdate					as mes_date
	,	a.vendor_name
	,	a.item_code
	,	a.item_description 
	,	a.eqp_code					-- VRS eqp_code
	,	a.model_code
	,	a.workorder
	,	a.pnlno						as panel_no
	,	a.workorder + '-' + pnlno	as panel_id

	,	a.ngcode		as ng_code
	,	a.layer
	from
		dbo.tb_vrs a 
	join tb_code b
		on b.codegroup_id = 'VRS_NG_CODE'
		and b.code_id 		= a.ngcode 
	where
		a.corp_id = @corp_id
		and a.fac_id = @fac_id
		and a.mesdate >= @from_dt and a.mesdate < @to_dt
		and a.item_code = @item_code
		and a.item_description like '%' + @item_name + '%'
		and	a.model_code = @model_code
		and a.item_code is not null
)
,
cte_all4m as
(
	select distinct
		[4m].workorder

	,	cte.eqp_code						-- VRS eqp_code
	,	[4m].eqp_code		as aoi_eqp_code -- AOI eqp_code
	,	[4m].oper_code
	,	[4m].oper_seq_no	

	,	all4m.eqp_code		as prev_eqp_code
	,	all4m.oper_code		as prev_oper_code
	,	all4m.oper_seq_no	as prev_oper_seq_no
	,	all4m.create_dt		as prev_create_dt
	from
		cte
	join
		dbo.tb_panel_4m [4m]
		on	cte.workorder = [4m].workorder
	join
		dbo.tb_panel_4m all4m
		on	[4m].workorder = all4m.workorder
		and	[4m].oper_seq_no > all4m.oper_seq_no
	where
		[4m].eqp_code in (select distinct equip from raw_aoi_orbotech)
	and	all4m.eqp_code not in (select distinct equip from raw_aoi_orbotech)
	and	all4m.eqp_code in (select eqp_code from cte_eqp) -- @eqp_code
	and	all4m.oper_code = @oper_code
),
cte_main as
(
	select
		cte.model_code
	,	cte.layer

	,	all4m.prev_eqp_code
	,	all4m.prev_oper_seq_no
	,	all4m.prev_oper_code
	,	max(all4m.prev_create_dt)				as create_dt

	,	count(*)								as ng_cnt
	,	count(distinct cte.panel_id)			as panel_cnt
	,	count(distinct cte.workorder)			as workorder_cnt
	
	,	isnull(sum(case cte.ng_code	when 0  then 1 else 0 end), 0) as [none]
	,	isnull(sum(case cte.ng_code	when 1  then 1 else 0 end), 0) as [short_df]
	,	isnull(sum(case cte.ng_code	when 2  then 1 else 0 end), 0) as [short_et]
	,	isnull(sum(case cte.ng_code	when 3  then 1 else 0 end), 0) as [short_md]
	,	isnull(sum(case cte.ng_code	when 4  then 1 else 0 end), 0) as [short_df_repair]
	,	isnull(sum(case cte.ng_code	when 5  then 1 else 0 end), 0) as [short_et_repair]
	,	isnull(sum(case cte.ng_code	when 6  then 1 else 0 end), 0) as [short_md6]
	,	isnull(sum(case cte.ng_code	when 7  then 1 else 0 end), 0) as [open_df]
	,	isnull(sum(case cte.ng_code	when 8  then 1 else 0 end), 0) as [open_et]
	,	isnull(sum(case cte.ng_code	when 9  then 1 else 0 end), 0) as [open_madong]
	,	isnull(sum(case cte.ng_code	when 10 then 1 else 0 end), 0) as [slit_df]
	,	isnull(sum(case cte.ng_code	when 11 then 1 else 0 end), 0) as [slit_et]
	,	isnull(sum(case cte.ng_code	when 12 then 1 else 0 end), 0) as [slit_madong]
	,	isnull(sum(case cte.ng_code	when 13 then 1 else 0 end), 0) as [open_qc]
	,	isnull(sum(case cte.ng_code	when 14 then 1 else 0 end), 0) as [dong_cuc4]
	,	isnull(sum(case cte.ng_code	when 15 then 1 else 0 end), 0) as [dong_cuc5]
	,	isnull(sum(case cte.ng_code	when 16 then 1 else 0 end), 0) as [pine_hole]
	,	isnull(sum(case cte.ng_code	when 17 then 1 else 0 end), 0) as [lech_hole_df]
	,	isnull(sum(case cte.ng_code	when 18 then 1 else 0 end), 0) as [lech_hole_cnc]
	,	isnull(sum(case cte.ng_code	when 19 then 1 else 0 end), 0) as [chua_mon]
	,	isnull(sum(case cte.ng_code	when 20 then 1 else 0 end), 0) as [tran_dong0]
	,	isnull(sum(case cte.ng_code	when 21 then 1 else 0 end), 0) as [tran_dong1]
	,	isnull(sum(case cte.ng_code	when 22 then 1 else 0 end), 0) as [tac_hole]
	,	isnull(sum(case cte.ng_code	when 23 then 1 else 0 end), 0) as [tenting]
	,	isnull(sum(case cte.ng_code	when 24 then 1 else 0 end), 0) as [pjt]
	,	isnull(sum(case cte.ng_code	when 25 then 1 else 0 end), 0) as [khac]
	,	isnull(sum(case cte.ng_code	when 26 then 1 else 0 end), 0) as [short_df_aor]
	,	isnull(sum(case cte.ng_code	when 27 then 1 else 0 end), 0) as [short_et_aor]
	,	isnull(sum(case cte.ng_code	when 28 then 1 else 0 end), 0) as [short_md_aor]
	,	isnull(sum(case cte.ng_code	when 29 then 1 else 0 end), 0) as [dc_aor]
	,	isnull(sum(case cte.ng_code	when 30 then 1 else 0 end), 0) as [aor]
	,	isnull(sum(case cte.ng_code	when 31 then 1 else 0 end), 0) as [miss_feature]
	,	isnull(sum(case cte.ng_code	when 32 then 1 else 0 end), 0) as [skip_pcb]
	,	isnull(sum(case cte.ng_code	when 33 then 1 else 0 end), 0) as [short_point]
	from
		cte
	join
		cte_all4m all4m
		on	cte.workorder = all4m.workorder
		and	cte.eqp_code = all4m.eqp_code
	group by
		cte.model_code, all4m.prev_eqp_code, all4m.prev_oper_seq_no, all4m.prev_oper_code, cte.mes_date, cte.layer
)
select
	oper.OPERATION_DESCRIPTION	as oper_description
,	model.BOM_ITEM_DESCRIPTION	as model_description
,	item.ITEM_CODE				as item_code
,	cte_main.*
,	cast(ng_cnt as decimal) / cast(panel_cnt as decimal)	as defect_per_panel

,	concat_ws('::', oper.OPERATION_DESCRIPTION, oper_tl.OPERATION_DESCRIPTION, '') as tran_oper_description
from
	cte_main
join
	dbo.erp_sdm_standard_operation oper
	on	cte_main.prev_oper_code = oper.OPERATION_CODE
join
	dbo.erp_sdm_standard_operation_tl oper_tl
	on oper.OPERATION_ID = oper_tl.OPERATION_ID
join
	dbo.erp_sdm_item_revision model
	on	cte_main.model_code = model.BOM_ITEM_CODE
join
	dbo.erp_inv_item_master item
	on	model.INVENTORY_ITEM_ID = item.INVENTORY_ITEM_ID
order by 
	defect_per_panel desc
;