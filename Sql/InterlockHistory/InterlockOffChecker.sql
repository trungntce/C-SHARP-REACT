WITH cte AS
(
    select 
        item_key
    from 
        openjson(@json) 
    with 
    (
        item_key varchar(30) '$.ItemKey'
    )
)
select 
    *
from 
    tb_panel_interlock
where 
    item_key in (select item_key from cte)