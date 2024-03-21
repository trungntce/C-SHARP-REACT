with cte as
(
        select
                panel_id
        ,       mes_date
        ,       workorder
        ,       eqp_code
        ,       vendor_code
        ,       item_code
        ,       item_name
        ,       item_use_code
        ,       item_use_description as [app_name]
        ,       model_code
        ,       ok_cnt
        ,       ng_cnt
        ,       create_dt
        from
                dbo.tb_bbt a
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
	,   max(cte.item_code)                                              as item_code
	,   max(cte.item_name)                                              as item_name
	,   isnull(sum(cte.ng_cnt), 0)                              		as ng_cnt
	,   isnull(sum(cte.ok_cnt + cte.ng_cnt), 0) 						as total_cnt
	from
	        cte
	left join
	        cte2
	        on cte.panel_id = cte2.panel_id
	left join
	        cte3
	        on cte.panel_id = cte3.panel_id
	group by
	        case when 'MODEL' = 'EQP' then cte.eqp_code end
	,       case when 'MODEL' != 'EQP' then vendor_code end
	,       case when 'MODEL' != 'EQP' and ('MODEL' = 'PANEL' or 'MODEL' = 'LOT' or 'MODEL' = 'MODEL' or 'MODEL' = 'ITEM') then cte.item_code end
	,       case when 'MODEL' != 'EQP' and ('MODEL' = 'PANEL' or 'MODEL' = 'LOT' or 'MODEL' = 'MODEL') then cte.model_code end
	,       case when 'MODEL' != 'EQP' and ('MODEL' = 'PANEL' or 'MODEL' = 'LOT') then cte.workorder end
	,       case when 'MODEL' != 'EQP' and ('MODEL' = 'PANEL') then cte.panel_id end
) 
select 
		coalesce(round((1 - sum(case when mes_date = cast(getdate() as date) then ng_cnt else 0 end) / NULLIF(cast(sum(case when mes_date = cast(getdate() as date) then total_cnt else 0 end) as float), 0)) * 100, 1), 0) as total_day_yield
	,	coalesce(round((1 - sum(case when mes_date between dateadd(week, -1, getdate()) and getdate() then ng_cnt else 0 end) / NULLIF(cast(sum(case when mes_date between dateadd(week, -1, getdate()) and getdate() then total_cnt else 0 end) as float), 0)) * 100, 1), 0) as total_week_yield
	,	coalesce(round((1 - sum(case when mes_date between dateadd(month, -1, getdate()) and getdate() then ng_cnt else 0 end) / NULLIF(cast(sum(case when mes_date between dateadd(month, -1, getdate()) and getdate() then total_cnt else 0 end) as float), 0)) * 100, 1), 0) as total_month_yield
from 
    cte4
;