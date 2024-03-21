
	INSERT INTO tb_newmodel_checksheet_hist
			   (
			    [model_code]  ,
				[type]  ,
				[valu]  ,
				[userid]  ,
				[update_dt]  
			   )
		 VALUES
			   (
			    @model_code
			   ,@type
			   ,@valu
			   ,@userid
			   ,getdate()
			   )	 
	