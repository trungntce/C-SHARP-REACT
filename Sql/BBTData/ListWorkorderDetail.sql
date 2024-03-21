with cte_pnl as
(
        select
                item.panel_id as match_panel_id,
                item.scan_dt as scan_time
        from
                dbo.tb_panel_item item
        where
                item.panel_group_key in (
            select top 1 p4.group_key
            from tb_panel_4m p4
        where p4.workorder = @workorder
        and p4.oper_code = @oper_code
        and p4.eqp_code = @eqp_code
        )
), cte as (
        select
                isnull(bbt.match_panel_id, bbt.panel_seq) as match_panel_id
                , max(bbt.panel_id) as panel_id
                , cd.code_name as judge_name
                , count(pie.judge) judge_cnt
                , max(bbt.workorder) as workorder
                ,   ( select top 1 p4m.oper_code
                    from tb_panel_4m p4m
                    where p4m.workorder = @workorder
                        and p4m.eqp_code = @eqp_code
                        and p4m.oper_code in ('B02010','B02020','B02030')
                ) as oper_code
                ,max(bbt.eqp_code) as eqp_code
    	from
    			dbo.tb_bbt_piece pie
    	join
    			dbo.tb_code cd
    			on      pie.judge = cd.code_id
    			and cd.codegroup_id = 'BBT_DEFECT_MPD'
    	join dbo.tb_bbt bbt on pie.panel_id = bbt.panel_id
    	where [time] between @from_dt and @to_dt
    		and bbt.workorder = @workorder
            and bbt.eqp_code = @eqp_code
    	group by
    			bbt.match_panel_id, cd.code_name, bbt.panel_seq, bbt.eqp_code
), cte_list as
(
select
        --ROW_NUMBER() OVER(ORDER BY (SELECT 1)) as row_num,
        c.match_panel_id
        , (select top 1 c1.judge_name
                from cte c1 where c1.match_panel_id = c.match_panel_id
                        and c1.judge_cnt = (select max(c2.judge_cnt) from cte c2 where c2.match_panel_id = c.match_panel_id)) as judge_name
        , (select isnull(sum(judge_cnt), 0) from cte where match_panel_id = c.match_panel_id ) as worst_total
        , max(c.judge_cnt) judge_cnt
        , null as scan_time
        , max(c.workorder) as workorder
        , max(c.oper_code) as oper_code
        , max(c.eqp_code) as eqp_code
        , (select isnull(sum(ok_cnt + ng_cnt), 0) from tb_bbt where match_panel_id = c.match_panel_id or panel_id = max(c.panel_id)) as total_cnt -- pcs total
from cte c
group by c.match_panel_id
), cte_union as
(
select
    pnl.match_panel_id as match_panel_id,
    ls.judge_name as judge_name,
    ls.worst_total as worst_total,
    ls.judge_cnt as judge_cnt,
    pnl.scan_time as scan_time,
    ls.workorder as workorder,
    ls.oper_code as oper_code,
    ls.eqp_code as eqp_code,
    ls.total_cnt   as total_cnt
from cte_list ls
right join cte_pnl pnl
on ls.match_panel_id = pnl.match_panel_id
union
select cte_list. *
from cte_list
where cte_list.match_panel_id not in (select match_panel_id from cte_pnl)
)
select 
    ROW_NUMBER() OVER(ORDER BY (SELECT 1)) AS row_num,
	cte_union.*
from cte_union
;