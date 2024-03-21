namespace WebApp;

using Framework;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using OracleInternal.Sharding;
using System.Data;
using System.Dynamic;
using System.IO;
using System.Xml.Linq;

public class ChecksheetResultService : MinimalApiService, IMinimalApi
{

    public ChecksheetResultService(ILogger<MinimalApiService> logger) : base(logger)
    {
    }


    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/listresult", nameof(ListResult));
        group.MapGet("/listitemimg", nameof(ListItemImg));
        group.MapGet("/showimg", nameof(ShowImg));
        group.MapGet("/listreport", nameof(ListReport));
        group.MapGet("/listreportbyday", nameof(ListReportByDay));
        return RouteAllEndpoint(group);
    }
    [ManualMap]
    public static IResult ListReportByDay(DateTime checkDate, string eqpCode, string workcenterCode, string workType, string groupType, string dailyCheckType)
    {

        //  return ApiChecksheetService.GetChecksheetItemByDay(checkDate, eqpCode, workcenterCode, workType, dailyCheckType, groupType);
        DataTable dt = ApiChecksheetService.GetListChecksheetItemByDay(checkDate, eqpCode, workcenterCode, workType, dailyCheckType, groupType);
        return Results.Json(ToDic(dt));

    }
    [ManualMap]
    public static IResult ListReport(DateTime fromDt, DateTime toDt, string groupType, string dailyCheckType, string? eqpCodes, string? workcenterCode)
    {
        dynamic obj = new ExpandoObject();
        obj.FromDt = fromDt;
        obj.ToDt = toDt;
        obj.EqpCode = eqpCodes;
        obj.WorkcenterCode = workcenterCode;
        obj.GroupType = groupType;
        obj.DailyCheckType = dailyCheckType;
        DataTable dtEqps = DataContext.StringDataSet("@ChecksheetApi.ListByEqpItem", RefineExpando(obj, true)).Tables[0];


        DataTable dtItems = ApiChecksheetService.GetListChecksheetHistory(
            fromDt
            , toDt
            , string.IsNullOrEmpty(eqpCodes) ? "" : eqpCodes
            , string.IsNullOrEmpty(workcenterCode) ? "" : workcenterCode
            , groupType, dailyCheckType);

        List<DataTable> list = new List<DataTable>();
        list.Add(dtEqps);
        list.Add(dtItems);

        return Results.Json(list);
    }

    [ManualMap]
    public static IResult ShowImg(IOptions<Setting>? setting, ILogger<ChecksheetResultService> logger, string guid)
    {
        SetSetting(setting);
        dynamic obj = new ExpandoObject();
        obj.Guid = guid;
        DataTable dt = DataContext.StringDataSet("@ChecksheetApi.GetImgPath", RefineExpando(obj, false)).Tables[0];
        string imgPath = "";
        string imgName = "";
        if (dt.Rows.Count > 0) {
            imgPath = dt.Rows[0].TypeCol<string>("img_path");
            imgName = dt.Rows[0].TypeCol<string>("img_name");
        }
        if (string.IsNullOrEmpty(imgPath)) {
            return Results.Problem("비정상적인 파일 다운로드가 확인되었습니다. 요청 내역이 기록되었습니다.");
        }
        string fullPath = GetUploadPath(imgPath) + "/" + imgName;

        if (fullPath != null && !File.Exists(fullPath)) {
            logger.LogCritical("비정상 파일 다운로드 요청: {Guid}, {UserId}", guid, UserId);
            return Results.Problem("비정상적인 파일 다운로드가 확인되었습니다. 요청 내역이 기록되었습니다.");
        }

        return Results.File(fullPath, $"application/octet-stream");
    }

    [ManualMap]
    public static IResult ListItemImg(string checksheetCode, string itemCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ChecksheetCode = checksheetCode;
        obj.ItemCode = itemCode;

        DataTable dt = DataContext.StringDataSet("@ChecksheetApi.ListItemImg", RefineExpando(obj, true)).Tables[0];

        return Results.Json(ToDic(dt));
    }

    [ManualMap]
    public static IResult ListResult(DateTime fromDt, DateTime toDt, string? eqpCode, string? checkStatus, string? checksheetGroupCode, string? checksheetCode, string? groupType)
    {
        dynamic obj = new ExpandoObject();
        obj.EqpCode = eqpCode;
        obj.CheckStatus = checkStatus;
        obj.ChecksheetGroupCode = checksheetGroupCode;
        obj.ChecksheetCode = checksheetCode;
        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);
        obj.GroupType = groupType;

        DataTable dt = DataContext.StringDataSet("@ChecksheetApi.ListResult", RefineExpando(obj, true)).Tables[0];

        return Results.Json(ToDic(dt));
    }



}
