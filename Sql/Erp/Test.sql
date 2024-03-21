with cte as 
    (
        select
            regexp_substr(:keys, '[^,]+', 1, level) as spt
        from 
            dual
        connect by
            regexp_substr(:keys, '[^,]+', 1, level) is not null
    )
    select spt from cte