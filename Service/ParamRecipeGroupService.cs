namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Dynamic;

using Framework;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;
using Newtonsoft.Json;

public class ParamRecipeGroupService : MinimalApiService, IMinimalApi, Map.IMap
{
	public ParamRecipeGroupService(ILogger<ParamRecipeGroupService> logger) : base(logger)
	{
	}

	public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
	{
        group.MapGet("rawnew", nameof(RawListForNew));

		return RouteAllEndpoint(group);
	}

	public static IEnumerable<IDictionary> List(string? groupCode, string? groupName, string? eqpCode,
		string? paramId, string? paramName, string? recipeCode, string? recipeName)
	{
		dynamic obj = new ExpandoObject();
        obj.GroupCode  = groupCode;
        obj.GroupName  = groupName;
        obj.EqpCode = eqpCode;
        obj.ParamId    = paramId;
        obj.ParamName  = paramName;
        obj.RecipeCode = recipeCode;
        obj.RecipeName = recipeName;

        DataTable dt = DataContext.StringDataSet("@ParamRecipeGroup.List", RefineExpando(obj, true)).Tables[0];

        FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

        return ToDic(dt);
	}

    [ManualMap]
    public static IEnumerable<IDictionary> RawListForNew(string eqpCode)
    {
        dynamic obj = new ExpandoObject();
        obj.EqpCode = eqpCode;

        DataTable dt = DataContext.StringDataSet("@ParamRecipeGroup.RawListForNew", RefineExpando(obj, true)).Tables[0];

        return ToDic(dt);
    }

    public static int Insert([FromBody] IDictionary dic)
    {
        string eqpCode = dic.TypeKey<string>("eqpCode");
        string groupName = dic.TypeKey<string>("groupName");
        string paramJson = dic.TypeKey<string>("paramJson");
        string recipeJson = dic.TypeKey<string>("recipeJson");

        var paramList = JsonConvert.DeserializeObject<List<ParamEntity>>(paramJson);
        var recipeList = JsonConvert.DeserializeObject<List<RecipeEntity>>(recipeJson);

        dynamic obj = new ExpandoObject();
        obj.GroupName = groupName;

        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        string groupCode = db.ExecuteStringScalar<string>("@ParamRecipeGroup.Insert", RefineExpando(obj));
        paramList?.ForEach(x =>
        {
            x.GroupCode = groupCode;
            x.InterlockYn = x.InterlockYn ?? "N";
            x.AlarmYn = x.AlarmYn ?? "N";
            x.JudgeYn = x.JudgeYn ?? "N";
        });
        recipeList?.ForEach(x => 
        {
            x.GroupCode = groupCode;
            x.InterlockYn = x.InterlockYn ?? "N";
            x.AlarmYn = x.AlarmYn ?? "N";
            x.JudgeYn = x.JudgeYn ?? "N";
        });

        int result = 1;

        if (paramList != null)
            foreach (var param in paramList)
                result += ParamService.Insert(param);

        if (recipeList != null)
            foreach (var recipe in recipeList)
                result += RecipeService.Insert(recipe);

        return result;
    }

    public static int Update([FromBody] IDictionary dic)
    {
        string groupCode = dic.TypeKey<string>("groupCode");
        string groupName = dic.TypeKey<string>("groupName");
        string paramJson = dic.TypeKey<string>("paramJson");
        string recipeJson = dic.TypeKey<string>("recipeJson");

        var paramList = JsonConvert.DeserializeObject<List<ParamEntity>>(paramJson);
        var recipeList = JsonConvert.DeserializeObject<List<RecipeEntity>>(recipeJson);

        dynamic obj = new ExpandoObject();
        obj.GroupCode = groupCode;
        obj.GroupName = groupName;

        int result = DataContext.StringNonQuery("@ParamRecipeGroup.Update", RefineExpando(obj));

        if (paramList != null)
            foreach (var param in paramList)
                result += ParamService.Update(param);

        if (recipeList != null)
            foreach (var recipe in recipeList)
                result += RecipeService.Update(recipe);

        return result;
    }

    public static int Delete(string groupCode)
    {
        dynamic obj = new ExpandoObject();
        obj.GroupCode = groupCode;

        return DataContext.StringNonQuery("@ParamRecipeGroup.Delete", RefineExpando(obj));
    }

    public static IEnumerable<IDictionary> ListAll()
    {
        DataTable dt = DataContext.StringDataSet("@ParamRecipeGroup.List", new { }).Tables[0];

        return ToDic(dt);
    }

    public static IEnumerable<IDictionary> ListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(),
            DateTime.Now.AddMinutes(GetCacheMin()),
            ListAll);

        return list;
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }

    public static void RefreshMap()
    {
        RemoveCache();
    }

    public static Map GetMap(string? category = null)
    {
        return ListAllCache()
            .Select(y => {
                return new MapEntity(y.TypeKey<string>("groupCode"), y.TypeKey<string>("groupName"), string.Empty, 'Y');
            }).ToMap();
    }
}

