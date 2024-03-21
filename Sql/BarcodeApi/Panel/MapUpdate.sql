with cte as
(
    select distinct
        pcs_id as pcs_id
    from 
        openjson(@json)
	    with 
	    (
	        pcs_id varchar(50) '$'
        )
)
update
    dbo.tb_piece_item
set
    panel_id = @panel_id
where
    pcs_id in (select pcs_id from cte)
;