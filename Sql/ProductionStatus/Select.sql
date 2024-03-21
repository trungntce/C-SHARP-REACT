select
	equipment_id
,	factory_no
,	room_name
,	plan_cnt
,	target_cnt
,	total_cnt
,	achievement_rate
,	operation_time
,	process_time
,	criteria
,	oee
,	timeoperation_rate
,	performance_rate
,	quality_rate
,	data_one
,	data_two
,	data_three
,	update_dt
from 
	dbo.tb_production_status
where
	equipment_id	= @equipment_id
and	factory_no		= @factory_no
and	room_name		= @room_name
;