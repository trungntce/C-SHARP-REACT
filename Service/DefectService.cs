namespace WebApp;

using System;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Mvc;

public class DefectService : MinimalApiService, IMinimalApi, Map.IMap
{
    public DefectService(ILogger<DefectService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }

    public static DefectList ListAll()
    {
        return new DefectList(DataContext.StringEntityList<DefectEntity>("@Defect.List", RefineExpando(new ExpandoObject())));
    }

    public static DefectList List(string? defectgroupCode, string? defectCode, string? defectName, string? remark, char? useYn)
    {
        dynamic obj = new ExpandoObject();
        obj.DefectgroupCode = defectgroupCode;
        obj.DefectCode = defectCode;
        obj.DefectName = defectName;
        obj.Remark = remark;
        obj.UseYn = useYn;

        var rtn = new DefectList(DataContext.StringEntityList<DefectEntity>("@Defect.List", RefineExpando(obj, true)));

        return rtn;
    }

    public static DefectEntity? Select(string defectCode)
    {
        dynamic obj = new ExpandoObject();
        obj.DefectCode = defectCode;

        return DataContext.StringEntity<DefectEntity>("@Defect.Select", RefineExpando(obj, true));
    }

    public static DefectEntity? SelectCache(string defectCode)
    {
        return ListAllCache().FirstOrDefault(x => x.DefectCode == defectCode);
    }

    [ManualMap]
    public static string DefectName(string defectCode)
    {
        return SelectCache(defectCode)?.DefectName ?? defectCode;
    }

    public static int Insert([FromBody] DefectEntity entity)
    {
        if (Select(entity.DefectCode) != null)
            return -1;

        RemoveCache();

        return DataContext.StringNonQuery("@Defect.Insert", RefineEntity(entity));
    }

    public static int Update([FromBody] DefectEntity entity)
    {
        RemoveCache();

        return DataContext.StringNonQuery("@Defect.Update", RefineEntity(entity));
    }

    public static int Delete(string defectCode)
    {
        dynamic obj = new ExpandoObject();
        obj.DefectCode = defectCode;

        RemoveCache();

        return DataContext.StringNonQuery("@Defect.Delete", RefineExpando(obj));
    }

    public static DefectList ListAllCache()
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
        .Where(x => string.IsNullOrWhiteSpace(category) || x.DefectgroupCode == category)
        .OrderBy(x => x.Sort)
        .Select(y => {
            return new MapEntity(y.DefectCode, y.DefectName, y.DefectgroupCode, y.UseYn);
        }).ToMap();
    }

    [ManualMap]
    public static DataTable CodeListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey("code_id"),
            DateTime.Now.AddMinutes(GetCacheMin()),
            () => {
                return DataContext.StringDataSet("@Defect.DefectList", new { }).Tables[0];
            });

        return list;
    }

    [ManualMap]
    public static Map CodeGetMap(string? category = null)
    {
        return CodeListAllCache().AsEnumerable()
        .OrderBy(x => x.TypeCol<string>("code_id"))
        .Select(y =>
        {
            return new MapEntity(
                y.TypeCol<string>("code_id"),
                y.TypeCol<string>("code_name"),
                string.Empty,
                'Y');
        }).ToMap();
    }

    [ManualMap]
    public static void CodeRefreshMap()
    {
        UtilEx.RemoveCache(BuildCacheKey("room_list"));
    }

    public static void RefreshMap()
    {
        RemoveCache();
    }
}
