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

public class ErpWorkCenterService : MinimalApiService, IMinimalApi, Map.IMap
{
    public ErpWorkCenterService(ILogger<ErpWorkCenterService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> WorkcenterListAll()
    {
        dynamic obj = new ExpandoObject();

        return ToDic(DataContext.StringDataSet("@Erp.WorkcenterList", obj).Tables[0]);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> WorkcenterListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(),
            DateTime.Now.AddMinutes(GetCacheMin()),
			WorkcenterListAll);

        return list;
    }

	public static IDictionary? SelectCache(string workcenterCode)
	{
		return WorkcenterListAllCache().FirstOrDefault(x => x.TypeKey<string>("workcenterCode") == workcenterCode);
	}

	[ManualMap]
	public static string SelectCacheName(string workcenterCode)
	{
		return SelectCache(workcenterCode)?.TypeKey<string>("workcenterDescription") ?? string.Empty;
	}

	public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }

    public static Map GetMap(string? category = null)
    {
        return WorkcenterListAllCache()
            .Select(y => {
                return new MapEntity(
                    y.TypeKey<string>("workcenterCode"),
                    y.TypeKey<string>("workcenterDescription"),
                    "",
                    'Y');
            }).ToMap();
    }

    public static void RefreshMap()
    {
        RemoveCache();
    }
}
