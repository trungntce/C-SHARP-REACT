if ('reject' = @type)
begin
	 SELECT 
		count(*) cnt
	FROM tb_user as a
	CROSS APPLY OPENJSON(a.usergroup_json) AS JSON_TABLE
    WHERE a.user_id = @create_user
    and JSON_TABLE.value in ('group.product','group.quality','group.plan', 'group.ptech', 'group.approve')
end
else
begin
if ('comment' = @type)
begin
	 SELECT 
		count(*) cnt
	FROM tb_user as a
	CROSS APPLY OPENJSON(a.usergroup_json) AS JSON_TABLE
    WHERE a.user_id = @create_user
    and JSON_TABLE.value in ('group.product','group.quality','group.plan', 'group.ptech')
end
else
begin
if ('approve' = @type)
begin
	 SELECT 
		count(*) cnt
	FROM tb_user as a
	CROSS APPLY OPENJSON(a.usergroup_json) AS JSON_TABLE
    WHERE a.user_id = @create_user
    and JSON_TABLE.value in ('group.approve')
end
end
end;