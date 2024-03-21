with cte as 
(
	select
		vrs.mesdate
	, 	vrs.eqp_code
	, 	vrs.workorder
	, 	vrs.vendor_code
	, 	vrs.item_code
	, 	vrs.item_use_code
	, 	vrs.model_code
	, 	vrs.model_description
	, 	vrs.pnlno
	, 	vrs.layer
	, 	vrs.ngcode
	, 	vrs.filelocation
	, 	vrs.create_dt
	, 	vrs.piece_no
	, 	vrs.oper_seq_no
	, 	vrs.panel_qty
	,	isnull(ele.ENTRY_DESCRIPTION, (select ENTRY_DESCRIPTION from erp_eapp_lookup_entry where LOOKUP_TYPE = 'SDM_ITEM_DIFFICULT' and ENTRY_DESCRIPTION like 'C%')) as grade
	,	sis.PCS_PER_PNL_QTY as pcs_per_pnl_qty
	,	grp.rule_val as ng_name
	from
		dbo.tb_vrs vrs
	join
		dbo.erp_sdm_item_revision sir 
		on sir.BOM_ITEM_CODE = vrs.model_code
	join
		dbo.erp_sdm_item_spec sis
		on sis.BOM_ITEM_ID = sir.BOM_ITEM_ID
	left join 
		dbo.erp_eapp_lookup_entry ele
		on ele.ENTRY_CODE = sis.ITEM_DIFFICULT_LCODE
		and ele.LOOKUP_TYPE = 'SDM_ITEM_DIFFICULT'
	left join 
		dbo.tb_code grp
		on grp.code_id = vrs.ngcode
		and grp.codegroup_id = 'VRS_NG_CODE'
	where
		vrs.corp_id = @corp_id
	and	vrs.fac_id = @fac_id
	and	vrs.create_dt >= CASE 
			WHEN DATEADD(HOUR, 8, DATEADD(DAY, 1 - DAY(GETDATE()), GETDATE())) < DATEADD(DAY, -1, DATEADD(HOUR, 8, CONVERT(datetime, CONVERT(date, GETDATE()))))					        
			THEN DATEADD(HOUR, 8, DATEADD(DAY, 1 - DAY(GETDATE()), GETDATE()))
			ELSE DATEADD(DAY, -1, DATEADD(HOUR, 8, CONVERT(datetime, CONVERT(date, GETDATE()))))
			end
	and vrs.create_dt < DATEADD(DAY, 1, DATEADD(HOUR, 8, CONVERT(datetime, CONVERT(date, GETDATE()))))
	and vrs.item_code is not null	
), cte2 as 
(-- 모델에 등급은 1개 max
	select 
		isnull(case ng_name    when 1  then piece_no end, 0 ) as [open]
	,	isnull(case ng_name    when 2  then piece_no end, 0 ) as [short]
	,   isnull(case ng_name    when 3  then piece_no end, 0 ) as [hole]
	,   isnull(case ng_name    when 4  then piece_no end, 0 ) as [etc]
	,   isnull(case ng_name    when 5  then piece_no end, 0 ) as [foot]
	,	max(panel_qty) * max(pcs_per_pnl_qty) as total_pcs
	,	max(grade) as grade
	,	max(model_description) as bom_item_description
	,	max(model_code) as model_code
	,	workorder
	,	pnlno
	,	layer
	,	max(mesdate) as mesdate
	from 
		cte
	group by
		workorder, model_code, ng_name, piece_no, pnlno, layer
)
, cte3 as 
(
	select 
		sum(case [open] when 0 then 0 when '-9999' then 0 else 1 end ) as [open]
    ,   sum(case [short] when 0 then 0 when '-9999' then 0 else 1 end ) as [short]
    ,   sum(case [hole] when 0 then 0 when '-9999' then 0 else 1 end ) as [hole]
    ,   sum(case [etc] when 0 then 0 when '-9999' then 0 else 1 end ) as [etc]
    ,   sum(case [foot] when 0 then 0 when '-9999' then 0 else 1 end ) as [foot]
    ,	max(isnull(total_pcs, 0)) as total_pcs
    ,	max(grade) as grade
	,	max(bom_item_description) as bom_item_description	
	,	max(model_code) as model_code
	,	workorder
	,	pnlno
	,	layer
	,	max(mesdate) as mesdate
	from 
		cte2
	group by 
		workorder, pnlno, layer
)
, cte4 as 
(
	select 
		max(mesdate) as mesdate
	,	max(bom_item_description) as bom_item_description
	,	max(grade) as grade
	,	case when layer = 'a' or layer = 'b' then layer +' (양면)' else layer + 'L' end as layer
	, 	coalesce(round((1 - sum(case when mesdate = cast(getdate() as date) then [open] + [short] + [hole] + [etc] + [foot] else 0 end) / nullif(cast(sum(case when mesdate = cast(getdate() as date) then total_pcs else 0 end) as float), 0)) * 100, 2), 0) as rate_totay
	, 	coalesce(round((1 - sum(case when mesdate between dateadd(day, -1, getdate()) and getdate() then [open] + [short] + [hole] + [etc] + [foot] else 0 end) / nullif(cast(sum(case when mesdate between dateadd(day, -1, getdate()) and getdate() then total_pcs else 0 end) as float), 0)) * 100, 2), 0) as rate_yesterday
	, 	coalesce(round((1 - sum(case when mesdate between dateadd(week, -1, getdate()) and getdate()  then [open] + [short] + [hole] + [etc] + [foot] else 0 end) / nullif(cast(sum(case when mesdate between dateadd(week, -1, getdate()) and getdate()  then total_pcs else 0 end) as float), 0)) * 100, 2), 0) as rate_week
	, 	coalesce(round((1 - sum(case when mesdate between dateadd(month, -1, getdate()) and getdate() then [open] + [short] + [hole] + [etc] + [foot] else 0 end) / nullif(cast(sum(case when mesdate between dateadd(month, -1, getdate()) and getdate() then total_pcs else 0 end) as float), 0)) * 100, 2), 0) as rate_month
	, 	coalesce(round((sum(case when mesdate = cast(getdate() as date) then [open] else 0 end) / nullif(cast(sum(case when mesdate = cast(getdate() as date) then total_pcs else 0 end) as float), 0)) * 100, 2), 0) as [open]
	, 	coalesce(round((sum(case when mesdate = cast(getdate() as date) then [short] else 0 end) / nullif(cast(sum(case when mesdate = cast(getdate() as date) then total_pcs else 0 end) as float), 0)) * 100, 2), 0) as [short]
	, 	coalesce(round((sum(case when mesdate = cast(getdate() as date) then [hole] else 0 end) / nullif(cast(sum(case when mesdate = cast(getdate() as date) then total_pcs else 0 end) as float), 0)) * 100, 2), 0) as [hole]
	, 	coalesce(round((sum(case when mesdate = cast(getdate() as date) then [etc] else 0 end) / nullif(cast(sum(case when mesdate = cast(getdate() as date) then total_pcs else 0 end) as float), 0)) * 100, 2), 0) as [etc]
	, 	coalesce(round((sum(case when mesdate = cast(getdate() as date) then [foot] else 0 end) / nullif(cast(sum(case when mesdate = cast(getdate() as date) then total_pcs else 0 end) as float), 0)) * 100, 2), 0) as [foot]
	from 
		cte3
	group by 
		model_code, layer
)
select 
	*
from 
	cte4
order by 
	case when rate_totay > 0 then 1 else 2 end 
,	case when SUBSTRING(grade, 1,1) = 'S' then 0
		 when SUBSTRING(grade, 1,1) = 'A' then 1
		 when SUBSTRING(grade, 1,1) = 'B' then 2
		 when SUBSTRING(grade, 1,1) = 'C' then 3
		 else 9 end
,	rate_totay
;