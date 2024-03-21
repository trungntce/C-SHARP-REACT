with cte as
(
	select 
		eqp_code 
	,	max(eqpareagroup_seq)	as max_l_seq
	,	max(eqparea_seq)	as max_m_seq
	from 
		dbo.tb_eqp_offset
	where
		corp_id			= @corp_id
	and	fac_id			= @fac_id
	and eqp_code		= @eqp_code
	group by eqp_code 
)
select 
	a.ext_id
,   a.eqp_code
,   a.eqpareagroup_seq
,   a.eqpareagroup_code
,   c.eqpareagroup_name
,   a.eqparea_seq
,   a.eqparea_code
,   d.eqparea_name
,   a.ext_mm
,	a.speed_param_id
,	e.param_name as speed_param_name
,   case when cte.max_l_seq is null then 0
         else cte.max_l_seq end as max_l_seq
,   cte.max_m_seq
from
	dbo.tb_eqp_offset	a
left join 
	cte 
  on cte.eqp_code = a.eqp_code
left join 
	tb_eqpareagroup c 
  on c.eqpareagroup_code = a.eqpareagroup_code
left join 
	tb_eqparea d 
  on d.eqpareagroup_code = a.eqpareagroup_code
 and d.eqparea_code = a.eqparea_code
left outer join 
	tb_param e
  on e.eqp_code = a.eqp_code
 and e.param_id = a.speed_param_id
where
	a.corp_id = @corp_id
and a.fac_id = @fac_id
and a.eqp_code = @eqp_code
order by a.eqparea_seq
;