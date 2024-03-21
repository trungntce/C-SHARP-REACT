with cte as (
	SELECT
		T.type_desc
	,	T.MEASURE_DATETIME				as measure_dt
	,	T.oper_class
	,	T.adj_seq
	,	T.eqp_id
	,	T.eqp_code
	,	T.eqp_name
	,	T.factor_desc
	,	T.chem_name
	,	T.MEASURE_RANGE as measure_range
	,	T.CUSTOMER_LSL as lsl
	,	T.CUSTOMER_USL as usl
	,	T.INTERNAL_LSL as lcl
	,	T.INTERNAL_USL as ucl
	,	T.STATUS_FLAG	as status_flag
	,	T.MEASURE_VALUE	as value
	FROM (
			  -- ¾àÇ°
		SELECT 
			@yack AS type_desc
		,	eqp.EQUIPMENT_ID 				as eqp_id
		,	eqp.EQUIPMENT_CODE				as eqp_code
		,	eqp.EQUIPMENT_DESCRIPTION		as eqp_name
		,	case when  SEM.ADJ_SEQ > 0 then SEM.ADJ_SEQ else '0' end as adj_seq
		,	MEASURE_DATETIME
		,	SEF.FACTOR_DESCRIPTION 			as factor_desc
		,	SEF.CHEMICAL_NAME 				as chem_name
		,	SEM.MEASURE_RANGE
		,	SEM.TOL_LSL_VALUE AS CUSTOMER_LSL
		,	SEM.TOL_USL_VALUE AS CUSTOMER_USL
		,	ISNULL(SEF.WARN_MIN_VALUE,0) AS INTERNAL_LSL
		,	ISNULL(SEF.WARN_MAX_VALUE,0) AS INTERNAL_USL
		,	SEM.MEASURE_VALUE
		,	CASE WHEN SEM.MEASURE_VALUE BETWEEN ISNULL(SEF.WARN_MIN_VALUE,0) AND ISNULL(SEF.WARN_MAX_VALUE,0) THEN 'OK'
				WHEN SEM.MEASURE_VALUE BETWEEN ISNULL(SEF.NORMINAL_VALUE,0) - ISNULL(SEF.TOL_LSL_VALUE,0) 
													AND ISNULL(SEF.NORMINAL_VALUE,0) + ISNULL(SEF.TOL_USL_VALUE,0)
													AND SEM.MEASURE_VALUE NOT BETWEEN ISNULL(SEF.WARN_MIN_VALUE,0) AND ISNULL(SEF.WARN_MAX_VALUE,0) THEN 'CHK'
				ELSE 'NG'	END AS STATUS_FLAG
		,	class.OP_CLASS_CODE as oper_class
		FROM 
			dbo.fn_spc_eqp_measure_upv()   SEM
			INNER JOIN dbo.erp_spc_eqp_category             SEC ON SEC.EQP_CATEGORY_ID      = SEM.EQP_CATEGORY_ID
			INNER JOIN dbo.erp_spc_eqp_factor               SEF ON SEF.SPC_FACTOR_ID        = SEM.SPC_FACTOR_ID
			join dbo.erp_sdm_standard_equipment 			eqp on SEM.EQUIPMENT_ID = eqp.EQUIPMENT_ID
			join dbo.erp_sdm_operation_class				class on class.OP_CLASS_ID = SEC.OP_CLASS_ID
		WHERE 
			SEC.SPC_TYPE_FLAG    = 'A'
	--               AND SEM.SPC_TYPE = 'NORMAL'
			AND SEM.MEASURE_VALUE  IS NOT NULL
			and SEM.MEASURE_DATETIME BETWEEN @from_dt AND @to_dt
			and class.OP_CLASS_CODE = @oper_class
			and SEF.CHEMICAL_NAME = @chem_name
			AND eqp.EQUIPMENT_CODE    = @eqp_code
		UNION ALL
		SELECT 
			@et AS type_desc
		,	eqp.EQUIPMENT_ID 				as eqp_id
		,	eqp.EQUIPMENT_CODE				as eqp_code
		,	eqp.EQUIPMENT_DESCRIPTION		as eqp_name
		,	'-'								as adj_seq
		,	OPH.CREATION_DATE AS REAL_TIME	
		,	SEF.FACTOR_DESCRIPTION 			as factor_desc
		,	SEF.CHEMICAL_NAME 				as chem_name
		,	SEF.MEASURE_RANGE
		,	ISNULL(SEF.NORMINAL_VALUE,0) - ISNULL(SEF.TOL_LSL_VALUE,0) AS lsl
		,	ISNULL(SEF.NORMINAL_VALUE,0) + ISNULL(SEF.TOL_USL_VALUE,0) AS usl
		,	ISNULL(SEF.WARN_MIN_VALUE,0) AS lcl
		,	ISNULL(SEF.WARN_MAX_VALUE,0) AS ucl
		,	OPL.MEASURE_VALUE
		,	CASE WHEN OPL.MEASURE_VALUE BETWEEN ISNULL(SEF.WARN_MIN_VALUE,0) AND ISNULL(SEF.WARN_MAX_VALUE,0) THEN 'OK'
				WHEN OPL.MEASURE_VALUE BETWEEN ISNULL(SEF.NORMINAL_VALUE,0) - ISNULL(SEF.TOL_LSL_VALUE,0) 
												AND ISNULL(SEF.NORMINAL_VALUE,0) + ISNULL(SEF.TOL_USL_VALUE,0)
												AND OPL.MEASURE_VALUE NOT BETWEEN ISNULL(SEF.WARN_MIN_VALUE,0) AND ISNULL(SEF.WARN_MAX_VALUE,0) THEN 'CHK'
				ELSE 'NG' END AS STATUS
		,	class.OP_CLASS_CODE as oper_class
		FROM 
			dbo.erp_op_parameter_line  OPL
			INNER JOIN dbo.erp_op_parameter_header         OPH ON OPL.OP_PARAMETER_HEADER_ID = OPH.OP_PARAMETER_HEADER_ID
			INNER JOIN dbo.erp_spc_eqp_factor              SEF ON SEF.SPC_FACTOR_ID          = OPL.SPC_FACTOR_ID        
																AND SEF.EQP_CATEGORY_ID    	 = OPH.EQP_CATEGORY_ID
			INNER JOIN dbo.erp_spc_eqp_category            SEC ON SEF.EQP_CATEGORY_ID        = SEC.EQP_CATEGORY_ID
			join dbo.erp_sdm_standard_equipment 			eqp on OPH.EQUIPMENT_ID = eqp.EQUIPMENT_ID
			join dbo.erp_sdm_operation_class				class on class.OP_CLASS_ID = SEC.OP_CLASS_ID
		WHERE 
			SEF.ENABLED_FLAG     = 'Y'
			AND OPH.SOB_ID          = 90
			AND OPH.ORG_ID          = 901
			AND SEF.CTQ_FLAG        = 'Y'
			AND SEC.SPC_TYPE_FLAG   = 'M'
			AND OPL.MEASURE_VALUE is not null
			AND OPH.CREATION_DATE BETWEEN @from_dt AND @to_dt
			and class.OP_CLASS_CODE = @oper_class
			and SEF.CHEMICAL_NAME = @chem_name
			AND eqp.EQUIPMENT_CODE    = @eqp_code
	) T

), cte2 as (
	select
		*
	,	ROW_NUMBER() OVER (PARTITION BY measure_dt, oper_class, eqp_code, factor_desc, chem_name ORDER BY adj_seq DESC) AS max_adj_seq
	from	
		cte
)select
	*
