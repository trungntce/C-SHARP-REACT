with cte as
(
        select
                vrs.workorder
        ,       vrs.eqp_code
        ,       vrs.pnlno
        ,       vrs.ngcode
        ,       ngname.rule_val as ng_name
        ,       vrs.piece_no
        ,   case when max(vrs.panel_qty) = 0 then 1
             else isnull(max(vrs.panel_qty), 1) end as panel_qty
        ,       max(sis.PCS_PER_PNL_QTY) as pcs_per_pnl_qty
        ,       max(vrs.model_code) as model_code
        ,       max(vrs.model_description) as model_name
        ,       max(vrs.create_dt) as create_dt
        from
                tb_vrs vrs
        left join
                erp_wip_job_entities wje
                on wje.JOB_NO = vrs.workorder
        left join
                erp_sdm_item_revision sir
                on sir.BOM_ITEM_ID = wje.BOM_ITEM_ID
        left join
                erp_sdm_item_spec sis
                on sis.BOM_ITEM_ID = sir.BOM_ITEM_ID
        left join
                tb_code ngname
                on ngname.code_id = vrs.ngcode
                and ngname.codegroup_id = 'VRS_NG_CODE'
        where
            vrs.piece_no is not null
        and vrs.piece_no != '-9999'
        and vrs.create_dt >= dateadd(month, -4, dateadd(month, datediff(month, 0, @to_dt), 0))
	    and vrs.create_dt < @to_dt
        and vrs.eqp_code = @eqp_code
        and vrs.model_code = @model_code
        and vrs.item_use_code = @app_code
        and vrs.model_description like '%' + @model_name + '%'
        and vrs.layer in (select value from STRING_SPLIT( @layer, ','))
        and vrs.ngcode in (select value from STRING_SPLIT( @ng_codes, ','))
        group by
                vrs.workorder, vrs.eqp_code, vrs.pnlno, vrs.ngcode, vrs.piece_no, ngname.rule_val
), cte2 as 
(
	select 
		isnull(case ng_name    when 1  then piece_no end, 0 ) as [open]
	,	isnull(case ng_name    when 2  then piece_no end, 0 ) as [short]
	,	isnull(case ng_name    when 3  then piece_no end, 0 ) as [hole]
	,	isnull(case ng_name    when 4  then piece_no end, 0 ) as [etc]
	,	isnull(case ng_name    when 5  then piece_no end, 0 ) as [foot]
	,	max(create_dt) as create_dt
	,	max(panel_qty) * max(pcs_per_pnl_qty) as total_pcs
	,	pnlno
    ,   workorder
	from 	
		cte
	group by 
		ng_name, piece_no, pnlno, workorder
), cte3 as 
(
    select 
        max(create_dt) as create_dt
    ,   sum(case [open] when 0 then 0 else 1 end ) as [open]
    ,   sum(case [short] when 0 then 0 else 1 end ) as [short]
    ,   sum(case [hole] when 0 then 0 else 1 end ) as [hole]
    ,   sum(case [etc] when 0 then 0 else 1 end ) as [etc]
    ,   sum(case [foot] when 0 then 0 else 1 end ) as [foot]
    ,   max(total_pcs) as total_pcs
    ,   workorder
    from 
	    cte2 
    group by 
	    workorder
)
, cte4 as 
(
	select 
		convert(nvarchar(10), datepart(week, create_dt), 30) as date_mwd
	,	sum([open]  ) as [open] 
	,	sum([short] ) as [short] 
	,	sum([hole]  ) as [hole] 
	,	sum([etc]   ) as [etc] 
	,	sum([foot]  ) as [foot] 
	,	sum(total_pcs) as total_pcs
	from 
		cte3
    where
        create_dt is not null
    and create_dt > dateadd(week, -3, @to_dt) and create_dt < @to_dt
	group by
		datepart(week, create_dt)
)
select 
	date_mwd + ' W' as date_mwd
,	cast(([open] + [short] + [hole] + [etc] + [foot] ) * 100 as decimal) / total_pcs as total_ng
,	cast(([open] * 100) as decimal) / total_pcs as [open]
,	cast(([short] * 100) as decimal) / total_pcs as [short]
,	cast(([hole] * 100) as decimal) / total_pcs as [hole]
,	cast(([etc] * 100) as decimal) / total_pcs as [etc]
,	cast(([foot] * 100) as decimal) / total_pcs as [foot]
from 
	cte4
order by
	case
	when isnumeric(date_mwd) = 1 then cast(date_mwd as int)
	else cast(concat(
		year(getdate()), '/',
			substring(date_mwd, 1, charindex('/', date_mwd) - 1), '/',
			substring(date_mwd, charindex('/', date_mwd) + 1, len(date_mwd) - charindex('/', date_mwd))
		) as datetime)
	end;
