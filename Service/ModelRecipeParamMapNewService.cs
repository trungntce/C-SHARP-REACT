namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Dynamic;

using Framework;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Unity.Interception.Utilities;

public class ModelRecipeParamMapNewService : MinimalApiService, IMinimalApi
{
	public ModelRecipeParamMapNewService(ILogger<ModelRecipeParamMapNewService> logger) : base(logger)
	{
	}

	public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
	{
		group.MapGet("/opereqp", nameof(OperEqpListByModel));
		group.MapGet("/approve", nameof(ApproveList));
		group.MapPost("/approveupdate", nameof(ApproveUpdate));
        group.MapPost("/modelupdate", nameof(ModelRecipeParamUpdate));
        group.MapGet("/recipemap", nameof(RecipeList));
        group.MapPost("/registration", nameof(Registration));
        group.MapGet("/check", nameof(Check));
        group.MapGet("/checkreg", nameof(CheckExt));
        group.MapPut("/cancellation", nameof(Cancellation));

        return RouteAllEndpoint(group);
	}

	public static IEnumerable<IDictionary> List(string? itemCode, string? modelCode, string? modelDescription, string? itemCategoryCode, char? approveYn)
	{
		dynamic obj = new ExpandoObject();
		obj.ModelCode = modelCode;

        var modelList = ErpModelService.List(itemCode, modelCode, modelDescription, itemCategoryCode);

        DataTable approvtDt = new DataTable();

        if (string.IsNullOrEmpty(approveYn.ToString()) || (!string.IsNullOrEmpty(approveYn.ToString()) && approveYn == 'Y'))
		{
            approvtDt = DataContext.StringDataSet("@ModelRecipeParamMapNew.ApproveList", RefineExpando(obj)).Tables[0];
        }
		else if (!string.IsNullOrEmpty(approveYn.ToString()) && approveYn.ToString() != "Y")
		{
            obj.ApproveYn = approveYn;
            approvtDt = DataContext.StringDataSet("@ModelRecipeParamMapNew.ApproveExList", RefineExpando(obj)).Tables[0];
        }

        var approveList = approvtDt.AsEnumerable().Select(x => new
        {
            modelCode = x.TypeCol<string>("model_code"),
            approveYn = x.TypeCol<string>("approve_yn")
        }).ToList();

        modelList.ForEach(x => {
            if (approveList.Any(y => y.modelCode == x.TypeKey<string>("modelCode")))
                x["approveYn"] = CodeService.CodeName("APPROVAL_TYPE", approveList.First(z => z.modelCode == x.TypeKey<string>("modelCode")).approveYn);
        });

        if (approveYn != null)
        {
            string approve = CodeService.CodeName("APPROVAL_TYPE", approveYn.ToString());

            return modelList.Where(x => x.TypeKey<string>("approveYn") == approve);
        }

        return modelList;
	}

