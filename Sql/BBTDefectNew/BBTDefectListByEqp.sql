select mes_date
    , isnull(max(bbt.ok_cnt) + max(bbt.ng_cnt), 0) pcs_total
	, (
			isnull(max(bbt.[4w_cnt]), 0)
		+	isnull(max(bbt.[aux_cnt]), 0)
		+	isnull(max(bbt.[both_cnt]), 0)
		+	isnull(max(bbt.[c_cnt]), 0)	
		+	isnull(max(bbt.[er_cnt]), 0)
		+	isnull(max(bbt.[open_cnt]), 0)
		+	isnull(max(bbt.[spk_cnt]), 0)
		+	isnull(max(bbt.[short_cnt]), 0)
    ) ng_pcs_cnt
    --, isnull(max(bbt.ng_cnt), 0) ng_pcs_cnt
    --, count(1) ng_cnt
    , cte_eqp.eqp_code
    , cte_eqp.eqp_name
    , cd.code_name ng_name
    , cd.code_id ng_code
    , bbt.match_panel_id panel_id
from v_bbt bbt
join dbo.tb_bbt_piece b on b.panel_id = bbt.panel_id
join dbo.tb_code cd
	on	b.judge = cd.code_id
	and cd.codegroup_id = 'BBT_DEFECT_MPD'
outer apply (
	select
		max([4m].oper_seq_no) as oper_seq_no
    from
        dbo.tb_panel_4m [4m]
    where group_key in (
            select a.panel_group_key 
            from dbo.tb_panel_item a 
            where    a.panel_id = bbt.match_panel_id
            )
        and [4m].oper_code = bbt.oper_code
        and [4m].oper_code in ('B02010','B02020','B02030')
) tbl_oper 
outer apply (
	  select
        max([4m].oper_seq_no) as oper_seq_no
    from
        dbo.tb_panel_4m [4m]
    where group_key in (
            select a.panel_group_key 
            from dbo.tb_panel_item a 
            where    a.panel_id = bbt.match_panel_id
            )
        and [4m].oper_code in ('E05010','E05020','E05030','E05040')

) tbl_seq_prev
cross apply (
	 select
        eqp.EQUIPMENT_CODE eqp_code, job.JOB_NO job_no, eqp.EQUIPMENT_DESCRIPTION eqp_name
    from
            dbo.erp_wip_job_entities job
    join
            dbo.erp_wip_operations oper
            on      job.JOB_ID = oper.JOB_ID
    join
            dbo.erp_sdm_standard_operation sdm_oper
            on oper.OPERATION_ID = sdm_oper.OPERATION_ID
    join tb_panel_4m p4m on p4m.oper_code = sdm_oper.OPERATION_CODE
            and job.JOB_NO = p4m.workorder
    join dbo.erp_sdm_standard_equipment eqp
            on p4m.eqp_code = eqp.EQUIPMENT_CODE
    where   job.JOB_NO = bbt.workorder
        and group_key in (
            select a.panel_group_key 
			from dbo.tb_panel_item a 
			where a.panel_id = bbt.match_panel_id
		)
		and ((tbl_seq_prev.oper_seq_no >= 1100 and (p4m.oper_seq_no > tbl_seq_prev.oper_seq_no and p4m.oper_seq_no < tbl_oper.oper_seq_no)) 
        or (tbl_seq_prev.oper_seq_no is null and p4m.oper_seq_no > 5100  and p4m.oper_seq_no < tbl_oper.oper_seq_no))
        and sdm_oper.OPERATION_CODE = @oper_code
    group by eqp.EQUIPMENT_CODE
            ,       eqp.EQUIPMENT_DESCRIPTION
            ,       job.JOB_NO
) cte_eqp
where  bbt.create_dt >= @from_dt and bbt.create_dt < @to_dt
	and bbt.model_code = @model_code
	and bbt.item_use_code = @app_code
	and cd.code_id in (select value from STRING_SPLIT( @ng_codes, ','))
group by bbt.mes_date
    , cte_eqp.eqp_code
    , cte_eqp.eqp_name
	, cd.code_name
    , cd.code_id
    , bbt.match_panel_id
;
