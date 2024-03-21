namespace WebApp;

using System;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Mvc;

public class EqpAreaService : MinimalApiService, IMinimalApi, Map.IMap
{
    public EqpAreaService(ILogger<EqpAreaService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }
	public static EqpareaList ListAll()
	{
		return new EqpareaList(DataContext.StringEntityList<EqpareaEntity>("@Eqparea.List", RefineExpando(new ExpandoObject())));
	}


	public static EqpareaList List(string? eqpareagroupCode)
    {
        dynamic obj = new ExpandoObject();
        obj.EqpareagroupCode = eqpareagroupCode;

        return new EqpareaList(DataContext.StringEntityList<EqpareaEntity>("@Eqparea.List", RefineExpando(obj, true)));
    }

    public static int Insert([FromBody] EqpareaEntity entity)
    {
		RemoveCache();

		return DataContext.StringNonQuery("@Eqparea.Insert", RefineEntity(entity));
    }

    public static int Update([FromBody] EqpareaEntity entity)
    {
		RemoveCache();

		return DataContext.StringNonQuery("@Eqparea.Update", RefineEntity(entity));
    }

    public static int Delete(string? eqpareagroupCode, string? eqpareaCode)
    {
        dynamic obj = new ExpandoObject();
		obj.EqpareagroupCode = eqpareagroupCode;
		obj.EqpareaCode = eqpareaCode;

		RemoveCache();

        return DataContext.StringNonQuery("@Eqparea.Delete", RefineExpando(obj));
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }
	public static EqpareaList ListAllCache()
	{
		var list = UtilEx.FromCache(
			BuildCacheKey(),
			DateTime.Now.AddMinutes(GetCacheMin()),
			ListAll);

		return list;
	}

	public static EqpareaEntity? SelectCache(string eqpareaCode)
	{
		return ListAllCache().FirstOrDefault(x => x.EqpareaCode == eqpareaCode);
	}

	[ManualMap]
	public static string SelectCacheName(string eqpareaCode)
	{
		return ListAllCache().FirstOrDefault(x => x.EqpareaCode == eqpareaCode)?.EqpareaName ?? string.Empty;
	}

	#region EqpArea Combo

	[ManualMap]
	public static Map EqpAreaGetMap(string? category = null)
	{
		return List(category).AsEnumerable()
		.Select(y => {
			return new MapEntity(y.EqpareaCode, y.EqpareaName, null, 'Y');
		}).ToMap();
	}

	[ManualMap]
	public static void EqpAreaRefreshMap()
	{
		//
	}


	#endregion
	public static Map GetMap(string? category = null)
	{
		return ListAllCache()
			.Where(x => category == null || x.EqpareaCode == category)
			.Select(y => {
				return new MapEntity(y.EqpareaCode, y.EqpareaName, null, y.UseYn);
			}).ToMap();
	}

	public static void RefreshMap()
	{
		RemoveCache();
	}

}