	[ManualMap]
	public static List<IEnumerable<IDictionary>> OperEqpListByModel(char? approveYn, string modelCode)
	{
		dynamic obj = new ExpandoObject();
        obj.ModelCode = modelCode;

        List<IEnumerable<IDictionary>> result = new List<IEnumerable<IDictionary>>();

        // 공정-설비 리스트
        IEnumerable<IDictionary> list = ToDic(DataContext.StringDataSet("@ModelRecipeParamMapNew.OperEqpListByModel", RefineExpando(obj)).Tables[0]);

		// 레시피 파라미터 매핑 여부
		DataTable mapDt = new DataTable();

		if (string.IsNullOrEmpty(approveYn.ToString()) || (!string.IsNullOrEmpty(approveYn.ToString()) && approveYn == 'Y'))
        {
            mapDt = DataContext.StringDataSet("@ModelRecipeParamMapNew.RecipeParamDistinctList", RefineExpando(obj)).Tables[0];
        }
		else
        {
            mapDt = DataContext.StringDataSet("@ModelRecipeParamMapNew.RecipeParamDistinctExList", RefineExpando(obj)).Tables[0];
        }
        var mapList = mapDt.AsEnumerable().Select(x => new 
		{ 
			operSeqNo = x.TypeCol<int>("operation_seq_no"),
			eqpCode = x.TypeCol<string>("eqp_code"),
            interlockYn = x.TypeCol<string>("interlock_yn"),
            recipeChangeYn = x.TypeCol<string>("recipe_change_yn")
        }).ToList();

        // 모델별 공정 확장 정보에서 지정설비 가져오기
        List<ModelOperExtEntity> operExtList = new List<ModelOperExtEntity>();
        operExtList = ModelOperExtNewService.List(modelCode, 'Y', false);

        if ((!string.IsNullOrEmpty(approveYn.ToString()) && approveYn != 'Y') && (DataContext.StringValue<int>("@ModelOperExtNew.Check", RefineExpando(obj, true))) > 0)
        {
            operExtList = ModelOperExtNewService.List(modelCode, 'N', false);
        }
        
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
                x["recipeChangeYn"] = map.recipeChangeYn;
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

        result.Add(list);

        if (string.IsNullOrEmpty(approveYn.ToString()) || (!string.IsNullOrEmpty(approveYn.ToString()) && approveYn == 'Y'))
        {
            result.Add(null);
        }
        else
        {
            IEnumerable<IDictionary> group = ToDic(DataContext.StringDataSet("@ModelRecipeParamMapNew.ModelGroupList", RefineExpando(obj)).Tables[0]);
            result.Add(group);
        }

        return result;
	}

	public static RecipeEntity? Select(string eqpCode, string? recipeCode, string? categoryCode)
	{
		dynamic obj = new ExpandoObject();
		obj.EqpCode = eqpCode;
		obj.RecipeCode = recipeCode;
		obj.CategoryCode = categoryCode;

		return DataContext.StringEntity<RecipeEntity>("@ModelRecipeParamMapNew.Select", RefineExpando(obj));
	}

