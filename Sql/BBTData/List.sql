with cte_rate as 
(
    select
        fd.model_code,
        fd.oper_code,
        max(fd.defect_type) as defect_type,
        isnull(sum(fd.defect_rate), 0) as std_rate,
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = '4W') as [4w_cnt_std_rate],
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = 'AUX') as [aux_cnt_std_rate],
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = 'Both') as [both_cnt_std_rate],
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = 'C') as [c_cnt_std_rate],
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = 'ER') as [er_cnt_std_rate],
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = 'Open') as [open_cnt_std_rate],
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = 'SPK') as [spk_cnt_std_rate],
        (select f1.defect_rate from tb_fdc_defect_rate f1 where f1.model_code = fd.model_code and f1.oper_code = fd.oper_code and f1.defect_type = 'Short') as [short_cnt_std_rate]
    from tb_fdc_defect_rate fd
    where fd.defect_type is null
    group by fd.model_code, fd.oper_code
), 
cte as (
select
        max(bbt.mes_date) mes_date
        ,       min(bbt.start_dt) start_dt
        ,       max(bbt.end_dt) end_dt
        ,       max(bbt.item_code) item_code
        ,       max(bbt.item_name) item_name
        ,       max(bbt.model_description) model_description -- model name
        ,       max(bbt.app_name) app_name
        ,       max(bbt.model_code) model_code
        ,       max(bbt.workorder) workorder -- batch no
        ,       bbt.eqp_code
        ,       bbt.eqp_name
        ,       bbt.tool_id
        ,   bbt.oper_code as oper_code
		,	count(1) panel_cnt
		,	isnull(sum(bbt.ok_cnt), 0) as ok_cnt
		,	isnull(sum(bbt.ng_cnt), 0)	as ng_cnt
		,	isnull(sum(bbt.ok_cnt + bbt.ng_cnt), 0) as total_cnt
		,	0 as total_sdt -- TODO
		--,	0 as total_sdt_rate -- todo
		,	isnull(sum(bbt.[4w_cnt]), 0)			as [4w_cnt]
		,	isnull(sum(bbt.[aux_cnt]), 0)			as [aux_cnt]
		,	isnull(sum(bbt.[both_cnt]), 0)			as [both_cnt]
		,	isnull(sum(bbt.[c_cnt]), 0)			as [c_cnt]
		,	isnull(sum(bbt.[er_cnt]), 0)			as [er_cnt]
		,	isnull(sum(bbt.[open_cnt]), 0)			as [open_cnt]
		,	isnull(sum(bbt.[spk_cnt]), 0)			as [spk_cnt]
		,	isnull(sum(bbt.[short_cnt]), 0)		as [short_cnt]

		--,	isnull(sum([raw4wng]), 0)			as [raw4wng]
		--,	isnull(sum([rawshort]), 0)			as [rawshort]
		--,	isnull(sum([rawshorts2]), 0)		as [rawshorts2]
		--,	isnull(sum([rawush2]), 0)			as [rawush2]
		--,	isnull(sum([raw4wngush2]), 0)		as [raw4wngush2]
		--,	isnull(sum([rawopen]), 0)			as [rawopen]
		--,	isnull(sum([rawopenshorts]), 0)	as [rawopenshorts]
		--,	isnull(sum([rawush1]), 0)			as [rawush1]
		--,	isnull(sum([rawaux]), 0)			as [rawaux]
		--,	isnull(sum([raw4wngshort]), 0)		as [raw4wngshort]
		--,	isnull(sum([rawopenshort]), 0)		as [rawopenshort]
		--,	isnull(sum([rawopenspark]), 0)		as [rawopenspark]
		--,	isnull(sum([rawspark]), 0)			as [rawspark]
		--,	isnull(sum([raw4wngspark]), 0)		as [raw4wngspark]
		--,	isnull(sum([rawopenush2]), 0)		as [rawopenush2]
		--,	isnull(sum([raw4wngshorts]), 0)	as [raw4wngshorts]
		--,	isnull(sum([raw4wngush1]), 0)		as [raw4wngush1]
		--,	isnull(sum([rawshorts]), 0)		as [rawshorts]
		--,	isnull(sum([rawc]), 0)				as [rawc]
		--,	isnull(sum([rawerror]), 0)			as [rawerror]
		--,	isnull(sum([rawopenush1]), 0)		as [rawopenush1]	
		,	(
				isnull(sum(bbt.[4w_cnt]), 0)
			+	isnull(sum(bbt.[aux_cnt]), 0)
			+	isnull(sum(bbt.[both_cnt]), 0)
			+	isnull(sum(bbt.[c_cnt]), 0)	
			+	isnull(sum(bbt.[er_cnt]), 0)
			+	isnull(sum(bbt.[open_cnt]), 0)
			+	isnull(sum(bbt.[spk_cnt]), 0)
			+	isnull(sum(bbt.[short_cnt]), 0)
			--+	isnull(sum([raw4wng]), 0)
			--+	isnull(sum([rawshort]), 0)
			--+	isnull(sum([rawshorts2]), 0)
			--+	isnull(sum([rawush2]), 0)
			--+	isnull(sum([raw4wngush2]), 0)
			--+	isnull(sum([rawopen]), 0)
			--+	isnull(sum([rawopenshorts]), 0)	
			--+	isnull(sum([rawush1]), 0)
			--+	isnull(sum([rawaux]), 0)
			--+	isnull(sum([raw4wngshort]), 0)
			--+	isnull(sum([rawopenshort]), 0)
			--+	isnull(sum([rawopenspark]), 0)
			--+	isnull(sum([rawspark]), 0)
			--+	isnull(sum([raw4wngspark]), 0)
			--+	isnull(sum([rawopenush2]), 0)
			--+	isnull(sum([raw4wngshorts]), 0)
			--+	isnull(sum([raw4wngush1]), 0)
			--+	isnull(sum([rawshorts]), 0)
			--+	isnull(sum([rawc]), 0)
			--+	isnull(sum([rawerror]), 0)
			--+	isnull(sum([rawopenush1]), 0)
		) as total_defect	
	from v_bbt bbt
	where bbt.create_dt >= @from_dt and bbt.create_dt < @to_dt
		and bbt.model_code = @model_code
		and bbt.item_code = @item_code
		and bbt.item_name like '%' + @item_name + '%'
		and bbt.model_code = @model_code
		and bbt.workorder like '%' + @workorder + '%'
		and bbt.eqp_code in (select distinct [value] as eqp_code from openjson(@eqp_code) with ([value] varchar(50) '$.value'))
		and bbt.item_use_code = @app_code
        group by bbt.workorder, bbt.eqp_code, bbt.oper_code, bbt.eqp_name, bbt.tool_id
)

