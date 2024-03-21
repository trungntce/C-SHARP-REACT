namespace WebApp;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Drawing.Printing;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.WebSockets;
using System.Text;
using Framework;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OfficeOpenXml;

public class PanelReportService : MinimalApiService, IMinimalApi
{
    public PanelReportService(ILogger<PanelReportService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/error", nameof(ErrorList));

        return RouteAllEndpoint(group);
    }
    
    public static IResult List(DateTime fromDt, DateTime toDt, string? eqpCode, string? ipAddr, bool isExcel = false)
    {
        dynamic obj = new ExpandoObject();

        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);
        obj.EqpCode = eqpCode;
        obj.IpAddr = ipAddr;

        var dt = DataContext.StringDataSet("@Barcode.List", RefineExpando(obj, true)).Tables[0];

        FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

        if (!isExcel)
            return Results.Json(ToDic(dt));

        return ExcelDown(dt, "Barcode");
    }

    [ManualMap]
    public static IResult ErrorList(DateTime fromDt, DateTime toDt, string? eqpCode, string? ipAddr)
    {
        dynamic obj = new ExpandoObject();

        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);

        var dt = DataContext.StringDataSet("@PanelReport.ErrorList", RefineExpando(obj, true)).Tables[0];

        FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

        return Results.Json(ToDic(dt));

        /*return ErrorExcelDown(dt, "BarcodeError");*/
    }

    [ManualMap]
    public static IResult ExcelDown(DataTable dt, string fileName)
    {
        Dictionary<string, string> colDic = new()
        {
            { "panel_id", "BARCODE" },
            { "ip_addr", "IP" },
            { "eqp_code", "장비코드" },
            { "eqp_name", "장비명" },
            { "worker_code", "작업자코드" },
            { "material_code", "자재코드" },
            { "tool_code", "툴코드" },
            { "scan_dt", "스캔일시" },
        };

        return Results.File(ExcelEx.ToExcelSimple(dt, colDic), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }

    [ManualMap]
    public static IResult ErrorExcelDown(DataTable dt, string fileName)
    {
        Dictionary<string, string> colDic = new()
        {
            { "error_type", "오류" },
            { "ip_addr", "IP" },
            { "eqp_code", "장비코드" },
            { "eqp_name", "장비명" },
            { "scan_dt", "스캔일시" },
        };

        return Results.File(ExcelEx.ToExcelSimple(dt, colDic), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }
}
