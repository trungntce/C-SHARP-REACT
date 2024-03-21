select
    a.panel_id
    , c.piece_no
    , max(d.code_name) as judge_name
    , count(b.judge) as ng_cnt
    , max(a.ok_cnt) + max(a.ng_cnt) as total_cnt
    , max(a.ok_cnt) as ok_cnt
    , max(a.ng_cnt) as ngpiece_cnt
from
    tb_bbt a
join
    dbo.tb_bbt_piece b
    on a.panel_id = b.panel_id
join
    dbo.tb_bbt_piece_ng c
    on b.panel_id = c.panel_id
    and b.piece_no = c.piece_no
--left join 
--	dbo.tb_code d 
--	on d.code_id = b.judge
--	and d.codegroup_id ='BBT_DEFECT'
where
    a.panel_id = @panel_id
group by 
    a.panel_id, c.piece_no, b.judge
order by 
    c.piece_no