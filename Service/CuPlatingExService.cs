namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Mvc;

public class CuPlatingExService : MinimalApiService, IMinimalApi
{
    public CuPlatingExService(ILogger<CuPlatingExService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/panel", nameof(PanelList));
        group.MapGet("/chart", nameof(ListForChart));
        group.MapGet("/groupchart", nameof(GroupListForChart));

        return RouteAllEndpoint(group);
    }

    public static IResult List(DateTime fromDt, DateTime toDt, string? eqpCode, string? itemCode, string? itemName, string? modelCode, string? workorder)
    {
        dynamic obj = new ExpandoObject();
        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);
        obj.EqpCode = eqpCode;
        obj.ItemCode = itemCode;
        obj.ItemName = itemName;
        obj.ModelCode = modelCode;
        obj.Workorder = workorder;

        DataTable dt = DataContext.StringDataSet("@CuPlatingEx.List", RefineExpando(obj, true)).Tables[0];

        FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

        return Results.Json(ToDic(dt));
    }

    [ManualMap]
    public static IResult PanelList(string groupKey, bool isExcel = false)
    {
        DataTable dt = DataContext.StringDataSet("@CuPlatingEx.PanelList", new { groupKey }).Tables[0];

        if (!isExcel)
            return Results.Json(ToDic(dt));

        return ExcelDown(dt, "cuplating");
    }

    [ManualMap]
    public static IResult ExcelDown(DataTable dt, string fileName)
    {
        Dictionary<string, string> colDic = new()
        {
            { "panel_seq", "판넬No" },
            { "panel_id", "PNL 바코드"},
            { "judge", "판정" },
            { "d001_std", "STD" },
            { "d001_lcl", "LCL" },
            { "d001_ucl", "UCL" },
            { "d001_min", "Data1" },
            { "d002_min", "Data2" },
            { "d003_min", "Data3" },
            { "d004_min", "Data4" },
            { "d005_min", "Data5" },
            { "d006_min", "Data6" },
            { "raw_dt", "측정일시" },
            { "panel_create_dt", "스캔시간" }
        };

        return Results.File(ExcelEx.ToExcelSimple(dt, colDic), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }

    [ManualMap]
    public static IEnumerable<IDictionary> ListForChart(string groupKey, int panelSeq)
    {
        DataTable dt = DataContext.StringDataSet("@CuPlatingEx.ListForChart", new { groupKey, panelSeq }).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> GroupListForChart(string groupKey)
    {
        DataTable dt = DataContext.StringDataSet("@CuPlatingEx.GroupListForChart", new { groupKey }).Tables[0];

        return ToDic(dt);
    }
}
