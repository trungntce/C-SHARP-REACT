with cte as
(
    select
        a.converttime as converttime
    ,   b.{0} as value
    ,   b.eqcode
    from
        (
           select
                DATEADD(MINUTE, DATEDIFF(MINUTE, 0, inserttime) / 5 * 5, 0) as converttime
            ,    min(inserttime) as inserttime
            from
                dbo.{1}
            where
				inserttime >= case when @to_dt = '1' then dateadd(day,-@from_dt,getdate()) else dateadd(day,-@from_dt,@to_dt) end 
				and inserttime <= case when @to_dt = '1' then getdate() else cast(@to_dt as datetime) end
			 group by DATEADD(MINUTE, DATEDIFF(MINUTE, 0, inserttime) / 5 * 5, 0)
        ) a
    join
              dbo.{1} b
        on    a.inserttime = b.inserttime
),cte2 as
(
    select
        a.converttime as converttime
    ,   isnull({2},'d001') as value
     ,	b.eqcode 
    from
        (
            select
                DATEADD(MINUTE, DATEDIFF(MINUTE, 0, inserttime) / 5 * 5, 0) as converttime
            ,    min(inserttime) as inserttime
            from
                 dbo.{3}
            where
				inserttime >= case when @to_dt = '1' then dateadd(day,-@from_dt,getdate()) else dateadd(day,-@from_dt,@to_dt) end 
				and inserttime <= case when @to_dt = '1' then getdate() else cast(@to_dt as datetime) end
			group by DATEADD(MINUTE, DATEDIFF(MINUTE, 0, inserttime) / 5 * 5, 0)
        ) a
    join
        dbo.{3} b
        on    a.inserttime = b.inserttime
)
select
     a.converttime
,    a.value            as di_value
,    a.converttime      as nonconductivity_dt
,    null               as nonconductivity_value
,    b.converttime      as conductivity_dt
,    b.value            as conductivity_value
,	 a.eqcode           as di_name
,	 [code].code_name   as eq_name
from
    cte a
full join
    cte2 b
    on a.converttime = b.converttime
join
	tb_code [code]
	on [code].code_id = b.eqcode
order by a.converttime
;