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

public class ErpVendorService : MinimalApiService, IMinimalApi, Map.IMap
{
    public ErpVendorService(ILogger<ErpVendorService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> CustomerListAll()
    {
        dynamic obj = new ExpandoObject();

        return ToDic(DataContext.StringDataSet("@Erp.VendorCustomerList", obj).Tables[0]);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> CustomerListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(),
            DateTime.Now.AddMinutes(GetCacheMin()),
            CustomerListAll);

        return list;
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }

    public static Map GetMap(string? category = null)
    {
        if (category == "customer")
        {
            return CustomerListAllCache()
                .DistinctBy(x => x.TypeKey<string>("vendorCode"))
                .Select(y => {
                    return new MapEntity(
                        y.TypeKey<string>("vendorCode"),
                        y.TypeKey<string>("vendorShortName"),
                        y.TypeKey<string>("vendorId"),
                        'Y');
                }).ToMap();
        }

        return new List<MapEntity>().ToMap();
    }

    public static void RefreshMap()
    {
        RemoveCache();
    }
}
