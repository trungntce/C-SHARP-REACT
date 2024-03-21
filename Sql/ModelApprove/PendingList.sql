select 
     a.rev_code
,    a.model_code
,    a.model_name
,    (case when a.type = '1' then '최초' else case when a.type = '2' then '양산' else case when a.type = '3' then '변경(샘플)' else '변경(양산)' end end end) as type
,    a.filelocation
,    a.val1
,    a.val2
,    a.val3
,    a.val4
,    a.rev_note
,    a.reason_note
,    ( select user_name from tb_user where user_id = a.create_user) as create_user
,    a.create_dt
,    ( select user_name from tb_user where user_id = a.approve_user) as approve_user
,    a.approve_dt
,    a.approve_yn approve_code
,	 isnull(code.code_name,'') as approve_yn
,	 a.request_id
,    a.note
from dbo.tb_model_approve_request a
join
	tb_code code
	on a.approve_yn = code.code_id
where code.codegroup_id = 'APPROVAL_TYPE'
and a.model_code = @model_code
and a.model_name = @model_name
and a.approve_yn	= 'N'
and a.create_dt >= @from_dt and a.create_dt < @to_dt
and (a.val1 is not null or a.val2 is not null or a.val3 is not null or a.val4 is not null)
;