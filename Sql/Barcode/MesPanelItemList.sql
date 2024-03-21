with cte_ori_4m as
(
	select top 1
		*
	from 
		tb_panel_4m
	where
		group_key = @group_key
	and 
		eqp_code =@eqp_code
), cte_next_4m as
(
	select top 1
		*
	from 
		tb_panel_4m	
	where 
		start_dt > (select top 1 end_dt from cte_ori_4m order by start_dt asc)
	and 
		eqp_code =@eqp_code
	order by start_dt asc
), cte_panel_item as
(
	select
		*
	from 
		tb_panel_item  
	where
		create_dt
	between 
		(select top 1 start_dt from cte_ori_4m order by start_dt asc)
	and 
		(select top 1 start_dt from cte_next_4m order by start_dt asc )
	and 
		eqp_code= @eqp_code
)
select
	panel_group_key
,	device_id
,	eqp_code
,	panel_id
,	case when panel_group_key='NO4M' then '4M 시간 종료 이후 등록' else 'OK' end as remark
,	create_dt
from
	cte_panel_item
union all 
select 
	panel_group_key
,	device_id
,	eqp_code
,	panel_id
,	ng_remark as remark
,	create_dt
from 
	tb_panel_ng 
where 
	panel_group_key =@group_key 
	and eqp_code =@eqp_code