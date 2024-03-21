delete from
	dbo.tb_eqp_offset_param_map
where
	corp_id = @corp_id
and fac_id = @fac_id
and map_id in ((select LTRIM(RTRIM([value])) from string_split(@map_id_list, ',')))
;
