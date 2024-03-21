namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Math;

public class OperInspMatter4MModelService : MinimalApiService, IMinimalApi, Map.IMap
{
	public OperInspMatter4MModelService(ILogger<OperInspMatter4MModelService> logger) : base(logger)
	{
	}

	public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
	{
        group.MapGet("/modeloper", nameof(ModelOper));
        group.MapPost("/totalinsert", nameof(TotalInsert));
        return RouteAllEndpoint(group);
	}

	public static IEnumerable<IDictionary> List(string? modelCode, string? modelDescription, string? workorder)
	{
		return ToDic(Select(modelCode, modelDescription, workorder));
	}

    public static DataTable Select(string modelCode, string modelDescription, string workorder)
    {
        dynamic obj = new ExpandoObject();

        obj.ModelCode = modelCode;
        obj.ModelDescription = modelDescription;
        obj.Workorder = workorder;

        DataTable dt = DataContext.StringDataSet("@OperInspMatter4MModel.ModelList", RefineExpando(obj, true)).Tables[0];

        return dt;
    }

    [ManualMap]
    public static IEnumerable<IDictionary> ModelOper(string modelCode)
    {
        dynamic obj = new ExpandoObject();

        obj.ModelCode = modelCode;

        DataTable dt = DataContext.StringDataSet("@OperInspMatter4MModel.List", RefineExpando(obj, true)).Tables[0];

        return ToDic(dt);
    }


    [ManualMap]
    public static int TotalInsert([FromBody] Dictionary<string, object?> dic)
    {

        var param = dic.ToCleanDic().ToDictionary(x => x.Key, y => y.Value!)["json"];

        var list = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(dic.TypeKey<string>("json"));
        string modelCode = list[0].TypeKey<string>("modelCode");
        string modelList = param.ToString();

        dynamic obj = new ExpandoObject();
        obj.ModelList = modelList;

        DataContext.StringNonQuery("@OperInspMatter4MModel.Delete", new { modelCode });
        var rtn = DataContext.StringNonQuery("@OperInspMatter4MModel.Insert", RefineExpando(obj));

        return rtn;
    }


    public static int Insert([FromBody] Dictionary<string, object?> dic)
    {


        return -1;
        //return DataContext.StringNonQuery("@OperInspMatter4MModel.Insert", RefineEntity(entity));
    }

    //public static int Update([FromBody] OperInspEntity entity)
    //{
    //    if (Select(entity.OperCode).Rows.Count == 0)
    //    {
    //        return -1;
    //    }

    //    return DataContext.StringNonQuery("@OperInspMatter4MModel.Update", RefineEntity(entity));
    //}

    //public static int Delete(int rowNo)
    //{
    //    dynamic obj = new ExpandoObject();
    //    obj.RowNo = rowNo;

    //    return DataContext.StringNonQuery("@OperInspMatter4MModel.Delete", RefineExpando(obj));
    //}












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

