declare @am8 datetime;
select @am8 = dateadd(hour, 8, cast(cast(getdate() as date) as datetime));

if datepart(hour, getdate()) < 8
        select @am8 = dateadd(dd, -1, @am8);
    
       
with cte_month as 
(
	select
		eqp_code 
	,	month(mes_dt) as month_num
	,	count(*) as cnt
	from
		tb_diwater_ng tdn 
	where
		mes_dt >= cast(dateadd(month, -2, dateadd(DAY, 1-DAY(@am8), getdate())) as date) and mes_dt < cast(@am8 as date)
	group by eqp_code, month(mes_dt)
),cte_day as 
(
	select
		eqp_code
	,	day(mes_dt) as day_num
	,	count(*) as cnt 
	from
		tb_diwater_ng
	where
		mes_dt >= dateadd(day,-7,cast(@am8 as date)) and mes_dt < cast(@am8 as date)
	group by 
		eqp_code, day(mes_dt)
)select
	upper(tp.eqp_code) as eqpCode
,	max(case when a.month_num = datepart(month ,dateadd(month,-2,@am8))  then a.cnt else 0 end) as ago2month
,	max(case when a.month_num = datepart(month ,dateadd(month,-2,@am8))  then a.cnt else 0 end) as ago1month
,	max(case when a.month_num = datepart(month , @am8)  then a.cnt else 0 end) as cur_month
,	max(case when b.day_num = datepart(day , dateadd(day,-7,@am8)) then b.cnt else 0 end) as ago7day
,	max(case when b.day_num = datepart(day , dateadd(day,-6,@am8)) then b.cnt else 0 end) as ago6day
,	max(case when b.day_num = datepart(day , dateadd(day,-5,@am8)) then b.cnt else 0 end) as ago5day
,	max(case when b.day_num = datepart(day , dateadd(day,-4,@am8)) then b.cnt else 0 end) as ago4day
,	max(case when b.day_num = datepart(day , dateadd(day,-3,@am8)) then b.cnt else 0 end) as ago3day
,	max(case when b.day_num = datepart(day , dateadd(day,-2,@am8)) then b.cnt else 0 end) as ago2day
,	max(case when b.day_num = datepart(day , dateadd(day,-1,@am8)) then b.cnt else 0 end) as ago1day
from
	tb_param tp
left join
	cte_month a
	on tp.eqp_code = a.eqp_code
left join
	cte_day b
	on tp.eqp_code = b.eqp_code
where
	tp.group_code = 'GRP06-00921'
group by tp.eqp_code
order by upper(tp.eqp_code)
