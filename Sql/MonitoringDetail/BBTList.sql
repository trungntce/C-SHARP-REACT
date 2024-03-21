with cte as
(
        select
                panel_id
        ,       mes_date
        ,       workorder
        ,       eqp_code
        ,       vendor_code
        ,       item_code
        ,       item_use_code
        ,       item_use_description as [app_name]
        ,       model_code
        ,		model_description
        ,       ok_cnt
        ,       ng_cnt
        ,       create_dt
        ,       isnull(ELE.ENTRY_DESCRIPTION,'C등급') AS grade
        from
                dbo.tb_bbt a
        inner join	dbo.erp_sdm_item_revision	SIR 
      			on  SIR.BOM_ITEM_CODE = a.model_code
      	inner join dbo.erp_sdm_item_spec SIS
      			on SIS.BOM_ITEM_ID = SIR.BOM_ITEM_ID
      	left outer join dbo.erp_eapp_lookup_entry ELE
      			on ELE.ENTRY_CODE = SIS.ITEM_DIFFICULT_LCODE
      		   and ELE.LOOKUP_TYPE = 'SDM_ITEM_DIFFICULT'
        where
                corp_id = @corp_id
        and     fac_id = @fac_id
        and 	create_dt between CASE 
						        WHEN DATEADD(HOUR, 8, DATEADD(DAY, 1 - DAY(GETDATE()), GETDATE())) < DATEADD(DAY, -1, DATEADD(HOUR, 8, CONVERT(datetime, CONVERT(date, GETDATE()))))					        
						        THEN DATEADD(HOUR, 8, DATEADD(DAY, 1 - DAY(GETDATE()), GETDATE()))
						        ELSE DATEADD(DAY, -1, DATEADD(HOUR, 8, CONVERT(datetime, CONVERT(date, GETDATE()))))
						    end
						    and 
						    	DATEADD(DAY, 1, DATEADD(HOUR, 8, CONVERT(datetime, CONVERT(date, GETDATE()))))
        and item_code is not null
),
cte2 as
(
        select
                a.panel_id
        ,       isnull(sum(case c.code_name     when 'Open'             then 1 else 0 end), 0) as open_cnt
        ,       isnull(sum(case c.code_name     when 'Short'    then 1 else 0 end), 0) as short_cnt
        from
                dbo.tb_bbt_piece a
        join
                dbo.tb_code c
                on      a.judge = c.code_id
                and c.codegroup_id = 'BBT_DEFECT'
        where
                a.panel_id in (select cte.panel_id from cte)
        group by
                a.panel_id
),
cte3 as
(
        select
                a.panel_id
        ,       isnull(sum(case c.code_name when 'Open' then 1 else 0 end), 0) as open_cnt
        ,       isnull(sum(case c.code_name when 'Short' then 1 else 0 end), 0) as short_cnt
        from
                dbo.tb_bbt_piece a
        join
                dbo.tb_code c
                on      a.judge = c.code_id
                and c.codegroup_id = 'BBT_DEFECT_CAMERA'
        where
                a.panel_id in (select cte.panel_id from cte)
        group by
                a.panel_id
), 
cte4 as
(
	select
	    max(cte.mes_date)                                               as mes_date
	,	max(cte.create_dt)												as create_dt
	,	max(cte.model_code)												as model_code
	,	max(cte.model_description)										as model_description
    ,	max(cte.grade)													as grade
	,   isnull(sum(cte.ng_cnt), 0)                              		as ng_cnt
	,   isnull(sum(cte.ok_cnt + cte.ng_cnt), 0) 						as total_cnt
	,	coalesce(round((1 - sum(case when cte.mes_date = cast(getdate() as date) then cte.ng_cnt else 0 end) / NULLIF(cast(sum(case when cte.mes_date = cast(getdate() as date) then (cte.ok_cnt + cte.ng_cnt) else 0 end) as float), 0)) * 100, 1), 0) as day_yield
	,	coalesce(round((1 - sum(case when cte.mes_date between dateadd(day, -1, getdate()) and getdate() then cte.ng_cnt else 0 end) / NULLIF(cast(sum(case when cte.mes_date between dateadd(week, -1, getdate()) and getdate() then (cte.ok_cnt + cte.ng_cnt) else 0 end) as float), 0)) * 100, 1), 0) as yesterday_yield
	,	coalesce(round((1 - sum(case when cte.mes_date between dateadd(week, -1, getdate()) and getdate() then cte.ng_cnt else 0 end) / NULLIF(cast(sum(case when cte.mes_date between dateadd(week, -1, getdate()) and getdate() then (cte.ok_cnt + cte.ng_cnt) else 0 end) as float), 0)) * 100, 1), 0) as week_yield
	,	coalesce(round((1 - sum(case when cte.mes_date between dateadd(month, -1, getdate()) and getdate() then cte.ng_cnt else 0 end) / NULLIF(cast(sum(case when cte.mes_date between dateadd(month, -1, getdate()) and getdate() then (cte.ok_cnt + cte.ng_cnt) else 0 end) as float), 0)) * 100, 1), 0) as month_yield
	,	coalesce(round((sum(case when cte.mes_date = cast(getdate() as date) then (case cte.item_use_code when 'A201' then cte3.open_cnt else cte2.open_cnt end) else 0 end) / NULLIF(cast(sum(case when cte.mes_date = cast(getdate() as date) then (cte.ok_cnt + cte.ng_cnt) else 0 end) as float), 0)) * 100, 1), 0) as open_yield
	,	coalesce(round((sum(case when cte.mes_date = cast(getdate() as date) then (case cte.item_use_code when 'A201' then cte3.short_cnt else cte2.short_cnt end) else 0 end) / NULLIF(cast(sum(case when cte.mes_date = cast(getdate() as date) then (cte.ok_cnt + cte.ng_cnt) else 0 end) as float), 0)) * 100, 1), 0) as short_yield
	from
	        cte
	left join
	        cte2
	        on cte.panel_id = cte2.panel_id
	left join
	        cte3
	        on cte.panel_id = cte3.panel_id
	group by
	        case when 'ITEM' = 'EQP' then cte.eqp_code end
	,       case when 'ITEM' != 'EQP' then vendor_code end
	,       case when 'ITEM' != 'EQP' and ('ITEM' = 'PANEL' or 'ITEM' = 'LOT' or 'ITEM' = 'MODEL' or 'ITEM' = 'ITEM') then cte.item_code end
	,       case when 'ITEM' != 'EQP' and ('ITEM' = 'PANEL' or 'ITEM' = 'LOT' or 'ITEM' = 'MODEL') then cte.model_code end
	,       case when 'ITEM' != 'EQP' and ('ITEM' = 'PANEL' or 'ITEM' = 'LOT') then cte.workorder end
	,       case when 'ITEM' != 'EQP' and ('ITEM' = 'PANEL') then cte.panel_id end
) 
select 
	*
from 
    cte4
order by 
	case when day_yield > 0 then 1 else 2 end 
,	case when SUBSTRING(grade, 1,1) = 'S' then 0
		 when SUBSTRING(grade, 1,1) = 'A' then 1
		 when SUBSTRING(grade, 1,1) = 'B' then 2
		 when SUBSTRING(grade, 1,1) = 'C' then 3
		 else 9 end
,	day_yield
,	create_dt desc
;