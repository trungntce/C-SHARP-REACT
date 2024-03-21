with cte_item as
(
	select
		item.*
	,	[real].workorder as workorder_real
	from
		dbo.tb_panel_item item
	join
		dbo.tb_panel_realtime [real]
		on	item.panel_id = [real].panel_id
	where
		item.create_dt >= @from_dt and item.create_dt < @to_dt
	and	[real].workorder = @workorder
	and	(item.param_judge = 'N' or item.recipe_judge = 'N')
), cte_4m as -- 판넬 4M 스캔 정보
(
    select
        row_number() over (partition by group_key order by row_key) as row_num -- group_key 로 첫번째
    ,   [4m].*
		
	,	job.JOB_STATUS_CODE				as job_status_code
	,	job.CREATION_DATE				as creation_date

	,	item.ITEM_CODE					as item_code
	,	item.ITEM_DESCRIPTION			as item_description

	--,	model.BOM_ITEM_CODE				as model_code
	,	model.BOM_ITEM_DESCRIPTION		as model_description

	,	sdm_oper.OPERATION_DESCRIPTION	as oper_description
	,	concat_ws('::',sdm_oper.OPERATION_DESCRIPTION,sdm_oper_tl.OPERATION_DESCRIPTION,'') as tran_oper_name
    from
        dbo.tb_panel_4m [4m]
	join
		dbo.erp_wip_job_entities job
		on	[4m].workorder = job.JOB_NO
	join
		dbo.erp_wip_operations oper
		on	job.JOB_ID = oper.JOB_ID
		and [4m].oper_seq_no = oper.OPERATION_SEQ_NO
	join
		dbo.erp_sdm_standard_operation sdm_oper
		on oper.OPERATION_ID = sdm_oper.OPERATION_ID
	join
		dbo.erp_sdm_standard_operation_tl sdm_oper_tl
		on sdm_oper.OPERATION_ID = sdm_oper_tl.OPERATION_ID
	join
		dbo.erp_inv_item_master item
		on	job.INVENTORY_ITEM_ID = item.INVENTORY_ITEM_ID
	join
		dbo.erp_sdm_item_revision model
		on job.BOM_ITEM_ID = model.BOM_ITEM_ID
	where
		[4m].group_key in (select panel_group_key from cte_item)
	and	item.ITEM_CODE = @item_code
	and item.ITEM_DESCRIPTION like '%' + @item_name + '%'
	and	model.BOM_ITEM_CODE = @model_code
	and model.BOM_ITEM_DESCRIPTION like '%' + @model_name + '%'
), cte as
(
	select
		cte_item.*

	,	cte_4m.job_status_code
	,	cte_4m.creation_date

	,	cte_4m.item_code
	,	cte_4m.item_description

	,	cte_4m.model_code
	,	cte_4m.model_description

	,	cte_4m.oper_description
	,	cte_4m.tran_oper_name
	from
		cte_item
	join 
		cte_4m
		on cte_item.panel_group_key = cte_4m.group_key
	where
		cte_4m.row_num = 1
)
--, cte_recipe as -- 레시피 데이터
--(
--    select
--        a.*
--    ,   b.recipe_name
--    from
--        dbo.tb_panel_recipe a
--    join
--        dbo.tb_recipe b
--        on a.recipe_code = b.recipe_code
--    where
--        a.panel_id in (select panel_id from cte)
--), cte_param as  -- 파라미터 데이터
--(
--    select
--        a.*
--    ,   b.param_name
--    from
--        dbo.tb_panel_param a
--    join
--        dbo.tb_param b
--        on a.param_id = b.param_id
--    where
--        a.panel_id in (select panel_id from cte)
--)
select
	*
--,   (select * from cte_recipe where cte_recipe.item_key = cte.item_key for json auto) as recipe_json
--,   (select * from cte_param where cte_param.item_key = cte.item_key for json auto) as param_json
from
	cte
order by 
	panel_id
;