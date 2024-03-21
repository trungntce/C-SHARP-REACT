with cte as 
(
	select
	    a.workorder
	    , b.judge  as judge_name
	    , count(b.judge) as ng_cnt
	    , max(a.ok_cnt) + max(a.ng_cnt) as total_cnt
	    , max(a.ok_cnt) as ok_cnt
	    , sum(a.ng_cnt) as ngpiece_cnt
	    , max(a.item_code) as item_code
	from
	    tb_bbt a
	join
	    dbo.tb_bbt_piece b
	    on a.panel_id = b.panel_id
	where
	    a.workorder = @workorder
	and b.judge = @judge_name
	group by
	    a.workorder, b.judge
), cte2 as 
( 
	select
		a.workorder ,
		sum(a.ok_cnt + a.ng_cnt) as total
	from
	        dbo.tb_bbt a
	where 
		a.workorder = @workorder
	group by 
		a.workorder
)	
select 
	cte.workorder
	, cte.judge_name
	, ng_cnt
	, total
	,  cast((cte.ng_cnt * 100) as decimal) / cast(cte2.total as decimal) as ng_rate
from 
	cte
left join
	cte2
	on cte2.workorder = cte.workorder
