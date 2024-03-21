select
        max(a.mesdate)          as mesdate,
    (
        select max(p4m.start_dt) from tb_panel_4m p4m
        where p4m.workorder = max(a.workorder)
        and p4m.eqp_code = max(a.eqp_code) and p4m.oper_code = max(a.oper_code)
    ) as start_dt,
    (
        select max(p4m.end_dt) from tb_panel_4m p4m
        where p4m.workorder = max(a.workorder)
        and p4m.eqp_code = max(a.eqp_code) and p4m.oper_code = max(a.oper_code)
    ) as end_dt,
        ''              as scan_dt,
        max(a.item_code)                as item_code,
        max(a.item_name)                as item_name,
        max(a.eqp_code)                 as eqp_code,
        max(a.model_code)       as model_code,
        (
                select top 1 sdm_oper.OPERATION_DESCRIPTION
                from dbo.erp_sdm_standard_operation sdm_oper
                where sdm_oper.OPERATION_CODE = max(a.oper_code)
        ) as [app_name],
        a.oper_code as oper_code,
        max(a.eqp_name) as [eqp_name],
        max(a.workorder) as workorder ,
        max(a.layer) as layer ,
        max(cte_rate.std_rate) as std_rate,
        max(cte_rate.none_rate) as none_rate,
        max(cte_rate.open_rate)  as open_rate,
        max(cte_rate.short_rate)  as short_rate,
        max(cte_rate.khuyet_rate)  as khuyet_rate,
        max(cte_rate.khuyet_phan_tren_rate)  as khuyet_phan_tren_rate,
        max(cte_rate.loi_rate)  as loi_rate,
        max(cte_rate.foot_rate)  as foot_rate,
        max(cte_rate.pit_rate)  as pit_rate,
        max(cte_rate.dry_film_rate)  as dry_film_rate,
        max(cte_rate.lech_hole_rate)  as lech_hole_rate,
        max(cte_rate.pin_hole_rate)  as pin_hole_rate,
        max(cte_rate.ma_tac_hole_rate)  as ma_tac_hole_rate,
        max(cte_rate.nhan_rate)  as nhan_rate,
        max(cte_rate.bien_mau_rate)  as bien_mau_rate,
        max(cte_rate.cham_den_rate)  as cham_den_rate,
        max(cte_rate.qua_et_rate)  as qua_et_rate,
        max(cte_rate.di_vat_rate)  as di_vat_rate,
        max(cte_rate.tenting_rate)  as tenting_rate,
        max(cte_rate.gai_dong_rate)  as gai_dong_rate,
        max(cte_rate.ngam_dung_dich_rate)  as ngam_dung_dich_rate,
        max(cte_rate.dimple_rate)  as dimple_rate,
        max(cte_rate.void_rate)  as void_rate,
        max(cte_rate.cup_rate)  as cup_rate,
        max(cte_rate.tran_dong_rate)  as tran_dong_rate,
        max(cte_rate.khac_rate)  as khac_rate,
        count(distinct a.panel_id) as panel_cnt,
        --isnull((
        --    select ONHAND_PNL_QTY 
        --    from dbo.erp_wip_job_entities_mes 
        --    where JOB_NO = max(a.workorder)),0
        --) as panel_qty,
        isnull(max(a.panel_qty), 0) as panel_qty,
        isnull(sum(a.defect_cnt), 0)       as ng_cnt,
        --isnull(max(a.pcs_total), 0) as pcs_total,
        isnull(max(a.pcs_total), 
            (select max(spec.PCS_PER_PNL_QTY)
             from dbo.erp_sdm_item_spec spec
    		 join dbo.erp_wip_job_entities job
                on spec.BOM_ITEM_ID = job.BOM_ITEM_ID
    		 where job.JOB_NO = ( select top 1 workorder 
                    from tb_vrs 
                    where max(a.model_code) like '%' + model_code + '%' 
                    and create_dt >= @from_dt and create_dt < @to_dt)
            ) * max(a.panel_qty)
        ) as pcs_total,
        isnull(max(a.ng_pcs_total), 0) as ng_pcs_total,
        --isnull(max(a.ng_rate), 0) as ng_rate,
        isnull(sum(a.[none]), 0) as [none],
        isnull(sum(a.[open]), 0) as [open],
        isnull(sum(a.[short]), 0) as [short],
        isnull(sum(a.[khuyet]), 0) as [khuyet],
        isnull(sum(a.[khuyet_phan_tren]), 0) as [khuyet_phan_tren],
        isnull(sum(a.[loi]), 0) as [loi],
        isnull(sum(a.[foot]), 0) as [foot],
        isnull(sum(a.[pit]), 0) as [pit],
        isnull(sum(a.[dry_film]), 0) as [dry_film],
        isnull(sum(a.[lech_hole]), 0) as [lech_hole],
        isnull(sum(a.[pin_hole]), 0) as [pin_hole],
        isnull(sum(a.[ma_tac_hole]), 0) as [ma_tac_hole],
        isnull(sum(a.[nhan]), 0) as [nhan],
        isnull(sum(a.[bien_mau]), 0) as [bien_mau],
        isnull(sum(a.[cham_den]), 0) as [cham_den],
        isnull(sum(a.[qua_et]), 0) as [qua_et],
        isnull(sum(a.[di_vat]), 0) as [di_vat],
        isnull(sum(a.[tenting]), 0) as [tenting],
        isnull(sum(a.[gai_dong]), 0) as [gai_dong],
        isnull(sum(a.[ngam_dung_dich]), 0) as [ngam_dung_dich],
        isnull(sum(a.[dimple]), 0) as [dimple],
        isnull(sum(a.[void]), 0) as [void],
        isnull(sum(a.[cup]), 0) as [cup],
        isnull(sum(a.[tran_dong]), 0) as [tran_dong],
        isnull(sum(a.khac), 0) as [khac]
        --(
        --    isnull(sum(a.[none]), 0)
        --    + isnull(sum(a.[open]), 0)
        --    + isnull(sum(a.[short]), 0)
        --    + isnull(sum(a.[khuyet]), 0)
        --    + isnull(sum(a.[khuyet_phan_tren]), 0)
        --    + isnull(sum(a.[loi]), 0)
        --    + isnull(sum(a.[foot]), 0)
        --    + isnull(sum(a.[pit]), 0)
        --    + isnull(sum(a.[dry_film]), 0)
        --    + isnull(sum(a.[lech_hole]), 0)
        --    + isnull(sum(a.[pin_hole]), 0)
        --    + isnull(sum(a.[ma_tac_hole]), 0)
        --    + isnull(sum(a.[nhan]), 0)
        --    + isnull(sum(a.[bien_mau]), 0)
        --    + isnull(sum(a.[cham_den]), 0)
        --    + isnull(sum(a.[qua_et]), 0)
        --    + isnull(sum(a.[di_vat]), 0)
        --    + isnull(sum(a.[tenting]), 0)
        --    + isnull(sum(a.[gai_dong]), 0)
        --    + isnull(sum(a.[ngam_dung_dich]), 0)
        --    + isnull(sum(a.[dimple]), 0)
        --    + isnull(sum(a.[void]), 0)
        --    + isnull(sum(a.[cup]), 0)
        --    + isnull(sum(a.[tran_dong]), 0)
        --) as ng_qty
