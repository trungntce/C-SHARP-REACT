declare @to_dt datetime = getdate();
declare @eqcode varchar(50) = @eqp_code;

declare	@am8 datetime;
select @am8 = dateadd(hour, 8, cast(cast(@to_dt as date) as datetime));

if datepart(hour, @to_dt) < 8
	select @am8 = dateadd(dd, -1, @am8);

--PLC

with cte as 
(
	select 
		top 500 *
		,	RANK() OVER(PARTITION BY alarmmessage order by [time] desc) as msg_rank
	from 
		raw_plc_alarminfotable
	where 
		eqcode = @eqp_code
	order by [time] desc
), cte1 as 
(
	select 
		* 
		, case 	when alarmstatus = 'y' and msg_rank = 1 then 'alarm'
--				when alarmstatus = 'n' and msg_rank%2 = 0 then 'alarm'
				else '-' end as alarm_now
		, lead([time]) over (order by [time] desc) as next_time
	from cte
), cte2 as
(
	select
		*
	,	case 	when alarmstatus = 'n' then datediff(ss, next_time, [time]) 
				else datediff(ss, [time], getdate()) end  as second
--			 when alarm_now = 'alarm' and alarmstatus = 'y' then null end as  start_dt
	from
		cte1
), cte3 as 
(
	select
		*
--			 when alarm_now = 'alarm' and alarmstatus = 'y' then null end as  start_dt
	from
		cte2
	where 
		alarm_now = 'alarm' or alarmstatus = 'n'
), cte4 as 
(
		select
		*
--			 when alarm_now = 'alarm' and alarmstatus = 'y' then null end as  start_dt
	from
		cte3
	where 
		next_time >= @am8 or alarm_now = 'alarm'
)select * from cte4