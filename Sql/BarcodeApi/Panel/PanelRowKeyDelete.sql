if exists (select * from tb_panel_4m where row_key= @row_key)
begin
	delete tb_panel_4m where row_key= @row_key

	if exists (select * from tb_panel_material where row_key= @row_key)
	begin
		delete tb_panel_material where row_key= @row_key
	end

	if exists (select * from tb_panel_worker where row_key= @row_key)
	begin
		delete tb_panel_worker where row_key= @row_key
	end

	if exists (select * from tb_panel_tool where row_key= @row_key)
	begin
		delete tb_panel_tool where row_key= @row_key
	end
end
