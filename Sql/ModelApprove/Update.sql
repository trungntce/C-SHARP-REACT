IF ('comment' = @update_type)
begin
	if( 'group.product' = (
		SELECT 
			JSON_TABLE.value
		FROM tb_user as a
		CROSS APPLY OPENJSON(a.usergroup_json) AS JSON_TABLE
		WHERE a.user_id = @create_user
		and JSON_TABLE.value = 'group.product'))
	begin
		update
			dbo.tb_model_approve_request
		set
			 val1	= '[ ' + ( select user_name from tb_user where user_id = @create_user) + ' ]' + ' ' + @content
		where  approve_yn = 'N'
		and request_id	= @request_id
		and model_code		= @model_code
	end
	else
	begin
		if( 'group.quality' = (
			SELECT 
				JSON_TABLE.value
			FROM tb_user as a
			CROSS APPLY OPENJSON(a.usergroup_json) AS JSON_TABLE
			WHERE a.user_id = @create_user
			and JSON_TABLE.value = 'group.quality'))
		begin
			update
				dbo.tb_model_approve_request
			set
				val2	= '[ ' + ( select user_name from tb_user where user_id = @create_user) + ' ]' + ' ' + @content
			where  approve_yn = 'N'
			and request_id	= @request_id
			and model_code		= @model_code
		end
		else
		begin
			if( 'group.plan' = (
				SELECT 
					JSON_TABLE.value
				FROM tb_user as a
				CROSS APPLY OPENJSON(a.usergroup_json) AS JSON_TABLE
				WHERE a.user_id = @create_user
				and JSON_TABLE.value = 'group.plan'))
			begin
				update
					dbo.tb_model_approve_request
				set
					 val3	= '[ ' + ( select user_name from tb_user where user_id = @create_user) + ' ]' + ' ' + @content
				where  approve_yn = 'N'
				and request_id	= @request_id
				and model_code		= @model_code	
			end
			else
			begin
				if( 'group.ptech' = (
					SELECT 
						JSON_TABLE.value
					FROM tb_user as a
					CROSS APPLY OPENJSON(a.usergroup_json) AS JSON_TABLE
					WHERE a.user_id = @create_user
					and JSON_TABLE.value = 'group.ptech'))
				begin
					update
						dbo.tb_model_approve_request
					set
						 val4	= '[ ' + ( select user_name from tb_user where user_id = @create_user) + ' ]' + ' ' + @content
					where  approve_yn = 'N'
					and request_id	= @request_id
					and model_code		= @model_code	
				end
			end
		end
	end
end
;