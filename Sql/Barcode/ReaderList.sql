with cte as 
(
	select
		a.hc_code 
	,	a.hc_type 
	,	a.hc_name 
	,	a.remark as workcenter_description	
	,	max(b.create_dt) as last_dt
	,	datediff(mi, max(b.create_dt),getdate()) as diff
	from
		tb_healthcheck a
	left outer join tb_healthcheck_history b
		on a.hc_code = b.eqp_code and a.hc_type = b.type_code
	where
		a.tags = 'S'
		and a.hc_code like '%' + @device_id + '%'
      	and a.hc_name like '%' + @device_name + '%'
	group by a.hc_code, a.hc_type, a.hc_name, a.remark  
),cte2 as 
(
	select
		cte.hc_code
	,	cte.hc_name
	,	cte.workcenter_description
	,	cte.last_dt
	,	(select
			a.remark
		 from
		 	dbo.tb_healthcheck_history a
		 where
		 	eqp_code = cte.hc_code
		 	and type_code = cte.hc_type
		 	and create_dt = cte.last_dt) as remark
	,	cte.diff
	from
		cte 
),cte3 as 
(
   select 
      *
   ,   case
         when diff < 2  then 'run'                      -- 2분 이상,     정상
         when diff between 2 and 5  then 'failure'      -- 2~5분 사이, 통신장애
         when diff > 5  then 'down'                     -- 5분 이상,     다운
      end as status
   from
      cte2
)
select
   *
from
   cte3
where
   1 = 1   
and status like '%' + @reader_status + '%'