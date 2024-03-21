namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Dynamic;

using Framework;
using Microsoft.AspNetCore.Mvc;

public class OperInspMatter4MService : MinimalApiService, IMinimalApi, Map.IMap
{
	public OperInspMatter4MService(ILogger<OperInspMatter4MService> logger) : base(logger)
	{
	}

	public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
	{

		return RouteAllEndpoint(group);
	}

	public static IEnumerable<IDictionary> List(string? operCode)
	{
		return ToDic(Select(operCode));
	}

    public static DataTable Select(string operCode)
    {
        dynamic obj = new ExpandoObject();

        obj.OperCode = operCode;

        DataTable dt = DataContext.StringDataSet("@OperInspMatter4M.List", RefineExpando(obj, true)).Tables[0];

        return dt;
    }


    public static int Insert([FromBody] OperInspEntity entity)
    {
        if (Select(entity.OperCode).Rows.Count != 0)
        {
            return -1;
        }


        return DataContext.StringNonQuery("@OperInspMatter4M.Insert", RefineEntity(entity));
    }

    public static int Update([FromBody] OperInspEntity entity)
    {
        if (Select(entity.OperCode).Rows.Count == 0)
        {
            return -1;
        }

        return DataContext.StringNonQuery("@OperInspMatter4M.Update", RefineEntity(entity));
    }

    public static int Delete(int rowNo)
    {
        dynamic obj = new ExpandoObject();
        obj.RowNo = rowNo;

        return DataContext.StringNonQuery("@OperInspMatter4M.Delete", RefineExpando(obj));
    }












    #region AutoCombo
    public static List<OperWorkcenterExtEntity> ListAll()
    {
        dynamic obj = new ExpandoObject();
        return DataContext.StringEntityList<OperWorkcenterExtEntity>("@OperInspMatter4M.OperByWorkcenter", RefineExpando(obj));
    }


    public static List<OperWorkcenterExtEntity> ListAllCache()
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
        .Where(x => string.IsNullOrWhiteSpace(category) || x.Workcenter == category)
        .Select(y => {
            return new MapEntity(y.OperCode, y.OperDesc, y.Workcenter, 'Y');
        }).ToMap();

        //if (category == null)
        //    return ListAllCache(category)
        //   .Select(y =>
        //   {
        //       return new MapEntity(
        //            y.TypeKey<string>("oper_code"),
        //            y.TypeKey<string>("oper_desc"),
        //            string.Empty,
        //            'Y');
        //   }).ToMap();

        ////.Where(x => category == null || x.TypeKey<string>("operCode").StartsWith(category, StringComparison.OrdinalIgnoreCase))
        //return ListAllCache(category)
        //   .Select(y => {
        //       return new MapEntity(
        //            y.TypeKey<string>("oper_code"),
        //            y.TypeKey<string>("oper_desc"),
        //            string.Empty,
        //            'Y');
        //   }).ToMap();

        //return DataContext.StringDataSet("@DiWater.SystemList", new { }).Tables[0];
        //throw new NotImplementedException();
    }


    #endregion
}

