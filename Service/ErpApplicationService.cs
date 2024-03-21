namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;

public class ErpApplicationService : MinimalApiService, IMinimalApi, Map.IMap
{
    public ErpApplicationService(ILogger<ErpApplicationService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }
    
    public static IEnumerable<IDictionary> ListAll()
    {
        dynamic obj = new ExpandoObject();

        return ToDic(DataContext.StringDataSet("@Erp.ApplicationList", obj).Tables[0]);
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

    public static IDictionary? SelectCache(string appCode)
    {
        return ListAllCache().FirstOrDefault(x => x.TypeKey<string>("appCode") == appCode);
    }

    [ManualMap]
    public static string SelectCacheName(string appCode)
    {
        return SelectCache(appCode)?.TypeKey<string>("appName") ?? string.Empty;
    }

    public static Map GetMap(string? category = null)
    {
        return ListAllCache()
            .Select(y => {
            return new MapEntity(
                y.TypeKey<string>("appCode"), 
                y.TypeKey<string>("appName"), 
                string.Empty ,
                'Y');
        }).ToMap();
    }

    public static void RefreshMap()
    {
        RemoveCache();
    }
}
