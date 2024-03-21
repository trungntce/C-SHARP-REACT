with 
	cte_eqp as (select distinct [value] as eqp_code from openjson(@eqp_code) with ([value] varchar(50) '$.value')),
cte as
(
	select
		panel_id
	,	panel_seq
	,	mes_date
	,	workorder
	,	eqp_code
	,	eqp_description as eqp_name
	,	vendor_code
	,	vendor_name
	,	item_code
	,	item_name
	,	item_use_code
	,	item_use_description as [app_name]
	,	model_code
	,	start_dt
	,	end_dt
	,	ok_cnt
	,	ng_cnt
	,	create_dt
	from
		dbo.tb_bbt a
	where
		corp_id = @corp_id
	and	fac_id = @fac_id
	and mes_date >= @from_dt and mes_date < @to_dt
	and	item_code = @item_code
	and	item_name like '%' + @item_name + '%'
	and	model_code = @model_code
	and item_code is not null
), cte2 as
(
	select
		a.panel_id

    ,   isnull(sum(case c.code_name     when '4W'           then 1 else 0 end), 0) as [4w_cnt]
    ,   isnull(sum(case c.code_name     when 'AUX'          then 1 else 0 end), 0) as [aux_cnt]
    ,   isnull(sum(case c.code_name     when 'Both'         then 1 else 0 end), 0) as [both_cnt]
    ,   isnull(sum(case c.code_name     when 'C'            then 1 else 0 end), 0) as [c_cnt]
    ,   isnull(sum(case c.code_name     when 'ER'           then 1 else 0 end), 0) as [er_cnt]
    ,   isnull(sum(case c.code_name     when 'Open'         then 1 else 0 end), 0) as [open_cnt]
    ,   isnull(sum(case c.code_name     when 'SPK'          then 1 else 0 end), 0) as [spk_cnt]
    ,   isnull(sum(case c.code_name     when 'Short'        then 1 else 0 end), 0) as [short_cnt]

    ,   isnull(sum(case a.judge         when '4WNG'         then 1 else 0 end), 0) as [raw4wng]
    ,   isnull(sum(case a.judge         when 'SHORT'        then 1 else 0 end), 0) as [rawshort]
    ,   isnull(sum(case a.judge         when 'SHORTS2'      then 1 else 0 end), 0) as [rawshorts2]
    ,   isnull(sum(case a.judge         when 'uSH2'         then 1 else 0 end), 0) as [rawush2]
    ,   isnull(sum(case a.judge         when '4WNG uSH2'    then 1 else 0 end), 0) as [raw4wngush2]
    ,   isnull(sum(case a.judge         when 'OPEN'         then 1 else 0 end), 0) as [rawopen]
    ,   isnull(sum(case a.judge         when 'OPEN SHORTS'  then 1 else 0 end), 0) as [rawopenshorts]
    ,   isnull(sum(case a.judge         when 'uSH1'         then 1 else 0 end), 0) as [rawush1]
    ,   isnull(sum(case a.judge         when 'AUX'          then 1 else 0 end), 0) as [rawaux]
    ,   isnull(sum(case a.judge         when '4WNG SHORT'   then 1 else 0 end), 0) as [raw4wngshort]
    ,   isnull(sum(case a.judge         when 'OPEN SHORT'   then 1 else 0 end), 0) as [rawopenshort]
    ,   isnull(sum(case a.judge         when 'OPEN SPARK'   then 1 else 0 end), 0) as [rawopenspark]
    ,   isnull(sum(case a.judge         when 'SPARK'        then 1 else 0 end), 0) as [rawspark]
    ,   isnull(sum(case a.judge         when '4WNG SPARK'   then 1 else 0 end), 0) as [raw4wngspark]
    ,   isnull(sum(case a.judge         when 'OPEN uSH2'    then 1 else 0 end), 0) as [rawopenush2]
    ,   isnull(sum(case a.judge         when '4WNG SHORTS'  then 1 else 0 end), 0) as [raw4wngshorts]
    ,   isnull(sum(case a.judge         when '4WNG uSH1'    then 1 else 0 end), 0) as [raw4wngush1]
    ,   isnull(sum(case a.judge         when 'SHORTS'       then 1 else 0 end), 0) as [rawshorts]
    ,   isnull(sum(case a.judge         when 'C'            then 1 else 0 end), 0) as [rawc]
    ,   isnull(sum(case a.judge         when 'ERROR'        then 1 else 0 end), 0) as [rawerror]
    ,   isnull(sum(case a.judge         when 'OPEN uSH1'    then 1 else 0 end), 0) as [rawopenush1]
	from
		dbo.tb_bbt_piece a
	join
		dbo.tb_code c
		on	a.judge = c.code_id
		and c.codegroup_id = 'BBT_DEFECT_MPD'
	where
		a.panel_id in (select cte.panel_id from cte)
	group by
		a.panel_id
), cte4 as
(
	select
		max(cte.create_dt)						as create_dt
	,	max(cte.mes_date)						as mes_date
	,	max(cte.panel_id)						as panel_id
	,	max(cte.eqp_code)						as eqp_code
	,	max(cte.eqp_name)						as eqp_name
	,	max(cte.workorder)						as workorder
	,	max(cte.vendor_code)					as vendor_code
	,	max(cte.vendor_name)					as vendor_name
	,	max(cte.item_code)						as item_code
	,	max(cte.item_name)						as item_name
	,	max(cte.item_use_code)					as app_code
	,	max(cte.[app_name])						as [app_name]
	,	max(cte.model_code)						as model_code
	,	count(*)								as panel_cnt
	,	isnull(sum(cte.ok_cnt), 0)				as ok_cnt
	,	isnull(sum(cte.ng_cnt), 0)				as ng_cnt
	,	isnull(sum(cte.ok_cnt + cte.ng_cnt), 0) as total_cnt

	,	isnull(sum(cte2.[4w_cnt]), 0)			as [4w_cnt]
	,	isnull(sum(cte2.[aux_cnt]), 0)			as [aux_cnt]
	,	isnull(sum(cte2.[both_cnt]), 0)			as [both_cnt]
	,	isnull(sum(cte2.[c_cnt]), 0)			as [c_cnt]
	,	isnull(sum(cte2.[er_cnt]), 0)			as [er_cnt]
	,	isnull(sum(cte2.[open_cnt]), 0)			as [open_cnt]
	,	isnull(sum(cte2.[spk_cnt]), 0)			as [spk_cnt]
	,	isnull(sum(cte2.[short_cnt]), 0)		as [short_cnt]

	,	isnull(sum(cte2.[raw4wng]), 0)			as [raw4wng]
	,	isnull(sum(cte2.[rawshort]), 0)			as [rawshort]
	,	isnull(sum(cte2.[rawshorts2]), 0)		as [rawshorts2]
	,	isnull(sum(cte2.[rawush2]), 0)			as [rawush2]
	,	isnull(sum(cte2.[raw4wngush2]), 0)		as [raw4wngush2]
	,	isnull(sum(cte2.[rawopen]), 0)			as [rawopen]
	,	isnull(sum(cte2.[rawopenshorts]), 0)	as [rawopenshorts]
	,	isnull(sum(cte2.[rawush1]), 0)			as [rawush1]
	,	isnull(sum(cte2.[rawaux]), 0)			as [rawaux]
	,	isnull(sum(cte2.[raw4wngshort]), 0)		as [raw4wngshort]
	,	isnull(sum(cte2.[rawopenshort]), 0)		as [rawopenshort]
	,	isnull(sum(cte2.[rawopenspark]), 0)		as [rawopenspark]
	,	isnull(sum(cte2.[rawspark]), 0)			as [rawspark]
	,	isnull(sum(cte2.[raw4wngspark]), 0)		as [raw4wngspark]
	,	isnull(sum(cte2.[rawopenush2]), 0)		as [rawopenush2]
	,	isnull(sum(cte2.[raw4wngshorts]), 0)	as [raw4wngshorts]
	,	isnull(sum(cte2.[raw4wngush1]), 0)		as [raw4wngush1]
	,	isnull(sum(cte2.[rawshorts]), 0)		as [rawshorts]
	,	isnull(sum(cte2.[rawc]), 0)				as [rawc]
	,	isnull(sum(cte2.[rawerror]), 0)			as [rawerror]
	,	isnull(sum(cte2.[rawopenush1]), 0)		as [rawopenush1]
	from
		cte
	left join
		cte2
		on cte.panel_id = cte2.panel_id
	group by
		cte.panel_id
), 
cte_all4m as
(
	select distinct
		[4m].workorder

	,	[4m].eqp_code
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
		and	cte.eqp_code = [4m].eqp_code
	join
		dbo.tb_panel_4m all4m
		on	[4m].workorder = all4m.workorder
		and	[4m].oper_seq_no > all4m.oper_seq_no
	where 1=1
	and	all4m.eqp_code in (select eqp_code from cte_eqp) -- @eqp_code
	and	all4m.oper_code = @oper_code
),
cte_main as
(
	select
		cte4.model_code

	,	all4m.prev_eqp_code
	,	all4m.prev_oper_seq_no
	,	all4m.prev_oper_code
	,	max(all4m.prev_create_dt)				as create_dt

	,	count(*) as cnt
	,	count(distinct cte4.workorder)			as workorder_cnt

	,	sum(cte4.panel_cnt)						as panel_cnt
	,	sum(cte4.ng_cnt)						as ng_cnt
	,	sum(cte4.total_cnt)						as total_cnt

	,	isnull(sum(cte4.[4w_cnt]), 0)			as [4w_cnt]
	,	isnull(sum(cte4.[aux_cnt]), 0)			as [aux_cnt]
	,	isnull(sum(cte4.[both_cnt]), 0)			as [both_cnt]
	,	isnull(sum(cte4.[c_cnt]), 0)			as [c_cnt]
	,	isnull(sum(cte4.[er_cnt]), 0)			as [er_cnt]
	,	isnull(sum(cte4.[open_cnt]), 0)			as [open_cnt]
	,	isnull(sum(cte4.[spk_cnt]), 0)			as [spk_cnt]
	,	isnull(sum(cte4.[short_cnt]), 0)		as [short_cnt]

	,	isnull(sum(cte4.[raw4wng]), 0)			as [raw4wng]
	,	isnull(sum(cte4.[rawshort]), 0)			as [rawshort]
	,	isnull(sum(cte4.[rawshorts2]), 0)		as [rawshorts2]
	,	isnull(sum(cte4.[rawush2]), 0)			as [rawush2]
	,	isnull(sum(cte4.[raw4wngush2]), 0)		as [raw4wngush2]
	,	isnull(sum(cte4.[rawopen]), 0)			as [rawopen]
	,	isnull(sum(cte4.[rawopenshorts]), 0)	as [rawopenshorts]
	,	isnull(sum(cte4.[rawush1]), 0)			as [rawush1]
	,	isnull(sum(cte4.[rawaux]), 0)			as [rawaux]
	,	isnull(sum(cte4.[raw4wngshort]), 0)		as [raw4wngshort]
	,	isnull(sum(cte4.[rawopenshort]), 0)		as [rawopenshort]
	,	isnull(sum(cte4.[rawopenspark]), 0)		as [rawopenspark]
	,	isnull(sum(cte4.[rawspark]), 0)			as [rawspark]
	,	isnull(sum(cte4.[raw4wngspark]), 0)		as [raw4wngspark]
	,	isnull(sum(cte4.[rawopenush2]), 0)		as [rawopenush2]
	,	isnull(sum(cte4.[raw4wngshorts]), 0)	as [raw4wngshorts]
	,	isnull(sum(cte4.[raw4wngush1]), 0)		as [raw4wngush1]
	,	isnull(sum(cte4.[rawshorts]), 0)		as [rawshorts]
	,	isnull(sum(cte4.[rawc]), 0)				as [rawc]
	,	isnull(sum(cte4.[rawerror]), 0)			as [rawerror]
	,	isnull(sum(cte4.[rawopenush1]), 0)		as [rawopenush1]
	from
		cte4
	join
		cte_all4m all4m
		on	cte4.workorder = all4m.workorder
		and	cte4.eqp_code = all4m.eqp_code
	group by
		cte4.model_code, all4m.prev_eqp_code, all4m.prev_oper_seq_no, all4m.prev_oper_code, cte4.mes_date
)
select
	oper.OPERATION_DESCRIPTION	as oper_description
,	model.BOM_ITEM_DESCRIPTION	as model_description
,	item.ITEM_CODE				as item_code
,	(cast(ng_cnt as decimal) * 100) / cast(total_cnt as decimal)	as ng_rate
,	cte_main.*

,	concat_ws('::', oper.OPERATION_DESCRIPTION, oper_tl.OPERATION_DESCRIPTION, '') as tran_oper_name
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
	ng_rate desc
;