namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Dynamic;

using Framework;
using Microsoft.AspNetCore.Mvc;

public class OperInspMatterItemService : MinimalApiService, IMinimalApi, Map.IMap
{
	public OperInspMatterItemService(ILogger<ParamService> logger) : base(logger)
	{
	}

	public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
	{
		group.MapPut("/set", nameof(InsertSet));
		group.MapPost("/set", nameof(UpdateSet));

		group.MapPut("/modelmap", nameof(InsertModelMap));

		return RouteAllEndpoint(group);
	}

	public static IEnumerable<IDictionary> List(string? eqpCode, string? groupCode)
	{
		dynamic obj = new ExpandoObject();

		obj.EqpCode = eqpCode;
        obj.GroupCode = eqpCode;
        obj.GroupCode = groupCode;

        DataTable dt = DataContext.StringDataSet("@Param.List", RefineExpando(obj, true)).Tables[0];

		return ToDic(dt);
	}

	public static ParamEntity? Select(string eqpCode, string paramId)
	{
		dynamic obj = new ExpandoObject();
		obj.EqpCode = eqpCode;
		obj.ParamId = paramId;

		return DataContext.StringEntity<ParamEntity>("@Param.Select", RefineExpando(obj, true));
	}

	public static int Insert([FromBody] ParamEntity entity)
	{
		entity.ParamId = NewShortId();

		if (Select(entity.EqpCode, entity.ParamId) != null)
			return -1;

		RemoveCache();

		return DataContext.StringNonQuery("@Param.Insert", RefineEntity(entity));
	}

	public static int Update([FromBody] ParamEntity entity)
	{
		RemoveCache();

		return DataContext.StringNonQuery("@Param.Update", RefineEntity(entity));
	}

	public static int Delete(string eqpCode, string paramId)
	{
		dynamic obj = new ExpandoObject();
		obj.EqpCode = eqpCode;
		obj.ParamId = paramId;

		RemoveCache();

		return DataContext.StringNonQuery("@Param.Delete", RefineExpando(obj));
	}

	[ManualMap]
	public static int InsertSet([FromBody] ParamSetEntity entity)
	{
		foreach (var i in 0..(entity.EqpCodeList.Count - 1))
		{
			if (Select(entity.EqpCodeList[i], entity.ParamId) != null)
				return -1;
		}

		RemoveCache();

		int result = 0;

		foreach (var i in 0..(entity.EqpCodeList.Count - 1))
		{
			entity.EqpCode = entity.EqpCodeList[i];
			entity.ParamId = NewShortId();

			result += DataContext.StringNonQuery("@Param.Insert", RefineEntity(entity));
		}

		return result;
	}

	[ManualMap]
	public static int UpdateSet([FromBody] ParamSetEntity entity)
	{
		dynamic obj = new ExpandoObject();

		obj.ParamId = entity.ParamId;

		DataTable dt = DataContext.StringDataSet("@Param.List", RefineExpando(obj, true)).Tables[0];

		List<string> strings = new List<string>();

		foreach (DataRow row in dt.Rows)
		{
			string? eqpCode = row.TypeCol("eqp_code", string.Empty);
			if (eqpCode != null)
			{
				strings.Add(eqpCode);

			}
		}

		entity.EqpCodeList = strings;


		RemoveCache();

		int result = 0;

		foreach (var i in 0..(entity.EqpCodeList.Count - 1))
		{
			entity.EqpCode = entity.EqpCodeList[i];

			result += DataContext.StringNonQuery("@Param.Update", RefineEntity(entity));
		}

		return result;
	}

    [ManualMap]
    public static int DeleteModelMap([FromBody] RecipeParamMapEntity entity)
    {
        return DataContext.StringNonQuery("@Param.DeleteModelMap", RefineEntity(entity));
    }

    [ManualMap]
    public static int InsertModelMap([FromBody] RecipeParamMapEntity entity)
    {
        return DataContext.StringNonQuery("@Param.InsertModelMap", RefineEntity(entity));
    }

    [ManualMap]
    public static int DeleteModelExtraMap([FromBody] RecipeParamMapEntity entity)
    {
        return DataContext.StringNonQuery("@Param.DeleteModelExtraMap", RefineEntity(entity));
    }

    [ManualMap]
    public static int InsertModelExtraMap([FromBody] RecipeParamMapEntity entity)
    {
        return DataContext.StringNonQuery("@Param.InsertModelExtraMap", RefineEntity(entity));
    }

    [ManualMap]
	public static RecipeEntity? SelectParamMap(string modelCode, string? paramId, int? operationSepNo, string? eqpCode)
	{
		dynamic obj = new ExpandoObject();
		obj.ModelCode = modelCode;
		obj.ParamId = paramId;
		obj.OperationSeqNo = operationSepNo;
		obj.EqpCode = eqpCode;

		return DataContext.StringEntity<RecipeEntity>("@Param.SelectModelMap", RefineExpando(obj, true));
	}

    public static IEnumerable<IDictionary> ListAllCache()
    {
        var list = UtilEx.FromCache<IEnumerable<IDictionary>, string?, string?>(
            BuildCacheKey(),
            DateTime.Now.AddMinutes(GetCacheMin()),
            List, 
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
        .OrderBy(x => x.TypeKey<string>("paramId"))
        .Select(y => {
            return new MapEntity(y.TypeKey<string>("paramId"), y.TypeKey<string>("paramName"), null, 'Y');
        }).ToMap();
    }

    public static void RefreshMap()
    {
        RemoveCache();
    }
}

