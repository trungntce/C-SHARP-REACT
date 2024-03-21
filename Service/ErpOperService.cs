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

public class ErpOperService : MinimalApiService, IMinimalApi, Map.IMap
{
    public ErpOperService(ILogger<ErpOperService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> OperListAll()
    {
        dynamic obj = new ExpandoObject();

        return ToDic(DataContext.StringDataSet("@Erp.OperList", obj).Tables[0]);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> OperListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(),
            DateTime.Now.AddMinutes(GetCacheMin()),
			OperListAll);

        return list;
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }

    public static Map GetMap(string? category = null)
    {
        return OperListAllCache()
            .Select(y => {
                return new MapEntity(
                    y.TypeKey<string>("operCode"),
                    y.TypeKey<string>("operDescription"),
                    y.TypeKey<string>("workingUom"),
                    'Y');
            }).ToMap();
    }

    public static void RefreshMap()
    {
        RemoveCache();
    }
}
