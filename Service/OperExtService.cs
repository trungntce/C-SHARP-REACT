namespace WebApp;

using System;
using System.Data;
using System.Drawing.Printing;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

public class OperExtService : MinimalApiService, IMinimalApi, Map.IMap
{
    public OperExtService(ILogger<OperExtService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }
    
    public static List<OperExtEntity> ListAll()
    {
        dynamic obj = new ExpandoObject();

		return DataContext.StringEntityList<OperExtEntity>("@OperExt.List", RefineExpando(obj));
    }
    
    public static List<OperExtEntity> List(string? operationCode, string? operationDesc, string? workingUom, char? enableFlag,
        string? remark, char? setupYn)
    {
        dynamic obj = new ExpandoObject();
        obj.OperationCode  = operationCode;
        obj.OperationDesc  = operationDesc;
        obj.WorkingUom     = workingUom;
        obj.EnableFlag     = enableFlag;

        obj.Remark         = remark;
        obj.SetupYn        = setupYn;


        return DataContext.StringEntityList<OperExtEntity>("@OperExt.List", RefineExpando(obj, true));
    }

    public static OperExtEntity? Select(string operationCode)
    {
        dynamic obj = new ExpandoObject();
        obj.OperationCode = operationCode;

        return DataContext.StringEntity<OperExtEntity>("@OperExt.Select", RefineExpando(obj, true));
    }

    public static OperExtEntity? SelectCache(string operationCode)
    {
        return ListAllCache().FirstOrDefault(x => x.OperationCode == operationCode);
    }

    [ManualMap]
    public static string OperExtName(string operationCode)
    {
        return SelectCache(operationCode)?.OperationDesc ?? operationCode;
    }

    public static int Insert([FromBody] OperExtEntity entity)
    {
        if (Select(entity.OperationCode) != null)
            return -1;

        RemoveCache();

        return DataContext.StringNonQuery("@OperExt.Insert", RefineEntity(entity));
    }

    public static int Update([FromBody] OperExtEntity entity)
    {
        RemoveCache();

        return DataContext.StringNonQuery("@OperExt.Update", RefineEntity(entity));
    }

    public static int Delete(string operationCode)
    {
        dynamic obj = new ExpandoObject();
        obj.OperationCode = operationCode;

		RemoveCache();

        return DataContext.StringNonQuery("@OperExt.Delete", RefineExpando(obj));
    }

    public static List<OperExtEntity> ListAllCache()
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
        .Where(x => string.IsNullOrWhiteSpace(category) || x.WorkingUom == category)
        .Select(y => {
            return new MapEntity(y.OperationCode, y.OperationDesc, y.WorkingUom, y.EnableFlag);
        }).ToMap();
    }

    public static void RefreshMap()
    {
        RemoveCache();
    }

    [ManualMap]
    public static DataTable UomListAll()
    {
        return DataContext.StringDataSet("@OperExt.UomList", new { }).Tables[0];
    }

    [ManualMap]
    public static DataTable UomListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey("uom"),
            DateTime.Now.AddMinutes(GetCacheMin()),
            UomListAll);

        return list;
    }

    [ManualMap]
    public static void UomRemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey("uom"));
    }

    [ManualMap]
    public static Map UomGetMap(string? category = null)
    {
        return UomListAllCache()
            .AsEnumerable()
            .Select(row => {
                return new MapEntity(row.TypeCol<string>("working_uom"), row.TypeCol<string>("working_uom"), null, 'Y');
            }).ToMap();
    }

    [ManualMap]
    public static void UomRefreshMap()
    {
        UomRemoveCache();
    }
}
