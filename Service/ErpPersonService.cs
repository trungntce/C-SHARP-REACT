namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Diagnostics;
using System.Dynamic;
using System.Linq;
using System.Runtime.CompilerServices;
using Framework;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

public class ErpPersonService : MinimalApiService, IMinimalApi, Map.IMap
{
    public ErpPersonService(ILogger<ErpPersonService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> ListAll()
    {
        dynamic obj = new ExpandoObject();

        return ToDic(DataContext.StringDataSet("@Erp.HrmPersonList", obj).Tables[0]);
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

    public static Map GetMap(string? category = null)
    {
        return ListAllCache()
            .Select(y => {
                return new MapEntity(
                    y.TypeKey<string>("personNum"),
                    y.TypeKey<string>("name"),
                    string.Empty,
                    'Y');
            }).ToMap();
    }

    public static void RefreshMap()
    {
        RemoveCache();
    }
}
