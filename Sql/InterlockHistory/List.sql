with cte as
(
	select
		panel.*
	,	code.code_name as interlock_name
	from 
		dbo.tb_panel_interlock panel
	left join 
		dbo.tb_code code
		on	panel.interlock_code = code.code_id
		and code.codegroup_id = 'HOLDINGREASON'
	where
		panel.corp_id			= @corp_id
	and	panel.fac_id			= @fac_id
	and panel.on_dt				> = @from_dt and panel.on_dt < @to_dt
	and	panel.panel_id			like '%' + @panel_id + '%'
	and panel.roll_id			like '%' + @roll_id + '%'
	and panel.auto_yn			= @auto_yn
	and panel.interlock_code	= @interlock_code
	and code.interlock_name like '%' + @interlock_name + '%'
	and (@off_yn is null or (@off_yn = 'Y' and off_dt is not null) or (@off_yn = 'N' and off_dt is null))
), cte_person as
(
	select
		row_number() over (partition by PERSON_NUM order by CREATION_DATE DESC) as row_num
	,	*
	from
		dbo.erp_hrm_person_idcard
	where
		PERSON_NUM in (select on_update_user from cte)
	or	PERSON_NUM in (select off_update_user from cte)
)
select
	cte.*
,	on_user.NAME as on_user_name
,	off_user.NAME as off_user_name
from
	cte
left join
	cte_person on_user
	on	cte.on_update_user = on_user.PERSON_NUM
	and on_user.row_num = 1
left join
	cte_person off_user
	on	cte.off_update_user = off_user.PERSON_NUM
	and off_user.row_num = 1
order by
	on_dt desc
;