from
        --v_aoi a
        dbo.fn_aoi_data(@from_dt, @to_dt) a
outer apply
(
    select
        fd.model_code,
        fd.oper_code,
        max(fd.defect_type) as defect_type,
        isnull(sum(fd.defect_rate), 0) as std_rate,
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = '0') as none_rate,
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = '1') as open_rate,
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = '2') as short_rate,
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = '3') as khuyet_rate,
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = '4') as khuyet_phan_tren_rate,
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = '5') as loi_rate,
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = '6') as foot_rate,
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = '7') as pit_rate,
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = '8') as dry_film_rate,
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = '9') as lech_hole_rate,
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = '10') as pin_hole_rate,
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = '11') as ma_tac_hole_rate,
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = '12') as nhan_rate,
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = '13') as bien_mau_rate,
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = '14') as cham_den_rate,
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = '15') as qua_et_rate,
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = '16') as di_vat_rate,
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = '17') as tenting_rate,
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = '18') as gai_dong_rate,
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = '19') as ngam_dung_dich_rate,
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = '20') as dimple_rate,
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = '21') as void_rate,
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = '22') as cup_rate,
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = '23') as tran_dong_rate,
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = '24') as khac_rate
    from tb_fdc_defect_rate fd
    where fd.defect_type is null
        and fd.model_code = a.model_code
        and fd.oper_code = a.oper_code
    group by fd.model_code, fd.oper_code
) cte_rate
where 1 = 1
--and	a.mesdate between @from_mes and @to_mes
--and a.create_dt >= @from_dt and a.create_dt < @to_dt
and a.eqp_code = @eqp_code
and a.item_code = @item_code
and a.item_name like '%' + @item_name + '%'
--and a.workorder like '%' + @workorder + '%'
and a.workorder = @workorder
and	a.model_code = @model_code
and a.app_code = @app_code
and a.panel_qty > 0
--and (a.pcs_total > 0 
--and a.ng_pcs_total > 0 
--and a.defect_cnt > 0)
--and a.item_code is not null 
--and a.model_code is not null
group by
	case when @groupby = 'EQP' then a.eqp_code end
,	case when @groupby != 'EQP' then a.vendor_code end
,	case when @groupby != 'EQP' and (@groupby = 'ITEM' or @groupby = 'MODEL' or @groupby = 'LOT') then a.item_code end
,	case when @groupby != 'EQP' and (@groupby = 'MODEL' or @groupby = 'LOT') then a.model_code end
,	case when @groupby != 'EQP' and  @groupby = 'LOT' then a.workorder end
,	a.oper_code