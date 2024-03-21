namespace WebApp;

using Framework;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Microsoft.Extensions.Options;
using MySql.Data.Common.DnsClient;
using Org.BouncyCastle.Asn1.X500;
using System.Data;
using System.Dynamic;
using System.IO;
using System.Reflection.Emit;

public class ApiChecksheetService : MinimalApiService, IMinimalApi
{
    public ApiChecksheetService(ILogger<MinimalApiService> logger, Setting _appSettings) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/items", nameof(ItemList));
        group.MapPost("/submit", nameof(Submit));
        group.MapPost("/upload", nameof(Upload));
        group.MapGet("/appnewver", nameof(GetAppNewVer));
        group.MapGet("/checksheet/histories", nameof(GetChecksheetHistory));
        group.MapGet("/checksheetitem/histories", nameof(GetChecksheetItemByDay));
        group.MapGet("/eqplist", nameof(ListEqp));
        group.MapGet("/download", nameof(Download));
        group.MapPost("/uploadapk", nameof(UploadApk));
        return RouteAllEndpoint(group);
    }
    [ManualMap]
    public static IResult Download(IOptions<Setting>? setting, ILogger<ApiChecksheetService> logger, string path, string name) {
        SetSetting(setting);
        string fullPath = GetUploadPath(path) + "/" + name;
        if (!File.Exists(fullPath))
        {
            return Results.Problem("비정상적인 파일 다운로드가 확인되었습니다. 요청 내역이 기록되었습니다.");
        }
        return Results.File(fullPath, $"application/octet-stream");
    }
    [ManualMap]
    public static IResult ListEqp(string? workcenterCode, string? eqpCode)
    {
        dynamic obj = new ExpandoObject();
        obj.EqpCode = eqpCode;
        obj.WorkcenterCode = workcenterCode;
        DataTable dt = DataContext.DataSet("dbo.sp_checksheet_eqp_list", RefineExpando(obj, false)).Tables[0];
        return Results.Json(ToDic(dt));

    }
    [ManualMap]
    public static IResult GetChecksheetItemByDay(DateTime checkDate, string eqpCode, string workcenterCode, string workType, string dailyCheckType, string groupType)
    {
        DataTable dt = GetListChecksheetItemByDay(checkDate, eqpCode, workcenterCode, workType, dailyCheckType, groupType);
        return Results.Json(ToDic(dt));
    }
    [ManualMap]
    public static DataTable GetListChecksheetItemByDay(DateTime checkDate, string eqpCode, string workcenterCode, string workType, string dailyCheckType, string groupType)
    {
        dynamic obj = new ExpandoObject();
        obj.CheckDate = checkDate;
        obj.EqpCode = eqpCode;
        obj.WorkcenterCode = workcenterCode;
        obj.DailyCheckType = dailyCheckType;
        obj.WorkType = workType;
        obj.GroupType = groupType;
        DataTable dt = DataContext.DataSet("dbo.sp_checksheet_report_item_result_list", RefineExpando(obj, false)).Tables[0];
        return dt;
    }
    [ManualMap]
    public static IResult GetChecksheetHistory(DateTime fromDt, DateTime toDt, string eqpCode, string workcenterCode, string groupType, string dailyCheckType)
    {
        dynamic obj = new ExpandoObject();
        obj.FromDt = fromDt;
        obj.ToDt = toDt;
        obj.EqpCode = string.IsNullOrEmpty(eqpCode) ? "" : eqpCode;
        obj.WorkcenterCode = string.IsNullOrEmpty(workcenterCode) ? "" : workcenterCode;
        obj.GroupType = groupType;
        obj.DailyCheckType = dailyCheckType;
        DataTable dt = GetListChecksheetHistory(fromDt, toDt, eqpCode, workcenterCode, groupType, dailyCheckType);
        return Results.Json(ToDic(dt));
    }
    [ManualMap]
    public static DataTable GetListChecksheetHistory(DateTime fromDt, DateTime toDt, string eqpCode, string workcenterCode, string groupType, string dailyCheckType)
    {
        dynamic obj = new ExpandoObject();
        obj.FromDt = fromDt;
        obj.ToDt = toDt;
        obj.EqpCode = string.IsNullOrEmpty(eqpCode) ? "" : eqpCode;
        obj.WorkcenterCode = string.IsNullOrEmpty(workcenterCode) ? "" : workcenterCode;
        obj.GroupType = groupType;
        obj.DailyCheckType = dailyCheckType;
        DataTable dt = DataContext.DataSet("dbo.sp_checksheet_report_list", RefineParam(obj, false)).Tables[0];
        return dt;
    }
    [ManualMap]
    public static IResult GetAppNewVer(string curVer) {
        dynamic obj = new ExpandoObject();
        obj.AppVer = curVer;
        DataTable dt = DataContext.StringDataSet("@ChecksheetApi.GetAppNewVersion", RefineExpando(obj, false)).Tables[0];
        return Results.Json(ToDic(dt));
    }
    [ManualMap]
    public static IResult ItemList(string eqpCode, string groupType, string workcenterCode, string dayType)
    {

        dynamic obj = new ExpandoObject();
        obj.EqpCode = eqpCode;
        obj.GroupType = groupType;
        obj.WorkcenterCode = workcenterCode;
        obj.DayType = dayType;

        DataTable dt = DataContext.DataSet("dbo.sp_checksheet_item_list", RefineExpando(obj, false)).Tables[0];
        return Results.Json(ToDic(dt));
    }

    [ManualMap]
    public static int CountSelect(string ChecksheetCode, string ChecksheetItemCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ChecksheetCode = ChecksheetCode;
        obj.ChecksheetItemCode = ChecksheetItemCode;

        return DataContext.StringValue<int>("@ChecksheetApi.CountSelect", RefineExpando(obj, true));
    }

    [ManualMap]
    public static int Submit([FromBody] CheckSheetResultEntity[] entities)
    {
        DateTime checkDate = DateTime.Now;
        char dayType = 'N';
        
        if (Int32.Parse(checkDate.ToString("HHmm")) >= 800 && Int32.Parse(checkDate.ToString("HHmm")) < 2000)
        {
            dayType = 'D';
        }
        foreach (var entity in entities)
        {
            entity.CheckDate = checkDate;
            entity.DayType = dayType;

            DataContext.StringNonQuery("@ChecksheetApi.Submit", RefineEntity(entity));
        }
        return 1;
    }

    [ManualMap]
    public static IResult Upload(IOptions<Setting>? setting, ILogger<FileService> logger, IFormFileCollection files, string checksheetCode, string checksheetItemCode)
    {
        SetSetting(setting);

        foreach (var file in files)
        {
            var uploadDir = "Checksheet/" + DateTime.Now.ToString("yyyy-MM-dd");
            var uploadPath = GetUploadPath(uploadDir) + "/";
            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }
            string guid = Guid.NewGuid().ToString();
            var fileName = guid + Path.GetExtension(file.FileName);
            string ext = Path.GetExtension(file.FileName);

            if (!string.IsNullOrWhiteSpace(ext) && BlockExtList.Contains(ext.ToLower()))
            {
                logger.LogCritical("업로드 금지 파일 업로드: {fielName}, {UserId}", fileName, UserId);
                return Results.Problem($"금지된 확장자가 업로드 되었습니다. [{ext}] 요청 내역이 기록되었습니다.");
            }
            
            var filePath = Path.Combine(uploadPath, fileName);
            using (var stream = File.Create(filePath))
            {
                file.CopyTo(stream);
            }

            dynamic obj = new ExpandoObject();
            obj.Guid = guid;
            obj.ChecksheetCode = checksheetCode;
            obj.ChecksheetItemCode = checksheetItemCode;
            obj.ImgName = fileName;
            obj.ImgPath = uploadDir;
            DataContext.StringNonQuery("@ChecksheetApi.InsertImg", RefineExpando(obj));
        }

        return Results.Json(1);
    }
    [ManualMap]
    public static IResult UploadApk(IOptions<Setting>? setting, ILogger<FileService> logger, IFormFileCollection files)
    {
        SetSetting(setting);
        var file = files[0];
        var uploadDir = "Android/" + DateTime.Now.ToString("yyyy-MM-dd") + "/";
        var uploadPath = GetUploadPath(uploadDir);
        if (!Directory.Exists(uploadPath))
        {
            Directory.CreateDirectory(uploadPath);
        }
        string guid = Guid.NewGuid().ToString();
        var fileName = guid + Path.GetExtension(file.FileName);
        string ext = Path.GetExtension(file.FileName);

        if (!string.IsNullOrWhiteSpace(ext) && BlockExtList.Contains(ext.ToLower()))
        {
            logger.LogCritical("업로드 금지 파일 업로드: {fielName}, {UserId}", fileName, UserId);
            return Results.Problem($"금지된 확장자가 업로드 되었습니다. [{ext}] 요청 내역이 기록되었습니다.");
        }

        var filePath = Path.Combine(uploadPath, fileName);
        using (var stream = File.Create(filePath))
        {
            file.CopyTo(stream);
        }

        dynamic obj = new ExpandoObject();
        obj.AppPath = "Android/" + DateTime.Now.ToString("yyyy-MM-dd");
        obj.AppNm = fileName;
        DataContext.DataSet("dbo.sp_checksheet_insert_app_ver", RefineExpando(obj));
        string fullPath = "Android/" + DateTime.Now.ToString("yyyy-MM-dd") + "/" + fileName;

        return Results.Json(fullPath);
    }
}
