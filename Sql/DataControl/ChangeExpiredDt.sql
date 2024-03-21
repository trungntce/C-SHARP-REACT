update 
	erp_inv_mat_lot_expire
set
	EXPIRED_DATE = @expired_dt
where 
	PACKING_BOX_NO = @material
