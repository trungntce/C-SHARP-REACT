namespace WebApp;

using System;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Mvc;

public class DefectgroupService : MinimalApiService, IMinimalApi, Map.IMap
{
    public DefectgroupService(ILogger<DefectgroupService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }

    public static DefectgroupList ListAll()
    {
        return new DefectgroupList(DataContext.StringEntityList<DefectgroupEntity>("@Defectgroup.List", RefineExpando(new ExpandoObject())));
    }

    public static DefectgroupList List(string? defectgroupCode, string? defectgroupName, string? remark, char? useYn)
    {
        dynamic obj = new ExpandoObject();
        obj.DefectgroupCode = defectgroupCode;
        obj.DefectgroupName = defectgroupName;
        obj.Remark = remark;
        obj.UseYn = useYn;

        return new DefectgroupList(DataContext.StringEntityList<DefectgroupEntity>("@Defectgroup.List", RefineExpando(obj, true)));
    }

    public static DefectgroupEntity? Select(string defectgroupCode)
    {
        dynamic obj = new ExpandoObject();
        obj.DefectgroupCode = defectgroupCode;

        return DataContext.StringEntity<DefectgroupEntity>("@Defectgroup.Select", RefineExpando(obj, true));
    }

    public static int Insert([FromBody] DefectgroupEntity entity)
    {
        if (Select(entity.DefectgroupCode) != null)
            return -1;

        RemoveCache();

        return DataContext.StringNonQuery("@Defectgroup.Insert", RefineEntity(entity));
    }
    public static int Update([FromBody] DefectgroupEntity entity)
    {
        RemoveCache();

        return DataContext.StringNonQuery("@Defectgroup.Update", RefineEntity(entity));
    }
    public static int Delete(string defectgroupCode)
    {
        dynamic obj = new ExpandoObject();
        obj.DefectgroupCode = defectgroupCode;

        RemoveCache();

        return DataContext.StringNonQuery("@Defectgroup.Delete", RefineExpando(obj));
    }

    public static DefectgroupList ListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(),
            DateTime.Now.AddMinutes(GetCacheMin()),
            ListAll);

        return list;
    }

    public static DefectgroupEntity? SelectCache(string defectgroupCode)
    {
        return ListAllCache().FirstOrDefault(x => x.DefectgroupCode == defectgroupCode);
    }

    [ManualMap]
    public static string SelectCacheName(string defectgroupCode)
    {
        return ListAllCache().FirstOrDefault(x => x.DefectgroupCode == defectgroupCode)?.DefectgroupName ?? string.Empty;
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }

    public static Map GetMap(string? category = null)
    {
        return ListAllCache()
            .Where(x => category == null || x.DefectgroupCode == category)
            .Select(y => {
                return new MapEntity(y.DefectgroupCode, y.DefectgroupName, null, y.UseYn);
            }).ToMap();
    }

    public static void RefreshMap()
    {
        RemoveCache();
    }
}
