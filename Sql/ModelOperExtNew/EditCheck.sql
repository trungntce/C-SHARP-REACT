select count(*) as cnt
from tb_recipe_approve_request_data a
join tb_param_approve_request_data b
on a.model_code = b.model_code
and a.approve_key = b.approve_key
and a.approve_yn = b.approve_yn
where a.approve_yn	=	'S'