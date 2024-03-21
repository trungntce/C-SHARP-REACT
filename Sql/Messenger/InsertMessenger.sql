declare @tbl_interlock table(
	code_id					varchar(20)
,   code_name				varchar(80)
)

declare @json_interlock as varchar(MAX);

set @json_interlock = @interlock;

with cte_interlock as (
	select
   		code_id
	,   code_name
	from
		openjson(@json_interlock)
	with
	(
		code_id 	varchar(20) '$.codeId'
	,   code_name 	varchar(40) '$.codeName'
	)     
)insert into 
	@tbl_interlock 
select 
	code_id
,   code_name
from 
	cte_interlock;

insert into
	tb_messenger
(
	corp_id
,	fac_id
,	id_code
,	id_name
,	interlock_code
,	interlock_name
,	oper_class_code
,	oper_class_name
,	oper_type_code
,	oper_type_name
,	create_dt
,	create_user
,	messenger_case_code
,	messenger_case_name
,	user_type_code
,	user_type_name
)
select
	@corp_id
,	@fac_id
,	@id_code
,	@id_desc
,	code_id
,	code_name
,	@oper_class_code
,	@oper_class_name
,	@oper_type_code
,	@oper_type_name
,	getdate()
,	'test'
,	@messenger_case_code
,	@messenger_case_desc
,	@user_type_code
,	case
		when @user_type_code = 'G' then 'Group'
		else 'User'
	end
from
	@tbl_interlock
;