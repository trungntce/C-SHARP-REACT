namespace WebApp;

using System;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Mvc;

public class EqpAreaGroupService : MinimalApiService, IMinimalApi, Map.IMap
{
    public EqpAreaGroupService(ILogger<EqpAreaGroupService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }
	public static EqpareagroupList ListAll()
	{
		return new EqpareagroupList(DataContext.StringEntityList<EqpareagroupEntity>("@Eqpareagroup.List", RefineExpando(new ExpandoObject())));
	}


	public static EqpareagroupList List(string? eqpCode, string? eqpareagroupCode, string? eqpareagroupName, string? useYn)
    {
        dynamic obj = new ExpandoObject();
		obj.EqpCode = eqpCode;
        obj.EqpareagroupCode = eqpareagroupCode;
        obj.EqpareagroupName = eqpareagroupName;
        obj.UseYn = useYn;

        return new EqpareagroupList(DataContext.StringEntityList<EqpareagroupEntity>("@Eqpareagroup.List", RefineExpando(obj, true)));
    }

    public static int Insert([FromBody] EqpareagroupEntity entity)
    {
		RemoveCache();

		return DataContext.StringNonQuery("@Eqpareagroup.Insert", RefineEntity(entity));
    }

    public static int Update([FromBody] EqpareagroupEntity entity)
    {
		RemoveCache();

		return DataContext.StringNonQuery("@Eqpareagroup.Update", RefineEntity(entity));
    }

    public static int Delete(string? eqpCode, string? eqpareagroupCode)
    {
        dynamic obj = new ExpandoObject();
		obj.EqpCode = eqpCode;
		obj.EqpareagroupCode = eqpareagroupCode;

		RemoveCache();

        return DataContext.StringNonQuery("@Eqpareagroup.Delete", RefineExpando(obj));
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }
	public static EqpareagroupList ListAllCache()
	{
		var list = UtilEx.FromCache(
			BuildCacheKey(),
			DateTime.Now.AddMinutes(GetCacheMin()),
			ListAll);

		return list;
	}

	public static EqpareagroupEntity? SelectCache(string eqpareagroupCode)
	{
		return ListAllCache().FirstOrDefault(x => x.EqpareagroupCode == eqpareagroupCode);
	}

	[ManualMap]
	public static string SelectCacheName(string eqpareagroupCode)
	{
		return ListAllCache().FirstOrDefault(x => x.EqpareagroupCode == eqpareagroupCode)?.EqpareagroupName ?? string.Empty;
	}

	public static Map GetMap(string? category = null)
	{
		return ListAllCache()
			.Where(x => x.EqpCode == category)
			.Select(y => {
				return new MapEntity(y.EqpareagroupCode, y.EqpareagroupName, null, y.UseYn);
			}).ToMap();
	}

	public static void RefreshMap()
	{
		RemoveCache();
	}
}
