with cte as
(
    select 
        roll_id,
        on_dt,
        off_remark,
        off_update_user
    from 
        openjson(@json) 
        with 
        (
			  roll_id varchar(40) '$.RollId'
			, on_dt datetime '$.OnDt'
			, off_remark NVARCHAR(100) '$.OffRemark'
			, off_update_user NVARCHAR(50) '$.OffUpdateUser'
        )
)
update
	dbo.tb_panel_interlock
set
		off_remark = cte.off_remark
	,   off_update_user = cte.off_update_user
	,   off_dt = getdate()
from
     dbo.tb_panel_interlock a
inner join 
	cte
on cte.roll_id = a.roll_id
and cte.on_dt = a.on_dt
;