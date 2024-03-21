with cte as
(
	select
		eqp_type 
	,	avg(st) as st
	,	avg(target_cnt) as capa
	from 
		dbo.tb_eqp_real a 
	where 	fac_no 		= @fac_no
	and		room_name	= @room_name
	group by eqp_type
)
select
	b.ft_descriptioon 
,	a.*
from cte a
join dbo.tb_eqp_filter b
on	a.eqp_type = b.ft_key
;

select
	count(*) as total_cnt
,	(
		select count(*) 
		from dbo.tb_eqp_real ab
		where 	fac_no 		= @fac_no and room_name	= @room_name and eqp_status = 'O' 
	) as on_cnt
,	(
		select count(*) 
		from dbo.tb_eqp_real ab
		where 	fac_no 		= @fac_no and room_name	= @room_name and eqp_status = 'X' 
	) as off_cnt
,	(
		select count(*) 
		from dbo.tb_eqp_real ab
		where 	fac_no 		= @fac_no and room_name	= @room_name and eqp_status = '-1' 
	) as warn_cnt
,	(
		select count(*) 
		from dbo.tb_eqp_real ab
		where 	fac_no 		= @fac_no and room_name	= @room_name and eqp_status = 'F' 
	) as non_cnt
from 
	dbo.tb_eqp_real a 
where 	fac_no 		= @fac_no
and		room_name	= @room_name
and 	step != '2'
and 	step != '3'
and 	step != '4'
and 	step != '9';
;

with cte as 
(
	select
		eqp_type 
	,	sum(prod_cnt) as total_prod_cnt
	,	sum(target_cnt) as total_target_cnt
	,	avg(oee) 	as total_oee
	,	avg(st) 	as total_st
from
	tb_eqp_real ter 
where
	fac_no = @fac_no and room_name = @room_name
group by eqp_type 
),cte2 as 
(
	select
		a.*
	,	b.ft_descriptioon  as type_des
	,	'eqptype/' + a.eqp_type as urlc
	from
		cte a
	join
		dbo.tb_eqp_filter b on a.eqp_type = b.ft_key 
)select * from cte2;