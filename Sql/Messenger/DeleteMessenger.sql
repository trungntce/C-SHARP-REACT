declare @tbl table
(
	id_code 			varchar(20)
,	interlock_code 		varchar(20)
,	oper_class_code 	varchar(20)
,	oper_type_code 		varchar(20)
,	messenger_case_code	varchar(20)
,	user_type_code 		varchar(20)
);

with cte as 
(
	select
		*
	from
		openjson(@json)
		with
		(
			id_code 			varchar(20) '$.idCode'
		,	interlock_code 		varchar(20) '$.interlockCode'
		,	oper_class_code		varchar(20) '$.operClassCode'
		,	oper_type_code 		varchar(20) '$.operTypeCode'
		,	messenger_case_code	varchar(20) '$.messengerCaseCode'
		,	user_type_code 		varchar(20) '$.userTypeCode'
		)
)
insert into 
	@tbl
select
	*
from
	cte
;

delete from
	dbo.tb_messenger
from
	dbo.tb_messenger messenger
join
	@tbl cte
	on	messenger.id_code = cte.id_code
	and	messenger.interlock_code = cte.interlock_code
	and	messenger.oper_class_code = cte.oper_class_code
	and messenger.oper_type_code = cte.oper_type_code
	and messenger.messenger_case_code = cte.messenger_case_code
	and messenger.user_type_code = cte.user_type_code
where
	corp_id				= @corp_id
and	fac_id				= @fac_id
;