with cte as 
(
	select
	    a.panel_id
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
	    a.panel_id = @panel_id
	and b.judge = @judge_name
	group by
	    a.panel_id, b.judge
), cte2 as 
( 
	select
		a.panel_id ,
		sum(a.ok_cnt + a.ng_cnt) as total
	from
	        dbo.tb_bbt a
	where 
		a.panel_id = @panel_id
	group by 
		a.panel_id
)	
select 
	cte.panel_id
	, cte.judge_name
	, ng_cnt
	, total
	,  cast((cte.ng_cnt * 100) as decimal) / cast(cte2.total as decimal) as ng_rate
from 
	cte
left join
	cte2
	on cte2.panel_id = cte.panel_id