select 
	*
from 
	tb_panel_material
where
	row_key in 
	(
		select 
			row_key
		from 
			tb_panel_4m
		where
			oper_code = @oper_code --'L05030'
		and
			eqp_code = @eqp_code --'M-078-01-V017'
	)
and
	material_lot = @material_lot
and
	child_material_lot= @child_material_lot
order by create_dt desc