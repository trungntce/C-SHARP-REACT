with cte as 
(
	select 
		material
	from 
		openjson(@material_list)
	with
	(
		material varchar(50) '$.materialLot'
	)
), cte2 as
(
    select
        material
    from
        cte
    join
        tb_code code
        on cte.material = code.code_id
        and codegroup_id = 'TEST4M'
), cte3 as
(
    select
        mat.material_lot
    from
        tb_panel_4m [4m]
    join
        tb_panel_material mat
        on [4m].row_key = mat.row_key
        and [4m].oper_code in (select code_name from tb_code WHERE codegroup_id = 'LASER_OPER')
    join
        cte2
        on mat.material_lot = cte2.material
)
select
    *
from
    cte3