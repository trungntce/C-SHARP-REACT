with cte as
(
    select distinct
        panel_id as panel_id
    from 
        openjson(@json)
	    with 
	    (
	        panel_id varchar(50) '$'
        )
)
update
    dbo.tb_panel_item
set
    roll_id = @roll_id
where
    panel_id in (select panel_id from cte)
;