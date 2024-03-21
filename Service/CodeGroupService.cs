namespace WebApp;

using System;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Mvc;

public class CodegroupService : MinimalApiService, IMinimalApi, Map.IMap
{
    public CodegroupService(ILogger<CodegroupService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }

    public static CodegroupList ListAll()
    {
        return new CodegroupList(DataContext.StringEntityList<CodegroupEntity>("@Codegroup.List", RefineExpando(new ExpandoObject())));
    }

    public static CodegroupList List(string? codegroupId, string? codegroupName, string? remark, char? useYn)
    {
        dynamic obj = new ExpandoObject();
        obj.CodegroupId = codegroupId;
        obj.CodegroupName = codegroupName;
        obj.Remark = remark;
        obj.UseYn = useYn;

        return new CodegroupList(DataContext.StringEntityList<CodegroupEntity>("@Codegroup.List", RefineExpando(obj, true)));
    }

    public static CodegroupEntity? Select(string codegroupId)
    {
        dynamic obj = new ExpandoObject();
        obj.CodegroupId = codegroupId;

        return DataContext.StringEntity<CodegroupEntity>("@Codegroup.Select", RefineExpando(obj, true));
    }

    public static int Insert([FromBody] CodegroupEntity entity)
    {
        if (Select(entity.CodegroupId) != null)
            return -1;

        RemoveCache();

        return DataContext.StringNonQuery("@Codegroup.Insert", RefineEntity(entity));
    }

    public static int Update([FromBody] CodegroupEntity entity)
    {
        RemoveCache();

        return DataContext.StringNonQuery("@Codegroup.Update", RefineEntity(entity));
    }

    public static int Delete(string codegroupId)
    {
        dynamic obj = new ExpandoObject();
        obj.CodegroupId = codegroupId;

        RemoveCache();

        return DataContext.StringNonQuery("@Codegroup.Delete", RefineExpando(obj));
    }

    public static CodegroupList ListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(),
            DateTime.Now.AddMinutes(GetCacheMin()),
            ListAll);

        return list;
    }

    public static CodegroupEntity? SelectCache(string codegroupId)
    {
        return ListAllCache().FirstOrDefault(x => x.CodegroupId == codegroupId);
    }

    [ManualMap]
    public static string SelectCacheName(string codegroupId)
    {
        return ListAllCache().FirstOrDefault(x => x.CodegroupId == codegroupId)?.CodegroupName ?? string.Empty;
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }

    public static Map GetMap(string? category = null)
    {
        return ListAllCache()
            .Where(x => category == null || x.CodegroupId == category)
            .Select(y => {
                return new MapEntity(y.CodegroupId, y.CodegroupName, null, y.UseYn);
            }).ToMap();
    }

    public static void RefreshMap()
    {
        RemoveCache();
    }
}
