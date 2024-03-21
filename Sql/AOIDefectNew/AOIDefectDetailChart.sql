with cte_group as (
	select model_code,oper_code
	from tb_aoi_data_tmp
	group by model_code, oper_code
),
cte_std_defect as (
	select 
		cte_group.oper_code
		, cte_group.model_code
		, b.defect_type
		, sum(b.defect_rate) std_defect_rate
	from cte_group
	join tb_fdc_defect_rate b on cte_group.oper_code = b.oper_code and b.model_code = cte_group.model_code
	group by cte_group.oper_code, cte_group.model_code, b.defect_type
),
cte_ng as (
        select 
            sum(defect_cnt) ng_cnt
        from tb_aoi_data_tmp v_aoi
        outer apply (
	        select
		        max([4m].oper_seq_no) as oper_seq_no
            from
                dbo.tb_panel_4m [4m]
            where group_key in (
                    select a.panel_group_key 
                    from dbo.tb_panel_item a 
                    where    a.panel_id = v_aoi.panel_id
                    )
                and [4m].oper_code = v_aoi.oper_code

        ) tbl_oper 
        outer apply (
	          select
                min([4m].oper_seq_no) as oper_seq_no
            from
                dbo.tb_panel_4m [4m]
            where group_key in (
                    select a.panel_group_key 
                    from dbo.tb_panel_item a 
                    where    a.panel_id = v_aoi.panel_id
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
            where   job.JOB_NO = v_aoi.workorder
                and group_key in (
                    select a.panel_group_key 
			        from dbo.tb_panel_item a 
			        where a.panel_id = v_aoi.panel_id
		        )
		        and (
			        (tbl_oper.oper_seq_no <= 1500  and p4m.oper_seq_no < tbl_oper.oper_seq_no) or 
			        (tbl_oper.oper_seq_no > 1500 and (p4m.oper_seq_no > tbl_seq_prev.oper_seq_no and p4m.oper_seq_no < tbl_oper.oper_seq_no)) 
		        )
                and oper.WORKCENTER_ID = @workcenter_code
                and sdm_oper.OPERATION_CODE = @oper_code
                and eqp.EQUIPMENT_CODE in (select value from STRING_SPLIT( @eqp_codes, ','))
            group by eqp.EQUIPMENT_CODE
                    ,       eqp.EQUIPMENT_DESCRIPTION
                    ,       job.JOB_NO
        ) cte_eqp
        where create_dt >= @from_date and create_dt < @to_date
                and v_aoi.model_code = @model_code
                and v_aoi.app_code = @app_code
                and v_aoi.model_description like '%' + @model_name + '%'
               -- and v_aoi.oper_code = @oper_code
                and ngcode in (select value from STRING_SPLIT( @ng_codes, ','))
        group by workorder, oper_seq_no
),
cte as (
    select 
        max(pcs_total) pcs_cnt,
	    max(ng_pcs_total) ng_pcs_cnt
    from tb_aoi_data_tmp v_aoi
    outer apply (
	    select
		    max([4m].oper_seq_no) as oper_seq_no
        from
            dbo.tb_panel_4m [4m]
        where group_key in (
                select a.panel_group_key 
                from dbo.tb_panel_item a 
                where    a.panel_id = v_aoi.panel_id
                )
            and [4m].oper_code = v_aoi.oper_code

    ) tbl_oper 
    outer apply (
	      select
            min([4m].oper_seq_no) as oper_seq_no
        from
            dbo.tb_panel_4m [4m]
        where group_key in (
                select a.panel_group_key 
                from dbo.tb_panel_item a 
                where    a.panel_id = v_aoi.panel_id
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
        where   job.JOB_NO = v_aoi.workorder
            and group_key in (
                select a.panel_group_key 
			    from dbo.tb_panel_item a 
			    where a.panel_id = v_aoi.panel_id
		    )
		    and (
			    (tbl_oper.oper_seq_no <= 1500  and p4m.oper_seq_no < tbl_oper.oper_seq_no) or 
			    (tbl_oper.oper_seq_no > 1500 and (p4m.oper_seq_no > tbl_seq_prev.oper_seq_no and p4m.oper_seq_no < tbl_oper.oper_seq_no)) 
		    )
            and oper.WORKCENTER_ID = @workcenter_code
            and sdm_oper.OPERATION_CODE = @oper_code
            and eqp.EQUIPMENT_CODE in (select value from STRING_SPLIT( @eqp_codes, ','))
        group by eqp.EQUIPMENT_CODE
                ,       eqp.EQUIPMENT_DESCRIPTION
                ,       job.JOB_NO
    ) cte_eqp
    where create_dt >= @from_date and create_dt < @to_date
            -- and eqp_code = @eqp_code
            and model_code = @model_code
            and item_use_code = @app_code
            and model_description like '%' + @model_name + '%'
    group by workorder, oper_seq_no
)
select 
    sum(pcs_cnt) pcs_cnt, 
    sum(ng_pcs_cnt) ng_pcs_cnt,
    isnull((select top 1 ng_cnt from cte_ng), 0) ng_cnt
from cte

;