	[ManualMap]
	public static IEnumerable<IDictionary> ApproveList(string? modelCode)
	{
		dynamic obj = new ExpandoObject();
		obj.ModelCode = modelCode;

		return ToDic(DataContext.StringDataSet("@ModelRecipeParamMapNew.ApproveList", RefineExpando(obj)).Tables[0]);
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

    [ManualMap]
    public static int ModelRecipeParamUpdate([FromBody] RecipeParamMapNewEntity entity)
    {
        if (ModelApproveService.ApproveCheck(entity.ModelCode) > 0)
        {
            return -1;
        }

        if (CheckExt(entity.ModelCode) > 0)
        {
            return -1;
        }

        dynamic obj = new ExpandoObject();
        obj.CorpId = entity.CorpId;
        obj.FacId = entity.FacId;
        obj.ModelCode = entity.ModelCode;
        obj.OperationSeqNo = entity.OperationSeqNo;
        obj.OperationCode = entity.OperationCode;
        obj.EqpCode = entity.EqpCode;
        obj.GroupCode = entity.GroupCode;
        obj.InterlockYn = entity.InterlockYn;
        obj.RecipeChangeYn = entity.RecipeChangeYn;

        int result = 0;
		if (entity.GroupCode is null)
		{
            result += DataContext.StringNonQuery("@ModelRecipeParamMapNew.RecipeDeleteModelMap", RefineExpando(obj));
            result += DataContext.StringNonQuery("@ModelRecipeParamMapNew.ParamDeleteModelMap", RefineExpando(obj));

            obj.ApproveKey = NewShortId();
            result += DataContext.StringNonQuery("@ModelRecipeParamMapNew.RecipeParamApproveExUpdate", RefineExpando(obj));
        }
		else
		{
            result += DataContext.StringNonQuery("@ModelRecipeParamMapNew.RecipeInsertModelMap", RefineExpando(obj));
			result += DataContext.StringNonQuery("@ModelRecipeParamMapNew.ParamInsertModelMap", RefineExpando(obj));

            obj.ApproveKey = NewShortId();
            result += DataContext.StringNonQuery("@ModelRecipeParamMapNew.RecipeParamApproveExUpdate", RefineExpando(obj));
        }

        return result;
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }

    [ManualMap]
    public static IEnumerable<IDictionary> RecipeList(char? approveYn, string? equipmentCode, string? groupCode, string? bomItemCode, int? operationSeqNo)
    {
        dynamic obj = new ExpandoObject();
        obj.EqpCode = equipmentCode;
        obj.GroupCode = groupCode;
        obj.ModelCode = bomItemCode;
        obj.OperationSeqNo = operationSeqNo;

		RemoveCache();

		DataTable dt = new DataTable();

        if (string.IsNullOrEmpty(approveYn.ToString()) || (!string.IsNullOrEmpty(approveYn.ToString()) && approveYn == 'Y'))
            dt = DataContext.StringDataSet("@ModelRecipeParamMapNew.RecipeList", RefineExpando(obj, true)).Tables[0];
		else
			dt = DataContext.StringDataSet("@ModelRecipeParamMapNew.RecipeExList", RefineExpando(obj, true)).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static int Registration([FromBody] ModelRegistedHistoryEntity entity)
    {
        if (ModelApproveService.ApproveCheck(entity.ModelCode) > 0)
        {
            return -1;
        }

        if (CheckExt(entity.ModelCode) > 0)
        {
            return -1;
        }

        dynamic obj = new ExpandoObject();
        obj.CreateUser = entity.CreateUser;

        DataTable usergroupDt = DataContext.StringDataSet("@ModelRecipeParamMapNew.UserGroupList", RefineExpando(obj, true)).Tables[0];

        int result = 0;
        usergroupDt.AsEnumerable().ForEach(x =>
		{
			var usergroup = x.TypeCol<string>("usergroup");

			entity.Usergroup = usergroup;

            result += DataContext.StringNonQuery("@ModelRecipeParamMapNew.Registration", RefineEntity(entity));
        });

		return result;
    }

    [ManualMap]
    public static int Check(string modelCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ModelCode = modelCode;

        return DataContext.StringValue<int>("@ModelRecipeParamMapNew.RegistrationCheck", RefineExpando(obj, true));
    }

    [ManualMap]
    public static int CheckExt(string modelCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ModelCode = modelCode;
        obj.CreateUser = UserId;

        DataTable usergroupDt = DataContext.StringDataSet("@ModelRecipeParamMapNew.UserGroupList", RefineExpando(obj, true)).Tables[0];

        int result = 0;
        usergroupDt.AsEnumerable().ForEach(x =>
        {
            var usergroup = x.TypeCol<string>("usergroup");

            obj.Usergroup = usergroup;

            result += DataContext.StringNonQuery("@ModelRecipeParamMapNew.RegistrationCheckExt", RefineExpando(obj, true));
        });

        return result;
    }

    [ManualMap]
    public static int Cancellation([FromBody] ModelRegistedHistoryEntity entity)
    {

        if (ModelApproveService.ApproveCheck(entity.ModelCode) > 0)
        {
            return -1;
        }

        dynamic obj = new ExpandoObject();
        obj.CreateUser = entity.CreateUser;

        DataTable usergroupDt = DataContext.StringDataSet("@ModelRecipeParamMapNew.UserGroupList", RefineExpando(obj, true)).Tables[0];

        int result = 0;
        usergroupDt.AsEnumerable().ForEach(x =>
        {
            var usergroup = x.TypeCol<string>("usergroup");

            entity.Usergroup = usergroup;

            result += DataContext.StringNonQuery("@ModelRecipeParamMapNew.Cancellation", RefineEntity(entity));
        });

        return result;
    }
}