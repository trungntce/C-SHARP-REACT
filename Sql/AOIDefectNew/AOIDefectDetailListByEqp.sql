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
)

select
        cte_eqp.PCS_PER_PNL_QTY pcs_total,
        cte_eqp.eqp_code,
        cte_eqp.eqp_name,
        cd.code_name ng_name,
		cd.code_id ng_code,
        max(v_aoi.create_dt) mes_date,
		v_aoi.panel_id,
		v_aoi.workorder,
        max(b.std_defect_rate) std_defect_rate,
        isnull(sum(case 
		    when v_aoi.ngcode = 0 then v_aoi.[none]
		    when v_aoi.ngcode = 1 then v_aoi.[open]
		    when v_aoi.ngcode = 2 then v_aoi.[short]
		    when v_aoi.ngcode = 3 then v_aoi.[khuyet]
		    when v_aoi.ngcode = 4 then v_aoi.[khuyet_phan_tren]
		    when v_aoi.ngcode = 5 then v_aoi.[loi]
		    when v_aoi.ngcode = 6 then v_aoi.[foot]
		    when v_aoi.ngcode = 7 then v_aoi.[pit]
		    when v_aoi.ngcode = 8 then v_aoi.[dry_film]
		    when v_aoi.ngcode = 9 then v_aoi.[lech_hole]
		    when v_aoi.ngcode = 10 then v_aoi.[pin_hole]
		    when v_aoi.ngcode = 11 then v_aoi.[ma_tac_hole]
		    when v_aoi.ngcode = 12 then v_aoi.[nhan]
		    when v_aoi.ngcode = 13 then v_aoi.[bien_mau]
		    when v_aoi.ngcode = 14 then v_aoi.[cham_den]
		    when v_aoi.ngcode = 15 then v_aoi.[qua_et]
		    when v_aoi.ngcode = 16 then v_aoi.[di_vat]
		    when v_aoi.ngcode = 17 then v_aoi.[tenting]
		    when v_aoi.ngcode = 18 then v_aoi.[gai_dong]
		    when v_aoi.ngcode = 19 then v_aoi.[ngam_dung_dich]
		    when v_aoi.ngcode = 20 then v_aoi.[dimple]
		    when v_aoi.ngcode = 21 then v_aoi.[void]
		    when v_aoi.ngcode = 22 then v_aoi.[cup]
		    when v_aoi.ngcode = 23 then v_aoi.[cup]
            else 0
	    end), 0) ng_pcs_cnt
from tb_aoi_data_tmp v_aoi
join tb_code cd on cd.codegroup_id = 'VRS_NG_CODE' and cd.code_id = v_aoi.ngcode
left join cte_std_defect b on b.oper_code = v_aoi.oper_code and b.model_code = v_aoi.model_code
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
    where job.JOB_NO = v_aoi.workorder
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
where v_aoi.create_dt >= @from_dt and v_aoi.create_dt < @to_dt
        and v_aoi.ngcode in (select value from STRING_SPLIT( @ng_codes, ','))
    and v_aoi.model_code = @model_code
--	and v_aoi.panel_id != v_aoi.pnlno
group by cte_eqp.eqp_code, cte_eqp.eqp_name, cd.code_id, cd.code_name, v_aoi.panel_id,v_aoi.workorder, cte_eqp.PCS_PER_PNL_QTY, v_aoi.panel_id
;