select cte.*
	,	case when (ok_cnt + ng_cnt) = 0 then 
			0
		else
			(ng_cnt * 100) / (ok_cnt + ng_cnt)
		end ng_rate
	, ((total_defect * 100)/panel_cnt) as defect_rate,
	(cte_rate.std_rate) as std_rate,
	(cte_rate.[4w_cnt_std_rate]) as [4w_cnt_std_rate],
	(cte_rate.[aux_cnt_std_rate])  as [aux_cnt_std_rate],
	(cte_rate.[both_cnt_std_rate])  as [both_cnt_std_rate],
	(cte_rate.[c_cnt_std_rate])  as [c_cnt_std_rate],
	(cte_rate.[er_cnt_std_rate])  as [er_cnt_std_rate],
	(cte_rate.[open_cnt_std_rate])  as [open_cnt_std_rate],
	(cte_rate.[spk_cnt_std_rate])  as [spk_cnt_std_rate],
	(cte_rate.[short_cnt_std_rate])  as [short_cnt_std_rate]
from cte
left join cte_rate
      on cte_rate.model_code = cte.model_code
      and cte_rate.oper_code = cte.oper_code

--join tb_fdc_interlock a 
--on a.workorder = cte.workorder

--join tb_panel_4m [4m]
--on a.oper_code = [4m].oper_code

--join  erp_sdm_standard_operation oper 
--on  [4m].oper_code = oper.OPERATION_CODE


;

