select
	*
from
	dbo.tb_layout_option tlo 
where
	tlo.room_name = @roomname
;