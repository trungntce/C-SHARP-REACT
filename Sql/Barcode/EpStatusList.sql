with cte_list as 
(
	select
		a.hc_code
	,	a.hc_name
	,	a.remark  as workcenter_description
	from
		tb_healthcheck a 
	where
	   a.tags = 'EP'
	   and a.use_yn in ('Y')
	   	and a.hc_code like '%' + @device_id + '%'
      	and a.hc_name like '%' + @device_name + '%'
), cte_last_dt as 
(
	select
		thh.eqp_code 
	,	max(create_dt) as last_dt
	from
		tb_healthcheck_history thh 
	group by 
		thh.eqp_code 
), cte_remark as 
(
	select
		c.eqp_code
	,	c.remark
	from
	(
		select
			eqp_code
		,	remark
		,	row_number() over(partition by eqp_code order by create_dt desc) as row_no
		from
			tb_healthcheck_history thh 
		where
			thh.remark is not null
	) c
	where
		c.row_no = '1'
),cte_merge as 
(
	select
		list.hc_code
	,	list.hc_name
	,	list.workcenter_description
	,	lastDt.last_dt
	,	datediff(mi, lastDt.last_dt, getdate()) as diff
	,	remark.remark
	from
		cte_list list
	left join
		cte_last_dt lastDt
		on list.hc_code = lastDt.eqp_code
	left join
		cte_remark remark
		on	list.hc_code = remark.eqp_code
),cte as 
(
	select 
		*
	,	case when (diff < 2) then 'run'
			when (diff >= 2 and diff <= 5) then 'failure'
			when (diff > 5) then 'down'
		end as status
	from 
		cte_merge
)
select 
	* 
from
	cte
where
	1 = 1
	and status like '%' + @reader_status + '%'
order by hc_code