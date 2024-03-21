with cte as (
select
        isnull(bbt.match_panel_id, bbt.panel_seq) as match_panel_id
        --, max(bbt.panel_id) as panel_id
        , cd.code_name as judge_name
        , count(pie.judge) judge_cnt
        , (
            select
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
            and item.panel_id = @panel_id
        ) as scan_time
        , max(bbt.eqp_description) as eqp_name
        , '' dpu_rate
        , (
                select top 1 roll.roll_id
                from dbo.tb_roll_item as roll
                where
                        roll.roll_group_key in (
                                        select [4m].group_key
                                        from dbo.tb_panel_4m [4m]
                                        join dbo.erp_sdm_standard_equipment eqp
                                                on      [4m].eqp_code = eqp.EQUIPMENT_CODE
                                        where [4m].workorder = bbt.workorder
                                )
        ) as roll_id
from
                dbo.tb_bbt_piece pie
join
                dbo.tb_code cd
                on      pie.judge = cd.code_id
                and cd.codegroup_id = 'BBT_DEFECT_MPD'
join dbo.tb_bbt bbt on pie.panel_id = bbt.panel_id
where [time] between @from_dt and @to_dt
        and (bbt.match_panel_id = @panel_id or cast(bbt.panel_seq as varchar) = @panel_id)
        and bbt.workorder = @workorder
group by bbt.match_panel_id,
                 --bbt.panel_id, 
                 cd.code_name, bbt.model_code, pie.eqp_code, bbt.workorder, bbt.panel_seq
)
select
        ROW_NUMBER() OVER(ORDER BY (SELECT 1)) AS row_id,
        c.judge_name as judge_name,
        isnull(sum(c.judge_cnt), 0) as judge_cnt,
        max(c.scan_time) as scan_time,
        max(c.eqp_name) as eqp_name,
        max(c.roll_id) as roll_id,
        (select isnull(sum(judge_cnt), 0) from cte where match_panel_id = c.match_panel_id ) as total_ng
from cte c
group by c.match_panel_id, c.judge_name

--with cte as (
--select
--	 bbt.match_panel_id
--	, cd.code_name as judge_name
--	, count(pie.judge) judge_cnt
--	, max([time]) as scan_time
--	, max(bbt.eqp_description) as eqp_name
--	, '' dpu_rate
--	, (
--		select top 1 roll.roll_id
--		from dbo.tb_roll_item as roll
--		where
--			roll.roll_group_key in (
--					select [4m].group_key
--					from dbo.tb_panel_4m [4m]
--					join dbo.erp_sdm_standard_equipment eqp
--						on	[4m].eqp_code = eqp.EQUIPMENT_CODE
--					where [4m].workorder = bbt.workorder
--				)
--	) as roll_id
--from
--		dbo.tb_bbt_piece pie
--join
--		dbo.tb_code cd
--		on      pie.judge = cd.code_id
--		and cd.codegroup_id = 'BBT_DEFECT_MPD'
--join dbo.tb_bbt bbt on pie.panel_id = bbt.panel_id
--where [time] between @from_dt and @to_dt
--	and bbt.match_panel_id = @panel_id
--group by bbt.match_panel_id,
--		 bbt.panel_id
--		, cd.code_name, bbt.model_code, pie.eqp_code, bbt.workorder
--)
--select 
--	ROW_NUMBER() OVER(ORDER BY (SELECT 1)) AS row_id, 
--	c.judge_name as judge_name,
--	max(c.judge_cnt) as judge_cnt,
--	max(c.scan_time) as scan_time,
--	max(c.eqp_name) as eqp_name,
--	max(c.roll_id) as roll_id,
--	(select isnull(sum(judge_cnt), 0) from cte where match_panel_id = c.match_panel_id ) as total_ng
--from cte c
--group by c.match_panel_id, c.judge_name