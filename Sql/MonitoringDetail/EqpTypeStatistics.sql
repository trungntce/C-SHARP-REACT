declare @non_step table
(
	eqp_type varchar(5)
,	cnt		int
);
   
with cte as 
(
	select 
	    *
	from
	    tb_eqp_real ter 
	where
	    room_name in (select [value] from string_split(@room_name, ',')) 
),cte2 as 
(
	select
		eqp_type 
	,	count(*) as ggg
	from
		cte
	where
		step != '1'
	group by eqp_type 
)insert into 
	@non_step
select * from cte2
;

with cte as 
(
   select 
      *
   from
      tb_eqp_real ter 
   where
      room_name in (select [value] from string_split(@room_name, ',')) 
),cte2 as 
(
   select 
      eqp_type 
   ,   count(*) as eqp_total
   ,   case when avg(st) = 0 then 0
          else CEILING( 24 * 60 * 60 / avg(st) * avg(oee) / 100 ) end as total_futher_cnt
   ,   avg(st) as st
   ,   sum(prod_cnt) as total_prod
   ,   avg(time_rate) as avg_time_rate
   ,   avg(oee) as avg_oee_rate
   from
      cte
   group by eqp_type
)
select
   b.ft_descriptioon as type_des
,   a.*  
,	a.eqp_total - cast(isnull(c.cnt,0) as numeric) as run_eqp
from
   cte2 a
join 
   dbo.tb_eqp_filter b on a.eqp_type =  b.ft_key
left join
	@non_step c
	on  a.eqp_type =  c.eqp_type
 ;
   