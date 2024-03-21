delete from
	dbo.tb_fdc_defect_rate
where
	corp_id = @corp_id
and	fac_id = @fac_id
and	model_code = @model_code
;

with cte as 
(
	select
		case fdc_type 
			when 'O' then 1 
			when 'P' then 2
			when 'G' then 3
		end as fdc_sort
	,	*
	from
		openjson(@json)
		with
		(
			fdc_type			char(1)			'$.fdcType'
		,	detail_type			char(1)			'$.detailType'
		,	defect_type			varchar(20)		'$.defectType'

		,	oper_code			varchar(30)		'$.operCode'
		,	oper_seq_no			int				'$.operSeqNo'

		,	plus_oper_code		varchar(30)		'$.plusOperCode'
		,	plus_oper_seq_no	int				'$.plusOperSeqNo'

		,	to_oper_code		varchar(30)		'$.toOperCode'
		,	to_oper_seq_no		int				'$.toOperSeqNo'

		,	defect_rate			decimal(18, 3)	'$.defectRate'
		,	remark				nvarchar(500)	'$.remark'
		,	layer				varchar(30)		'$.layer'
		)
)
insert into
	dbo.tb_fdc_defect_rate
(
	corp_id
,	fac_id
,	model_code
,	fdc_type
,	detail_type
,	defect_type
,	oper_code
,	plus_oper_code
,	to_oper_code
,	defect_rate
,	remark
,	create_user
,	create_dt
,	layer
)
select
	@corp_id
,	@fac_id
,	@model_code
,	fdc_type
,	detail_type
,	defect_type
,	oper_code
,	plus_oper_code
,	to_oper_code
,	defect_rate
,	remark
,	@create_user
,	getdate()
,	layer
from
	cte
where
	(defect_type is null or defect_rate is not null) -- 전체는 불량률 없어도 무조건 저장
order by
	fdc_sort, oper_seq_no, detail_type, plus_oper_seq_no, to_oper_seq_no
;