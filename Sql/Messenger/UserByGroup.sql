select distinct 
	user_master.NAME
,	user_master.PERSON_NUM
,	user_master.DISPLAY_NAME
,	push_entry.EFFECTIVE_DATE_FR
,	push_entry.EFFECTIVE_DATE_TO
,	push_entry.ENABLED_FLAG
,	push_entry.PUSH_PERSON_ID
,	push_entry.PUSH_ENTRY_ID
,	push_entry.PUSH_TYPE_ID
,	push_entry.PUSH_USER_ID
from 
	erp_eapp_mobile_push_entry push_entry 
left join 
	erp_hrm_person_master user_master 
on 
	push_entry.PUSH_PERSON_ID = user_master.PERSON_ID
where
	user_master.PERSON_NUM is not null
and
	push_entry.PUSH_TYPE_ID = @push_type_id
order by
	push_entry.PUSH_USER_ID
;