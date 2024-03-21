with cte as 
(
	select
		  a.item_code
		, max(b.judge)  as judge_name
		, count(b.judge) as judge_cnt
	from
		dbo.tb_bbt a
	join
		dbo.tb_bbt_piece b
		on a.panel_id = b.panel_id
	where
		a.corp_id = @corp_id
	and	a.fac_id = @fac_id
	and a.create_dt >= @from_dt and a.create_dt < @to_dt
	and a.item_code = @item_code
	and	a.workorder like '%' + @workorder + '%'
	and a.match_panel_id like '%' + @panel_id + '%'
	and a.item_code is not null
	group by 
		a.item_code, b.judge
), cte2 as 
( 
	select
		a.item_code ,
		sum(a.ok_cnt + a.ng_cnt) as total
	from
	        dbo.tb_bbt a
	where 
		a.corp_id = @corp_id
	and	a.fac_id = @fac_id
	and a.create_dt >= @from_dt and a.create_dt < @to_dt
	and a.item_code = @item_code
	and	a.workorder like '%' + @workorder + '%'
	and a.match_panel_id like '%' + @panel_id + '%'
	and a.item_code is not null
	group by 
		a.item_code
)	
select
	cte.*
    , cte2.total
	, cast((cte.judge_cnt * 100) as decimal) / cast(cte2.total as decimal) ng_rate
from
    cte
left join
    cte2
    on cte2.item_code = cte.item_code
order by 
	cte.judge_name
;