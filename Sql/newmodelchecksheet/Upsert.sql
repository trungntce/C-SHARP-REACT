
	if((select count(*) from tb_newmodel_checksheet with(nolock) where model_code = @model_code)=0) 
	begin
		INSERT INTO tb_newmodel_checksheet
			   (
			   [model_code]
			   )
		 VALUES
			   (
			   @model_code
			   )	 
	end


	update tb_newmodel_checksheet
	set model_code = @model_code
		,recipe=case when isnull(@recipe,'')<>'' then @recipe else recipe end
		,gbr_data=case when isnull(@gbr_data,'')<>'' then @gbr_data else gbr_data end
		,bbt_no=case when isnull(@bbt_no,'')<>'' then @bbt_no else bbt_no end
		,black_hold_align=case when isnull(@black_hold_align,'')<>'' then @black_hold_align else black_hold_align end
		,spc=case when isnull(@spc,'')<>'' then @spc else spc end
		,other=case when isnull(@other,'')<>'' then @other else other end
	where model_code = @model_code
	
	print 1
	
	select 1
		