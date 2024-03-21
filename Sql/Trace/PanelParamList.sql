select
    a.*
,   b.param_name
from
    dbo.tb_panel_param a
left join
    dbo.tb_param b
    on a.param_id = b.param_id
where
    a.item_key = @item_key
;