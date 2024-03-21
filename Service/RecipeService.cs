namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Dynamic;

using Framework;
using Microsoft.AspNetCore.Mvc;

public class RecipeService : MinimalApiService, IMinimalApi, Map.IMap
{
	public RecipeService(ILogger<RecipeService> logger) : base(logger)
	{
	}

	public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
	{
		group.MapPut("/set", nameof(InsertSet));
		group.MapPost("/set", nameof(UpdateSet));

		group.MapGet("/recipemap", nameof(RecipeList));
		group.MapPut("/modelmap", nameof(InsertModelMap));

		return RouteAllEndpoint(group);
	}

	public static IEnumerable<IDictionary> List(string? eqpCode, string? recipeCode, string? recipeName, string? groupCode)
	{
		dynamic obj = new ExpandoObject();

		obj.EqpCode = eqpCode;
		obj.RecipeCode = recipeCode;
		obj.RecipeName = recipeName;
		obj.GroupCode = groupCode;

		DataTable dt = DataContext.StringDataSet("@Recipe.List", RefineExpando(obj, true)).Tables[0];

		return ToDic(dt);
	}

	public static RecipeEntity? Select(string eqpCode, string? recipeCode)
	{
		dynamic obj = new ExpandoObject();
		obj.EqpCode = eqpCode;
		obj.RecipeCode = recipeCode;

		return DataContext.StringEntity<RecipeEntity>("@Recipe.Select", RefineExpando(obj, true));
	}

	public static int Insert([FromBody] RecipeEntity entity)
	{
		//if (Select(entity.EqpCode, entity.RecipeCode) != null)
		//	return -1;

		RemoveCache();

		return DataContext.StringNonQuery("@Recipe.Insert", RefineEntity(entity));
	}

	public static int Update([FromBody] RecipeEntity entity)
	{
		RemoveCache();

		return DataContext.StringNonQuery("@Recipe.Update", RefineEntity(entity));
	}

	public static int Delete(string eqpCode, string recipeCode)
	{
		dynamic obj = new ExpandoObject();
		obj.EqpCode = eqpCode;
		obj.RecipeCode = recipeCode;

		RemoveCache();

		return DataContext.StringNonQuery("@Recipe.Delete", RefineExpando(obj));
	}

	[ManualMap]
	public static int InsertSet([FromBody] RecipeSetEntity entity)
	{
		dynamic obj = new ExpandoObject();
		
		obj.EqpCode = entity.EqpCode;

		DataTable dt = DataContext.StringDataSet("@Recipe.List", RefineExpando(obj, true)).Tables[0];

		foreach (var i in 0..(entity.EqpCodeList.Count - 1))
		{

			foreach (DataRow row in dt.Rows)
			{
				string? recipeCode = row.TypeCol("recipe_code", string.Empty);

				//if (Select(entity.EqpCodeList[i], recipeCode) != null)
				//	return -1;
			}
		}

		RemoveCache();

		int result = 0;

		foreach (var i in 0..(entity.EqpCodeList.Count - 1))
		{
			entity.EqpCode = entity.EqpCodeList[i];

			foreach (DataRow row in dt.Rows)
			{
				entity.RecipeCode = row.TypeCol("recipe_code", string.Empty);

				result += DataContext.StringNonQuery("@Recipe.Insert", RefineEntity(entity));
			}

		}

		return result;
	}

	[ManualMap]
	public static int UpdateSet([FromBody] RecipeSetEntity entity)
	{
		dynamic obj = new ExpandoObject();

		int result = 0;

		if (entity.Gubun == "recipeCate")
		{
			obj.RecipeCode = entity.RecipeCode;

			DataTable dt = DataContext.StringDataSet("@Recipe.List", RefineExpando(obj, true)).Tables[0];

			List<string> strings = new List<string>();

			foreach (DataRow row in dt.Rows)
			{
				entity.EqpCode = row.TypeCol("eqp_code", string.Empty);
				entity.RecipeCode = row.TypeCol("recipe_code", string.Empty);

				result += DataContext.StringNonQuery("@Recipe.Update", RefineEntity(entity));
			}
		}
		else if(entity.Gubun == "recipe")
		{
			DataTable dt = DataContext.StringDataSet("@Recipe.List", RefineExpando(obj, true)).Tables[0];

			List<string> strings = new List<string>();

			foreach (DataRow row in dt.Rows)
			{
				entity.EqpCode = row.TypeCol("eqp_code", string.Empty);
				entity.RecipeCode = row.TypeCol("recipe_code", string.Empty);

				result += DataContext.StringNonQuery("@Recipe.Update", RefineEntity(entity));
			}
		}

		RemoveCache();

		return result; 
	}

	[ManualMap]
	public static IEnumerable<IDictionary> RecipeList(string? equipmentCode, string? groupCode, string? bomItemCode, int? operationSeqNo)
	{
		dynamic obj = new ExpandoObject();
		obj.EqpCode = equipmentCode;
		obj.GroupCode = groupCode;
		obj.ModelCode = bomItemCode;
		obj.OperationSeqNo = operationSeqNo;

		RemoveCache();

		DataTable dt = DataContext.StringDataSet("@Recipe.RecipeList", RefineExpando(obj, true)).Tables[0];

		return ToDic(dt);
	}

    [ManualMap]
    public static int DeleteModelMap([FromBody] RecipeParamMapEntity entity)
    {
        return DataContext.StringNonQuery("@Recipe.DeleteModelMap", RefineEntity(entity));
    }

    [ManualMap]
	public static int InsertModelMap ([FromBody] RecipeParamMapEntity entity)
	{
		return DataContext.StringNonQuery("@Recipe.InsertModelMap", RefineEntity(entity));
    }

	[ManualMap]
	public static DataTable GroupListAll()
	{
		dynamic obj = new ExpandoObject();
		return DataContext.StringDataSet("@Recipe.GroupList", RefineExpando(obj, true)).Tables[0];
	}


	public static IEnumerable<IDictionary> ListAllCache()
    {
        var list = UtilEx.FromCache<IEnumerable<IDictionary>, string?, string?, string?, string?>(
            BuildCacheKey(),
            DateTime.Now.AddMinutes(GetCacheMin()),
            List,
            null,
            null,
            null,
            null);

        return list;
    }

	public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }

    public static Map GetMap(string? category = null)
    {
        return ListAllCache()
        .OrderBy(x => x.TypeKey<string>("recipeCode"))
        .Select(y => {
            return new MapEntity(y.TypeKey<string>("recipeCode"), y.TypeKey<string>("recipeName"), null, 'Y');
        }).ToMap();
    }

	[ManualMap]
	public static Map GroupGetMap(string? category = null)
	{
		return GroupListAll().AsEnumerable()
		.Select(y => {
			return new MapEntity(
				$"{y.TypeCol<string>("group_code")}",
				$"{y.TypeCol<string>("group_name")}",
				null,
				'Y');
		}).ToMap();
	}


	public static void RefreshMap()
    {
        RemoveCache();
    }
}

