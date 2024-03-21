namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Data.SqlClient;
using System.Drawing.Drawing2D;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

public class Panel4MService : MinimalApiService, IMinimalApi, Map.IMap
{
    public Panel4MService(ILogger<Panel4MService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }

    public static IEnumerable<IDictionary> List(string? eqpCode, string? totalStatus)
    {
        dynamic obj = new ExpandoObject();
        obj.EqpCode = eqpCode;
        obj.TotalStatus = totalStatus;

        DataTable dt = DataContext.DataSet("dbo.sp_panel_4m_eqp_run_list", RefineExpando(obj, true)).Tables[0];

        FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> DiffList(DateTime fromDt, DateTime toDt, string orderby, string? eqpCode, string? workorder, string? modelCode, string? modelName)
    {
        dynamic obj = new ExpandoObject();
        obj.FromDt = fromDt;
        obj.ToDt = toDt.AddDays(1);
        obj.EqpCode = eqpCode;
        obj.Workorder = workorder;
        obj.ModelCode = modelCode;
        obj.ModelName = modelName;
        obj.Orderby = orderby;

        return ToDic(DataContext.StringDataSet("@Panel4MEqp.DiffList", RefineExpando(obj, true)).Tables[0]);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> WorkcenterList(char? target4MYn)
    {
        dynamic obj = new ExpandoObject();
        obj.Target4MYn = target4MYn;

        return ToDic(DataContext.StringDataSet("@Panel4MEqp.WorkcenterList", RefineExpando(obj, true)).Tables[0]);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> WorkcenterListCache(char? target4MYn)
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(),
            DateTime.Now.AddMinutes(GetCacheMin()),
            WorkcenterList,
            target4MYn);

        return list;
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }

    public static Map GetMap(string? category = null)
    {
        return WorkcenterListCache('Y')
            .Select(y => {
                return new MapEntity(y.TypeKey<string>("workcenterId"), y.TypeKey<string>("workcenterName"), string.Empty, 'Y');
            }).ToMap();
    }

    public static void RefreshMap()
    {
        RemoveCache();
    }
}
