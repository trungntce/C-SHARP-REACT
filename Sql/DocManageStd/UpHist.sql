
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
	
	
--with tung as (
--select 
--model_code,type,MAX(update_dt) as update_dt
--from tb_newmodel_checksheet_hist a with(nolock)
--group by model_code,type
--)
--select * from (
--select a.*
--from tb_newmodel_checksheet_hist a
--join tung  b on a.model_code=b.model_code and a.type=b.type and a.update_dt=b.update_dt
--) as tb
--pivot (
--	max(update_dt) for [type] in (
--[black_hold_align]
--,[recipe]
--,[gbr_data]
--,[bbt_no]
--,[spc]
--,[other])
--) as pvt
--order by model_code




--select * from (
--select a.* from tb_newmodel_checksheet_hist a with(nolock)
--) as tb
--pivot (
--	max(update_dt) for [type] in (
--[black_hold_align]
--,[recipe]
--,[gbr_data]
--,[bbt_no]
--,[spc]
--,[other])
--) as pvt
--order by model_code,valu,userid