from 
	cte2
where 
	max_adj_seq = 1
order by 
	measure_dt asc
,	eqp_code asc
,	chem_name asc

--, cte_max_group as (
--	select
--		measure_dt
--	,	max(adj_seq) as adj_seq
--	,	eqp_code
--	,	factor_desc
--	,	chem_name
--	,	oper_class
--	from 
--		cte
--	group by 
--		measure_dt
--	,	eqp_code
--	,	factor_desc
--	,	chem_name
--	,	oper_class
--), cte_max_adj as (
--	select
--		a.*
--	from 
--		cte a
--	join 
--		cte_max_group  b
--		on
--		a.oper_class = b.oper_class
--		and a.eqp_code = b.eqp_code
--		and a.chem_name = b.chem_name
--		and a.measure_dt = b.measure_dt
--		and a.factor_desc = b.factor_desc
--		and a.adj_seq = b.adj_seq
--), cte_sigma_calc as (
--	select 
--		oper_class
--	,	eqp_code
--	,	factor_desc
--	,	chem_name
--	,	round(avg(value), 3) as value_avg
--	, 	round(avg([value]) + STDEV([value]), 3) as value_add_1sigma
--	, 	round(avg([value]) - STDEV([value]), 3) as value_sub_1sigma
--	, 	round(avg([value]) + (STDEV([value]) * 2 ), 3) as value_add_2sigma
--	, 	round(avg([value]) - (STDEV([value]) * 2 ), 3) as value_sub_2sigma
--	, 	round(avg([value]) + (STDEV([value]) * 3 ), 3) as value_add_3sigma
--	, 	round(avg([value]) - (STDEV([value]) * 3 ), 3) as value_sub_3sigma
--	,	count(*) as count
--	from
--		cte_max_adj
--	group by 
--		oper_class
--	,	eqp_code
--	,	chem_name
--	,	factor_desc
--), cte_trend as (
--	select
--		a.*
--	,	lag(value, 7, null) over (partition by a.oper_class, a.eqp_code, a.factor_desc, a.chem_name order by a.measure_dt asc) as before_7
--	,	lag(value, 6, null) over (partition by a.oper_class, a.eqp_code, a.factor_desc, a.chem_name order by a.measure_dt asc) as before_6
--	,	lag(value, 5, null) over (partition by a.oper_class, a.eqp_code, a.factor_desc, a.chem_name order by a.measure_dt asc) as before_5
--	,	lag(value, 4, null) over (partition by a.oper_class, a.eqp_code, a.factor_desc, a.chem_name order by a.measure_dt asc) as before_4
--	,	lag(value, 3, null) over (partition by a.oper_class, a.eqp_code, a.factor_desc, a.chem_name order by a.measure_dt asc) as before_3
--	,	lag(value, 2, null) over (partition by a.oper_class, a.eqp_code, a.factor_desc, a.chem_name order by a.measure_dt asc) as before_2
--	,	lag(value, 1, null) over (partition by a.oper_class, a.eqp_code, a.factor_desc, a.chem_name order by a.measure_dt asc) as before_1
--	,	abs(lag(value, 1, null) over (partition by a.oper_class, a.eqp_code, a.factor_desc, a.chem_name order by a.measure_dt asc) - value) as range
----	,	value_avg + (2.66 * abs(lag(value, 1, null) over (partition by a.oper_class, a.eqp_code, a.factor_desc, a.chem_name order by a.measure_dt asc) - value) )
--	,	b.value_avg
--	, 	value_add_1sigma
--	, 	value_sub_1sigma
--	, 	value_add_2sigma
--	, 	value_sub_2sigma
--	, 	value_add_3sigma
--	, 	value_sub_3sigma
--	,	b.count 
--	from
--		cte_max_adj a
--	left join
--		cte_sigma_calc b
--		on
--			a.oper_class = b.oper_class
--		and a.eqp_code = b.eqp_code
--		and a.factor_desc = b.factor_desc
--		and a.chem_name = b.chem_name
--), cte_range_calc as (
--	select
--		oper_class
--	,	eqp_code
--	,	factor_desc
--	,	chem_name
--	,	avg(range) * 3.27 as range_ucl
--	,	0 as range_lcl
--	from
--		cte_trend
--	group by 
--		oper_class
--	,	eqp_code
--	,	factor_desc
--	,	chem_name
--), cte_judge_4rule as (
--	select 
--		trend.*
--	,	case when value > value_add_3sigma or value < value_sub_3sigma then 'CHK'
--		else 'OK' end as judge_rule_1
--	,	case when value > before_1 and before_1 > before_2 and before_2 > before_3 and before_3 > before_4 and before_4 > before_5 then 'CHK'
--			when value < before_1 and before_1 < before_2 and before_2 < before_3 and before_3 < before_4 and before_4 < before_5 then 'CHK'
--			else 'OK' end as judge_rule_2	
--	, 	case when (value > value_add_1sigma or value < value_sub_1sigma) and (before_1 > value_add_1sigma or before_1 < value_sub_1sigma)  and (before_2 > value_add_1sigma or before_2 < value_sub_1sigma)  and (before_3 > value_add_1sigma or before_3 < value_sub_1sigma)  and (before_4 > value_add_1sigma or before_4 < value_sub_1sigma) then 'CHK'
--			when (value > value_add_1sigma or value < value_sub_1sigma) and (before_1 > value_add_1sigma or before_1 < value_sub_1sigma)  and (before_2 > value_add_1sigma or before_2 < value_sub_1sigma)  and (before_3 > value_add_1sigma or before_3 < value_sub_1sigma) then 'CHK'
--			when (value > value_add_1sigma or value < value_sub_1sigma) and (before_1 > value_add_1sigma or before_1 < value_sub_1sigma)  and (before_2 > value_add_1sigma or before_2 < value_sub_1sigma)  and (before_4 > value_add_1sigma or before_4 < value_sub_1sigma) then 'CHK'
--			when (value > value_add_1sigma or value < value_sub_1sigma) and (before_1 > value_add_1sigma or before_1 < value_sub_1sigma)  and (before_3 > value_add_1sigma or before_3 < value_sub_1sigma)  and (before_4 > value_add_1sigma or before_4 < value_sub_1sigma) then 'CHK'
--			when (value > value_add_1sigma or value < value_sub_1sigma) and (before_2 > value_add_1sigma or before_2 < value_sub_1sigma)  and (before_3 > value_add_1sigma or before_3 < value_sub_1sigma)  and (before_4 > value_add_1sigma or before_4 < value_sub_1sigma) then 'CHK'
--			else 'OK' end as judge_rule_3
--	, 	case when (value > value_add_1sigma or value < value_sub_1sigma) and (before_1 > value_add_1sigma or before_1 < value_sub_1sigma)  and (before_2 > value_add_1sigma or before_2 < value_sub_1sigma)  and (before_3 > value_add_1sigma or before_3 < value_sub_1sigma)  and (before_4 > value_add_1sigma or before_4 < value_sub_1sigma) and (before_5 > value_add_1sigma or before_5 < value_sub_1sigma) and (before_6 > value_add_1sigma or before_6 < value_sub_1sigma) and (before_7 > value_add_1sigma or before_7 < value_sub_1sigma) then 'CHK' 			
--			else 'OK' end as judge_rule_4
--	,	round(range_ucl, 3) as range_ucl
--	,	range_lcl
--	from
--		cte_trend trend
--	left join 
--		cte_range_calc rcalc
--		on
--		trend.oper_class = rcalc.oper_class
--		and trend.eqp_code = rcalc.eqp_code
--		and trend.factor_desc = rcalc.factor_desc
--		and trend.chem_name = rcalc.chem_name
--)select * from cte_judge_4rule;