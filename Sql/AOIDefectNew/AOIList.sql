with cte as (
	select 
	--v_aoi.*
        v_aoi.model_code
    ,   v_aoi.oper_code
    ,   v_aoi.model_name
	,	isnull(ele.ENTRY_DESCRIPTION, (select ENTRY_DESCRIPTION from erp_eapp_lookup_entry where LOOKUP_TYPE = 'SDM_ITEM_DIFFICULT' and ENTRY_DESCRIPTION like 'C%')) as grade
	from tb_aoi_data_tmp v_aoi
	join
		dbo.erp_sdm_item_revision sir 
		on sir.BOM_ITEM_CODE = v_aoi.model_code
	join
		dbo.erp_sdm_item_spec sis
		on sis.BOM_ITEM_ID = sir.BOM_ITEM_ID	
	left join 
		dbo.erp_eapp_lookup_entry ele
		on ele.ENTRY_CODE = sis.ITEM_DIFFICULT_LCODE	
		and ele.LOOKUP_TYPE = 'SDM_ITEM_DIFFICULT'
	where -- panel_id != pnlno AND 
		v_aoi.create_dt >= @from_month and v_aoi.create_dt < @to_month
),
cte_group as (
	select model_code,oper_code
	from cte
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
cte_all as (
        select cte.grade
                ,       cte.model_code
                ,       cte.oper_code
                ,       cte.model_name
                ,       max(oper.OPERATION_DESCRIPTION) AS oper_name
                ,   max(b.std_defect_rate) as std_defect_rate
        from cte
        left join erp_sdm_standard_operation oper on oper.OPERATION_CODE = cte.oper_code
        left join cte_std_defect b on b.oper_code = cte.oper_code and b.model_code = cte.model_code
        where cte.oper_code is not null
        group by cte.grade, cte.model_code, cte.oper_code, cte.model_name
)
select * 
from cte_all
outer apply 
(
    select
        sum(pcs_cnt) pcs_today,
        sum(ng_pcs_cnt) defect_today
    from (
        select
            max(pcs_total) pcs_cnt,
                max(ng_pcs_total) ng_pcs_cnt
        from tb_aoi_data_tmp v_aoi
        where create_dt >= @from_today and create_dt < @to_today
                and v_aoi.model_code = cte_all.model_code
                and v_aoi.oper_code = cte_all.oper_code
        group by workorder, oper_seq_no
    ) tbl
) tbl_today
outer apply 
(
    select
        sum(pcs_cnt) pcs_yesterday,
        sum(ng_pcs_cnt) defect_yesterday
    from (
        select
            max(pcs_total) pcs_cnt,
                max(ng_pcs_total) ng_pcs_cnt
        from tb_aoi_data_tmp v_aoi
        where create_dt >= @from_yesterday and create_dt < @to_yesterday
                and v_aoi.model_code = cte_all.model_code
                and v_aoi.oper_code = cte_all.oper_code
        group by workorder, oper_seq_no
    ) tbl
) tbl_yesterday
outer apply 
(
    select
        sum(pcs_cnt) pcs_week,
        sum(ng_pcs_cnt) defect_week
    from (
        select
            max(pcs_total) pcs_cnt,
                max(ng_pcs_total) ng_pcs_cnt
        from tb_aoi_data_tmp v_aoi
        where create_dt >= @from_week and create_dt < @to_week
                and v_aoi.model_code = cte_all.model_code
                and v_aoi.oper_code = cte_all.oper_code
        group by workorder, oper_seq_no
    ) tbl
) tbl_week
outer apply 
(
    select
        sum(pcs_cnt) pcs_month,
        sum(ng_pcs_cnt) defect_month
    from (
        select
            max(pcs_total) pcs_cnt,
                max(ng_pcs_total) ng_pcs_cnt
        from tb_aoi_data_tmp v_aoi
        where create_dt >= @from_month and create_dt < @to_month
                and v_aoi.model_code = cte_all.model_code
                and v_aoi.oper_code = cte_all.oper_code
        group by workorder, oper_seq_no
    ) tbl
) tbl_month
where (tbl_today.defect_today > 0 or tbl_yesterday.defect_yesterday > 0 or tbl_week.defect_week > 0 or tbl_month.defect_month > 0);
--cte_all as (
--	select cte.grade
--		, 	cte.model_code
--		, 	cte.oper_code 
--		, 	cte.model_name
--		, 	max(oper.OPERATION_DESCRIPTION) AS oper_name
--		,   max(b.std_defect_rate) as std_defect_rate
--		,   sum(case when cte.create_dt >= @from_today and cte.create_dt < @to_today then cte.ng_pcs_total else 0 end) as defect_today
--		,   sum(case when cte.create_dt >= @from_yesterday and cte.create_dt < @to_yesterday then cte.ng_pcs_total else 0 end) as defect_yesterday
--		,   sum(case when cte.create_dt >= @from_week and cte.create_dt < @to_week then cte.ng_pcs_total else 0 end) as defect_week
--		,   sum(case when cte.create_dt >= @from_month and cte.create_dt < @to_month then cte.ng_pcs_total else 0 end) as defect_month
--		,   sum(case when cte.create_dt >= @from_today and cte.create_dt < @to_today then pcs_total else 0 end) as pcs_today
--		,   sum(case when cte.create_dt >= @from_yesterday and cte.create_dt < @to_yesterday then pcs_total else 0 end) as pcs_yesterday
--		,   sum(case when cte.create_dt >= @from_week and cte.create_dt < @to_week then pcs_total else 0 end) as pcs_week
--		,   sum(case when cte.create_dt >= @from_month and cte.create_dt < @to_month then pcs_total else 0 end) as pcs_month
--	from cte
--	left join erp_sdm_standard_operation oper on oper.OPERATION_CODE = cte.oper_code
--	left join cte_std_defect b on b.oper_code = cte.oper_code and b.model_code = cte.model_code
--	where cte.oper_code is not null
--	group by cte.grade, cte.model_code, cte.oper_code, cte.model_name
--)

--select * from cte_all where (defect_today > 0 or defect_yesterday > 0 or defect_week > 0 or defect_month > 0);
