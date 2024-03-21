declare @tbl_plc table
(
    eqp_code        varchar(50)
,   eqstatus        varchar(10)
,   inserttime      datetime
)
;

declare @tbl_pc table
(
    eqp_code        varchar(50)
,   inserttime      datetime
)
;

insert into @tbl_plc
exec dbo.sp_plcinfo_top1_all
;

insert into @tbl_pc
exec dbo.sp_pcinfo_top1_all
;

declare @ago5m datetime = dateadd(mi, -5, getdate());
declare @ago10m datetime = dateadd(mi, -10, getdate());

with cte as
(
    select
        [real].eqp_code
    ,   [real].collection_type
    ,   [real].fac_no
    ,   [real].room_name
    ,   [real].eqp_type
    ,   [real].eqp_status
    ,   [real].step
    ,   [real].plan_cnt
    ,   [real].target_cnt
    ,   [real].total_time
    ,   [real].oee
    ,   [real].prod_cnt
    ,   [real].time_rate
    ,   [real].perfor_rate
    ,   [real].st
    ,   [real].on_time
    ,   [real].off_time
    ,   [real].param_monitor
    ,   [real].real_st
    ,   [real].achieve_rate
    ,   [real].update_dt
    ,   [real].expected_prod
    ,   [real].eqp_description          as eqp_des
    ,   [real].prod_cnt_unit
    ,   [real].rtr_speed
    ,   room_des.ft_descriptioon        as room_des
    ,   eqptype_des.ft_descriptioon     as eqptype_des
    ,   convert(varchar,dateadd(hh,-8,GETDATE()),23) as mes_dt
    ,   '/anypage/facno/' + [real].fac_no  + '/roomname/' + [real].room_name  AS url
    ,   case
            when plc.inserttime is null then null
            when plc.inserttime < @ago5m then 'X'
            when plc.eqstatus = 'Run' then 'O'
            when plc.eqstatus = 'Down' then 'X'
            --when plc.eqstatus = 'Ready' then 'X'
            else 'O'
        end as plc_status
    ,   case
            when pc.inserttime is null then null
            when pc.inserttime < @ago5m then 'X'
            else 'O'
        end as pc_status
	,	pc.inserttime as pc_inserttime
	,	plc.inserttime	as plc_inserttime
    from
        dbo.tb_eqp_real [real]
    left join
        @tbl_plc plc
        on  [real].eqp_code = plc.eqp_code
    left join
        @tbl_pc pc
        on  [real].eqp_code = pc.eqp_code
    left join
        tb_eqp_filter eqptype_des
        on  [real].eqp_type = eqptype_des.ft_key
    left join
        tb_eqp_filter room_des
        on  [real].room_name =  room_des.ft_key
)
select
    *
,   case
        when plc_status = 'O' or pc_status = 'O' then 'O'
        else isnull(plc_status, pc_status)
    end as status
from
    cte
order by
    room_name, eqp_type, eqp_code
;