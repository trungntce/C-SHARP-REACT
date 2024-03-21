	select 
	    cte_eqp.PCS_PER_PNL_QTY pcs_total,
	    cte_eqp.eqp_code,
        cte_eqp.eqp_name,
	    cd.code_name ng_name,
	    v_aoi.mesdate mes_date,
        v_aoi.ngcode ng_code,
        v_aoi.panel_id,
        isnull(sum(case 
		    when ngcode = 0 then [none]
		    when ngcode = 1 then [open]
		    when ngcode = 2 then [short]
		    when ngcode = 3 then [khuyet]
		    when ngcode = 4 then [khuyet_phan_tren]
		    when ngcode = 5 then [loi]
		    when ngcode = 6 then [foot]
		    when ngcode = 7 then [pit]
		    when ngcode = 8 then [dry_film]
		    when ngcode = 9 then [lech_hole]
		    when ngcode = 10 then [pin_hole]
		    when ngcode = 11 then [ma_tac_hole]
		    when ngcode = 12 then [nhan]
		    when ngcode = 13 then [bien_mau]
		    when ngcode = 14 then [cham_den]
		    when ngcode = 15 then [qua_et]
		    when ngcode = 16 then [di_vat]
		    when ngcode = 17 then [tenting]
		    when ngcode = 18 then [gai_dong]
		    when ngcode = 19 then [ngam_dung_dich]
		    when ngcode = 20 then [dimple]
		    when ngcode = 21 then [void]
		    when ngcode = 22 then [cup]
		    when ngcode = 23 then [cup]
            else 0
	    end), 0) ng_pcs_cnt
    from tb_aoi_data_tmp v_aoi
    join tb_code cd on cd.codegroup_id = 'VRS_NG_CODE' and cd.code_id = v_aoi.ngcode
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
            eqp.EQUIPMENT_CODE eqp_code
            , job.JOB_NO job_no
            , eqp.EQUIPMENT_DESCRIPTION eqp_name
            , max(spec.PCS_PER_PNL_QTY) PCS_PER_PNL_QTY
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
        left join
			    dbo.erp_sdm_item_spec spec
			    on      spec.BOM_ITEM_ID = job.BOM_ITEM_ID
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
            and sdm_oper.OPERATION_CODE = @oper_code
        group by eqp.EQUIPMENT_CODE
                ,       eqp.EQUIPMENT_DESCRIPTION
                ,       job.JOB_NO
    ) cte_eqp
    where v_aoi.create_dt >= @from_dt and v_aoi.create_dt < @to_dt
	    and v_aoi.ngcode in (select value from STRING_SPLIT( @ng_codes, ','))
        and v_aoi.model_code = @model_code
     --   and v_aoi.panel_id != v_aoi.pnlno
    group by cte_eqp.eqp_code, cte_eqp.eqp_name, cd.code_name,v_aoi.mesdate, v_aoi.ngcode, cte_eqp.PCS_PER_PNL_QTY, v_aoi.panel_id
    order by v_aoi.mesdate, cte_eqp.eqp_code, v_aoi.ngcode;