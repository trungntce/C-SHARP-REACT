namespace WebApp;

using System;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Mvc;

public class ErrorgroupService : MinimalApiService, IMinimalApi, Map.IMap
{
    public ErrorgroupService(ILogger<ErrorgroupService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }

    public static ErrorgroupList ListAll()
    {
        return new ErrorgroupList(DataContext.StringEntityList<ErrorgroupEntity>("@Errorgroup.List", RefineExpando(new ExpandoObject())));
    }

    public static ErrorgroupList List(string? errorgroupCode, string? errorgroupName, string? remark, char? useYn)
    {
        dynamic obj = new ExpandoObject();
        obj.ErrorgroupCode = errorgroupCode;
        obj.ErrorgroupName = errorgroupName;
        obj.Remark = remark;
        obj.UseYn = useYn;

        return new ErrorgroupList(DataContext.StringEntityList<ErrorgroupEntity>("@Errorgroup.List", RefineExpando(obj, true)));
    }

    public static ErrorgroupEntity? Select(string errorgroupCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ErrorgroupCode = errorgroupCode;

        return DataContext.StringEntity<ErrorgroupEntity>("@Errorgroup.Select", RefineExpando(obj, true));
    }

    public static int Insert([FromBody] ErrorgroupEntity entity)
    {
        if (Select(entity.ErrorgroupCode) != null)
            return -1;

        RemoveCache();

        return DataContext.StringNonQuery("@Errorgroup.Insert", RefineEntity(entity));
    }
    public static int Update([FromBody] ErrorgroupEntity entity)
    {
        RemoveCache();

        return DataContext.StringNonQuery("@Errorgroup.Update", RefineEntity(entity));
    }
    public static int Delete(string errorgroupCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ErrorgroupCode = errorgroupCode;

        RemoveCache();

        return DataContext.StringNonQuery("@Errorgroup.Delete", RefineExpando(obj));
    }

    public static ErrorgroupList ListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(),
            DateTime.Now.AddMinutes(GetCacheMin()),
            ListAll);

        return list;
    }

    public static ErrorgroupEntity? SelectCache(string errorgroupCode)
    {
        return ListAllCache().FirstOrDefault(x => x.ErrorgroupCode == errorgroupCode);
    }

    [ManualMap]
    public static string SelectCacheName(string errorgroupCode)
    {
        return ListAllCache().FirstOrDefault(x => x.ErrorgroupCode == errorgroupCode)?.ErrorgroupName ?? string.Empty;
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }

    public static Map GetMap(string? category = null)
    {
        return ListAllCache()
            .Where(x => category == null || x.ErrorgroupCode == category)
            .Select(y => {
                return new MapEntity(y.ErrorgroupCode, y.ErrorgroupName, null, y.UseYn);
            }).ToMap();
    }

    public static void RefreshMap()
    {
        RemoveCache();
    }
}
