select
	id_code
,	id_name
,	interlock_code
,	interlock_name
,	oper_class_code
,	oper_class_name
,	oper_type_code
,	oper_type_name
,	create_dt
,	create_user
,	update_dt
,	update_user
,	messenger_case_code
,	messenger_case_name
,	user_type_code
,	user_type_name
from
	tb_messenger
where
	corp_id = @corp_id
	and fac_id = @fac_id
	and interlock_code in (select value from STRING_SPLIT( @interlock_code, ','))
	and oper_class_code = @oper_class_code
	and oper_type_code = @oper_type
	and use_yn = 'Y'
order by
	id_code, user_type_code, interlock_code, oper_class_code, oper_type_code, messenger_case_code, create_dt
;