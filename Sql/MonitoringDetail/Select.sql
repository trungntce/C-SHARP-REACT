select 
	rl.min_offset 
,	rl.req
,	rl.max_offset 
from 
	dbo.raw_laser rl 
where
	inserttime >= cast(@start as datetime)
and		
	inserttime < cast(DATEADD(dd,1,@start) as datetime)
and	
	rl.equip = @equip
and
	passes = 1
;

select 
		*
from 
		tb_eqp_daily_index tedi 
where 
		cast(mes_date as date) <= 
		(
			select 
					max(cast(tedi2.mes_date as date))
			from 
					tb_eqp_daily_index tedi2
		)
and
		tedi.eqp_code = @equip
and 
		mes_date <= DATEADD(dd,-3,@mes_date) 
and
		mes_date >= DATEADD(dd,-7,@mes_date) 
;

with cte as
(
select
	cast(dateadd(hour, -8, laser.inserttime) as date) as mesdate2
,   *
from
	dbo.raw_laser laser
where
	laser.equip = @equip
and
	passes = 1
)
, cte2 as
(
   select  
       cte.mesdate2 as mesdate3
   ,   cast(count(*) as numeric) as prod_cnt -- 생산수량
   ,   cast(sum(datediff(ss,cte.[time], cte.endtime)) as numeric) as prod_time -- 가동시간
   ,   cast(avg(datediff(ss,cte.[time], cte.endtime)) as numeric) as ct -- 평균시간
   from 
      cte
   where 
      mesdate2 > cast(DATEADD(dd,-3,@mes_date) as date)
   and   mesdate2 < cast(@mes_date as date)
   group by 
      mesdate2
)
select
	(cte2.prod_time / (24*60*60)) * 100 as time_rate
,   ((cte2.prod_cnt * 120) / (24*60*60)) * 100 as perform_rate -- cte2.ct => 기준 st로 바꿀것 
,   *
from
	cte2
order by 
	cte2.mesdate3
;