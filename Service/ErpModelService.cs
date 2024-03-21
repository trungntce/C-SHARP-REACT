namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Diagnostics;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

public class ErpModelService : MinimalApiService, IMinimalApi, Map.IMap
{
    public ErpModelService(ILogger<ErpModelService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }
    
    public static IEnumerable<IDictionary> ListAll()
    {
        dynamic obj = new ExpandoObject();

        return ToDic(DataContext.StringDataSet("@Erp.ModelMasterList", RefineExpando(obj)).Tables[0]);
    }

    public static IEnumerable<IDictionary> ListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(),
            DateTime.Now.AddMinutes(GetCacheMin()),
            ListAll);

        return list;
    }

    public static IEnumerable<IDictionary> List(string? itemCode, string? modelCode, string? modelDescription, string? itemCategoryCode = "FG")
    {
        dynamic obj = new ExpandoObject();
        obj.ItemCode = itemCode;
        obj.ModelCode = modelCode;
        obj.ModelDescription = modelDescription;
        obj.ItemCategoryCode = itemCategoryCode;

        DataTable dt = DataContext.StringDataSet("@Erp.ModelMasterList", RefineExpando(obj)).Tables[0];
        return ToDic(dt);
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }
    public static IDictionary? SelectCache(string modelCode)
    {
        return ListAllCache().FirstOrDefault(x => x.TypeKey<string>("modelCode") == modelCode);
    }

    [ManualMap]
    public static string SelectCacheName(string modelCode)
    {
        return SelectCache(modelCode)?.TypeKey<string>("modelDescription") ?? string.Empty;
    }

    public static Map GetMap(string? category = null)
    {
        return ListAllCache()
            .DistinctBy(x => x.TypeKey<string>("modelCode"))
            .Select(y => {
            return new MapEntity(
                y.TypeKey<string>("modelCode"), 
                y.TypeKey<string>("modelDescription"), 
                y.TypeKey<string>("modelId"), 
                'Y');
        }).ToMap();
    }

    public static void RefreshMap()
    {
        RemoveCache();
    }
}
