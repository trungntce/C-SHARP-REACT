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

public class ErpItemService : MinimalApiService, IMinimalApi, Map.IMap
{
    public ErpItemService(ILogger<ErpItemService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }
    
    public static IEnumerable<IDictionary> ListAll()
    {
        dynamic obj = new ExpandoObject();

        return ToDic(DataContext.StringDataSet("@Erp.ItemMasterList", obj).Tables[0]);
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

    public static IDictionary? SelectCache(string itemCode)
    {
        return ListAllCache().FirstOrDefault(x => x.TypeKey<string>("itemCode") == itemCode);
    }

    [ManualMap]
    public static string SelectCacheName(string itemCode)
    {
        return SelectCache(itemCode)?.TypeKey<string>("itemDescription") ?? string.Empty;
    }

    public static Map GetMap(string? category = null)
    {
        return ListAllCache()
            .DistinctBy(x => x.TypeKey<string>("itemCode"))
            .Select(y => {
            return new MapEntity(
                y.TypeKey<string>("itemCode"), 
                y.TypeKey<string>("itemDescription"), 
                y.TypeKey<string>("inventoryItemId"), 
                'Y');
        }).ToMap();
    }

    public static void RefreshMap()
    {
        RemoveCache();
    }
}
