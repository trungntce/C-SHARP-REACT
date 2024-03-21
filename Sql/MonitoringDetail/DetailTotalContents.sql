select 
	avg(oee) as oee_avg
,	avg(st)	 as st_avg
,	sum(prod_cnt) as prod_total
,	sum(target_cnt) as target_total
from 
	dbo.tb_eqp_real a
where
	fac_no			= @fan_no
and	eqp_type		= @eqp_type
;

with cte as 
(
	select
		*
	from
		tb_eqp_daily_index a
	where eqp_code in (
		select eqp_code 
		from tb_eqp_real ter 
		where fac_no = @fac_no 
		and eqp_type = @eqp_type
	)
), cte2 as 
(
	select
		*
	from
		cte
	where
		mes_date <= cast(convert(varchar, DATEADD(dd, -1, @mes_dt), 23) as date)
	and
		mes_date >= cast(convert(varchar, DATEADD(dd, -@before_day, @mes_dt), 23) as date)
)
select
	mes_date
,	avg(st) as st_avg
,	avg(oee) as oee_avg
from
	cte2
group by mes_date
;