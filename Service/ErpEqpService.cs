namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;

public class ErpEqpService : MinimalApiService, IMinimalApi, Map.IMap
{
    public ErpEqpService(ILogger<ErpEqpService> logger) : base(logger)
    {
    }

	public static IEnumerable<IDictionary> List()
	{
		dynamic obj = new ExpandoObject();

		return ToDic(DataContext.StringDataSet("@Erp.EqpMasterList", obj).Tables[0]);
	}

	public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }
    
    public static IEnumerable<IDictionary> ListAll()
    {
        dynamic obj = new ExpandoObject();

        return ToDic(DataContext.StringDataSet("@Erp.EqpMasterList", obj).Tables[0]);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> WorkCenterEqpList()
    {
        dynamic obj = new ExpandoObject();

        return ToDic(DataContext.StringDataSet("@Erp.WorkCenterEqpList", RefineExpando(obj)).Tables[0]);
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

    public static IDictionary? SelectCache(string eqpCode)
    {
        return ListAllCache().FirstOrDefault(x => x.TypeKey<string>("equipmentCode") == eqpCode);
    }

    [ManualMap]
    public static string SelectCacheName(string eqpCode)
    {
        return SelectCache(eqpCode)?.TypeKey<string>("equipmentDescription") ?? string.Empty;
    }

    public static Map GetMap(string? category = null)
    {
        return ListAllCache()
            .Where(x => category == null || x.TypeKey<string>("equipmentCode").StartsWith(category, StringComparison.OrdinalIgnoreCase))
            .Select(y => {
            return new MapEntity(
                y.TypeKey<string>("equipmentCode"), 
                y.TypeKey<string>("equipmentDescription"), 
                string.Empty,
                'Y');
        }).ToMap();
    }

    public static void RefreshMap()
    {
        RemoveCache();
    }

    [ManualMap]
    public static Map GetMapWorkCenterEqp(string? category = null)
    {
        return WorkCenterEqpList()
            .Where(x => category == null || x.TypeKey<string>("workcenterCode").StartsWith(category, StringComparison.OrdinalIgnoreCase))
            .Select(y => {
             return new MapEntity(
                 y.TypeKey<string>("equipmentCode"),
                 y.TypeKey<string>("equipmentDescription"),
                 string.Empty,
                 'Y');
        }).ToMap();
    }
}
