declare @tbl_res table
(
    eqcode  varchar(100)
,	status	varchar(4)
,	min_dt 	datetime
,	max_dt	datetime
,	min_value	float
,	max_value 	float
);

--diwater
with cte as
(
        select
                b.eqcode
        ,       a.converttime
        ,       b.{0}
        ,       case when {0} < 12 then 'ng' else 'ok' end as status
        from
        (
                select
                        min(inserttime) as inserttime
                ,       DATEADD(MINUTE, DATEDIFF(MINUTE, 0, inserttime) / 5 * 5, 0) as converttime
                from
                        dbo.{1}
                where
                        inserttime >= dateadd(Day,-@from_dt,getdate()) and inserttime <= getdate()
                group by DATEADD(MINUTE, DATEDIFF(MINUTE, 0, inserttime) / 5 * 5, 0)
        ) a
        join dbo.{1} b
                on      b.inserttime = a.inserttime
),cte2 as
(
        select
                row_number() over (order by converttime desc) as row_no
        ,       *
        from
                cte
),cte3 as
(
        select
                row_number() over (partition by status order by row_no) as part_no
        ,       *
        from
                cte2
),cte4 as
(
        select
                eqcode
        ,       status
        ,       min(converttime) as min_dt
        ,       max(converttime) as max_dt
        ,		min({0})		 as min_vlue
        ,		max({0}) 		 as max_value
        from
                cte3
        where
                status = 'ng'
        group by
                eqcode,status,row_no - part_no
)insert into @tbl_res
select  * from cte4;

--비전도도
with cte as
(
        select
                b.eqcode
        ,       a.converttime
        ,       b.{2}
        ,       case when {2} < 10 then 'ng' else 'ok' end as status
        from
        (
                select
                        min(inserttime) as inserttime
                ,       DATEADD(MINUTE, DATEDIFF(MINUTE, 0, inserttime) / 5 * 5, 0) as converttime
                from
                        dbo.{3}
                where
                        inserttime >= dateadd(Day,-@from_dt,getdate()) and inserttime <= getdate()
                group by DATEADD(MINUTE, DATEDIFF(MINUTE, 0, inserttime) / 5 * 5, 0)
        ) a
        join dbo.{3} b
                on      b.inserttime = a.inserttime
),cte2 as
(
        select
                row_number() over (order by converttime desc) as row_no
        ,       *
        from
                cte
),cte3 as
(
        select
                row_number() over (partition by status order by row_no) as part_no
        ,       *
        from
                cte2
),cte4 as
(
        select
                eqcode
        ,       status
        ,       min(converttime) as min_dt
        ,       max(converttime) as max_dt
        ,		min({2})		 as min_vlue
        ,		max({2}) 		 as max_value
        from
                cte3
        where
                status = 'ng'
        group by
                eqcode,status,row_no - part_no
)insert into @tbl_res
select
        b.code_name + ' INPUT(비저항)' as eqcode
,       a.status
,       a.min_dt
,       a.max_dt
,       a.min_vlue
,       a.max_value
from
        cte4 a
join
        tb_code b
        on b.code_id = a.eqcode
;

--전도도
with cte as
(
        select
                b.eqcode
        ,       a.converttime
        ,       b.{4}
        ,       case when {4} > 10 then 'ng' else 'ok' end as status
        from
        (
                select
                        min(inserttime) as inserttime
                ,       DATEADD(MINUTE, DATEDIFF(MINUTE, 0, inserttime) / 5 * 5, 0) as converttime
                from
                        dbo.{5}
                where
                        inserttime >= dateadd(Day,-@from_dt,getdate()) and inserttime <= getdate()
                group by DATEADD(MINUTE, DATEDIFF(MINUTE, 0, inserttime) / 5 * 5, 0)
        ) a
        join dbo.{5} b
                on      b.inserttime = a.inserttime
),cte2 as
(
        select
                row_number() over (order by converttime desc) as row_no
        ,       *
        from
                cte
),cte3 as
(
        select
                row_number() over (partition by status order by row_no) as part_no
        ,       *
        from
                cte2
),cte4 as
(
        select
                eqcode
        ,       status
        ,       min(converttime) as min_dt
        ,       max(converttime) as max_dt
        ,		min({4})		 as min_vlue
        ,		max({4}) 		 as max_value
        from
                cte3
        where
                status = 'ng'
        group by
                eqcode,status,row_no - part_no
)insert into @tbl_res
select
        b.code_name + ' OUTPUT (전도도)'         as eqcode
,       a.status
,       a.min_dt
,       a.max_dt
,       a.min_vlue
,       a.max_value
from
        cte4 a
join
        tb_code b
        on b.code_id = a.eqcode
;

select 
	a.* 
,	b.remark 
from 
	@tbl_res a
OUTER APPLY
(
	select
		top 1
		b.remark 
	from
		dbo.tb_action_taken b 
	where
		b.eqp_name = a.eqcode
		and (a.min_dt between b.start_dt and b.end_dt or a.max_dt between b.start_dt and b.end_dt)
) b
