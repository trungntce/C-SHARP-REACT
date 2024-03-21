namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Dynamic;

using Framework;
using Microsoft.AspNetCore.Mvc;
using Unity.Interception.Utilities;

public class ModelExtraParamMapService : MinimalApiService, IMinimalApi
{
	public ModelExtraParamMapService(ILogger<ModelExtraParamMapService> logger) : base(logger)
	{
	}

	public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
	{
		group.MapGet("/opereqp", nameof(OperEqpListByModel));
		group.MapGet("/approve", nameof(ApproveList));
		group.MapGet("/parammap", nameof(ParamExtraList));

		group.MapPost("/approveupdate", nameof(ApproveUpdate));

		return RouteAllEndpoint(group);
	}

	public static IEnumerable<IDictionary> List(string? itemCode, string? modelCode, string? modelDescription, string? itemCategoryCode, char? approveYn)
	{
		dynamic obj = new ExpandoObject();
		obj.ModelCode = modelCode;

        return ToDic(DataContext.StringDataSet("@ModelExtraParamMap.ApproveList", RefineExpando(obj)).Tables[0]);
    }

	[ManualMap]
	public static IEnumerable<IDictionary> OperEqpListByModel(string modelCode)
	{
		dynamic obj = new ExpandoObject();

		obj.ModelCode = modelCode;

		// 공정-설비 리스트
        IEnumerable<IDictionary> list = ToDic(DataContext.StringDataSet("@ModelExtraParamMap.OperEqpListByModel", RefineExpando(obj)).Tables[0]);

		// 레시피 파라미터 매핑 여부
		DataTable mapDt = DataContext.StringDataSet("@ModelExtraParamMap.RecipeParamDistinctList", RefineExpando(obj)).Tables[0];
		var mapList = mapDt.AsEnumerable().Select(x => new 
		{ 
			operSeqNo = x.TypeCol<int>("operation_seq_no"), 
			eqpCode = x.TypeCol<string>("eqp_code"),
            interlockYn = x.TypeCol<string>("interlock_yn")
        }).ToList();

		// 모델별 공정 확장 정보에서 지정설비 가져오기
		var operExtList = ModelOperExtService.List(modelCode);
        list.ForEach(x => {
			var operSeqNo = x.TypeKey<int>("operationSeqNo");
			var eqpCode = x.TypeKey<string>("equipmentCode");

            var map = mapList.FirstOrDefault(y => y.operSeqNo == operSeqNo && y.eqpCode == eqpCode);
			if (map == null)
			{
				x["mapYn"] = 'N';
			}
			else
			{
				x["mapYn"] = 'Y';
				x["interlockYn"] = map.interlockYn;
			}

            var operExt = operExtList.FirstOrDefault(y => y.OperationSeqNo == operSeqNo);
			if(operExt == null || string.IsNullOrWhiteSpace(operExt.EqpJson))
			{
				x["eqpYn"] = 'N';
			}
			else
			{
				var eqpList = operExt.EqpList;
				x["eqpYn"] = eqpList.Any(eqp =>
				{
					var operEqpCode = eqp.SafeTypeKey<string>("eqpCode");
                    var useYn = eqp.SafeTypeKey<char>("useYn");

					// 지정설비 목록에 있고 Y인 경우만 지정설비 처리
					return operEqpCode == eqpCode && useYn == 'Y';
                }) ? 'Y' : 'N';
			}
        });

		// 지정설비인 것만 보여주기
		list = list.Where(x => ConvertEx.ConvertTo(x["eqpYn"], "") == "Y");

        return list;
	}

	public static RecipeEntity? Select(string eqpCode, string? recipeCode, string? categoryCode)
	{
		dynamic obj = new ExpandoObject();
		obj.EqpCode = eqpCode;
		obj.RecipeCode = recipeCode;
		obj.CategoryCode = categoryCode;

		return DataContext.StringEntity<RecipeEntity>("@ModelExtraParamMap.Select", RefineExpando(obj));
	}

	[ManualMap]
	public static IEnumerable<IDictionary> ApproveList(string? modelCode)
	{
		dynamic obj = new ExpandoObject();
		obj.ModelCode = modelCode;

		return ToDic(DataContext.StringDataSet("@ModelExtraParamMap.ApproveList", RefineExpando(obj)).Tables[0]);
	}

    [ManualMap]
    public static IEnumerable<IDictionary> ParamExtraList(string? equipmentCode, string? groupCode, string? bomItemCode, int? operationSeqNo)
    {
        dynamic obj = new ExpandoObject();
        obj.EqpCode = equipmentCode;
        obj.GroupCode = groupCode;
        obj.ModelCode = bomItemCode;
        obj.OperationSeqNo = operationSeqNo;

        RemoveCache();

        DataTable dt = DataContext.StringDataSet("@ModelExtraParamMap.ParamList", RefineExpando(obj, true)).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
	public static int ApproveUpdate([FromBody] ApproveEntity entity)
	{
		int result = 0;

		if (entity.Gubun == "approve")
		{
			entity.ApproveYn = "Y";
		}
		else
		{
			entity.ApproveYn = "R";
		}

		result += DataContext.StringNonQuery("@Recipe.ApproveUpdate", RefineEntity(entity));
		result += DataContext.StringNonQuery("@Param.ApproveUpdate", RefineEntity(entity));

		return result;
	}

    public static int Update([FromBody] RecipeParamMapEntity entity)
    {
        dynamic obj = new ExpandoObject();
        obj.ModelCode = entity.ModelCode;

		int result = 0;

		if(entity.GroupCode is null)
		{
			// Group_code 가 없을경우 등록 해제
			result += ParamExtraService.DeleteModelExtraMap(entity);
		}
		else
		{
			result += ParamExtraService.InsertModelExtraMap(entity);

			//if (!string.IsNullOrWhiteSpace(entity.RecipeJson))
			//	result += RecipeService.InsertModelMap(entity);
			//else
			//          result += RecipeService.DeleteModelMap(entity);

			//      if (!string.IsNullOrWhiteSpace(entity.ParamJson))
			//	result += ParamService.InsertModelMap(entity);
			//else
			//          result += ParamService.DeleteModelMap(entity);

			obj.ApproveKey = NewShortId();
			result += DataContext.StringNonQuery("@ModelExtraParamMap.RecipeParamApproveUpdate", RefineExpando(obj));
		}

		return result;
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }
}

