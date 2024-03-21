
--declare @temp_doc_no varchar(20) = replace(convert(varchar(10),getdate(),120),'-','') + isnull((select right('000'+convert(varchar(3),convert(int,right(max(doc_no),3))+1),3) from dbo.tb_standard_doc_manager  with(nolock) where convert(varchar(10),reg_date,120) = convert(varchar(10),getdate(),120) ),'001');


	IF not EXISTS(select top 1 * from dbo.tb_standard_doc_manager with(nolock) where 1=0 
	or doc_no = @doc_no
	) 
	begin
		INSERT INTO tb_standard_doc_manager
			   (
			   [doc_no]
			   )
		 VALUES
			   (
			   	replace(convert(varchar(10),getdate(),120),'-','') + isnull((select right('000'+convert(varchar(3),convert(int,right(max(doc_no),3))+1),3) from dbo.tb_standard_doc_manager  with(nolock) where convert(varchar(10),reg_date,120) = convert(varchar(10),getdate(),120) ),'001')
				)
		
		 UPDATE dbo.tb_standard_doc_manager
	     SET                
		   doc_type = @doc_type
		  ,doc_name = @doc_name
	   ,doc_content = @doc_content
		  ,att_file = @att_file
		  ,reg_user = @reg_user
		  ,reg_date = @reg_date
			,use_yn = @use_yn
			,remark = @remark
			,[guid] = @guid
         ,file_name = @file_name
         ,file_path = @file_path
	   ,dept_filter = @dept_filter
	    WHERE  1=0
		or doc_no = replace(convert(varchar(10),getdate(),120),'-','') + isnull((select right('000'+convert(varchar(3),convert(int,right(max(doc_no),3))),3) from dbo.tb_standard_doc_manager  with(nolock) where convert(varchar(10),reg_date,120) = convert(varchar(10),getdate(),120) ),'001')

		select replace(convert(varchar(10),getdate(),120),'-','') + isnull((select right('000'+convert(varchar(3),convert(int,right(max(doc_no),3))),3) from dbo.tb_standard_doc_manager  with(nolock) where convert(varchar(10),reg_date,120) = convert(varchar(10),getdate(),120) ),'001')

		return;
	end



	 UPDATE dbo.tb_standard_doc_manager
	     SET                
		   doc_type = @doc_type
		  ,doc_name = @doc_name
	   ,doc_content = @doc_content
		  ,att_file = @att_file
		  ,reg_user = @reg_user
		  ,reg_date = @reg_date
			,use_yn = @use_yn
			,remark = @remark
			,[guid] = @guid
         ,file_name = @file_name
         ,file_path = @file_path
       ,dept_filter = @dept_filter
	 WHERE  1=0
	 or doc_no = @doc_no ;
		
	print 1
	
	select 1
