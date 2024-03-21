select
        count(*) as total_cnt
,       (
                select count(*)
                from dbo.tb_eqp_real ab
                where eqp_status = 'O'and room_name in (select * from string_split(@room_name, ','))
        ) as on_cnt
,       (
                select count(*)
                from dbo.tb_eqp_real ab
                where eqp_status = 'X' and  room_name in (select * from string_split(@room_name, ','))
        ) as off_cnt
,       (
                select count(*)
                from dbo.tb_eqp_real ab
                where eqp_status = 'X' and  room_name in (select * from string_split(@room_name, ','))
        ) as warn_cnt
,       (
                select count(*)
                from dbo.tb_eqp_real ab
                where eqp_status = 'X' and  room_name in (select * from string_split(@room_name, ','))
        ) as stop_cnt
from
        dbo.tb_eqp_real a
where
	room_name in (select * from string_split(@room_name, ','))
;