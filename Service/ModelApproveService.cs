namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Dynamic;

using Framework;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Org.BouncyCastle.Asn1.Ocsp;
using Unity.Interception.Utilities;

public class ModelApproveService : MinimalApiService, IMinimalApi
{
	public ModelApproveService(ILogger<ModelApproveService> logger) : base(logger)
	{
	}

	public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
	{
        group.MapPost("/registration", nameof(Registration));
        group.MapPut("/approveupdate", nameof(ApproveUpdate));
        group.MapGet("/detaillist", nameof(DetailList));
        group.MapGet("/groupcheck", nameof(GroupCheck));
        group.MapGet("/statuscheck", nameof(StatusCheck));
        group.MapGet("/getfile", nameof(GetFile));
        group.MapGet("/approvecheck", nameof(ApproveCheck));

        return RouteAllEndpoint(group);
	}

    public static IResult List(DateTime fromDt, DateTime toDt, string? modelCode, string? modelName, char? approveYn, bool isExcel = false)
	{
		dynamic obj = new ExpandoObject();

        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);
        obj.ModelCode = modelCode;
        obj.ModelName = modelName;
        obj.ApproveYn = approveYn;

        DataTable dt = new DataTable();

        if (approveYn == 'P')
        {
            dt = DataContext.StringDataSet("@ModelApprove.PendingList", RefineExpando(obj)).Tables[0];
        }
        else if (approveYn == 'O')
        {
            dt = DataContext.StringDataSet("@ModelApprove.ApproveExList", RefineExpando(obj)).Tables[0];
        }
        else
        {
            dt = DataContext.StringDataSet("@ModelApprove.List", RefineExpando(obj)).Tables[0];
        }

        if (!isExcel)
            return Results.Json(ToDic(dt));

        return ExcelDown(dt, "MODEL_APPROVE_DATA");
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }

    [ManualMap]
    public static int CountSelect(string modelCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ModelCode = modelCode;

        return DataContext.StringValue<int>("@ModelApprove.Count", RefineExpando(obj, true));
    }

    [ManualMap]
    public static IResult DetailList(string? operCode, string? modelCode, string? revCode, string? requestId, char? approveYn, bool isExcel = false)
    {
        dynamic obj = new ExpandoObject();
        obj.ModelCode = modelCode;
        obj.revCode = revCode;
        obj.ApproveYn = approveYn;
        obj.RequestId = requestId;
        obj.OperCode = operCode;

        DataTable dt = new DataTable();
        var operData = DataContext.StringValue<int>("@ModelApprove.ModelOperCheck", RefineExpando(obj, true));
        if (operData > 0)
        {
            dt = DataContext.StringDataSet("@ModelApprove.DetailExList", RefineExpando(obj)).Tables[0];
        }
        else
        {
            dt = DataContext.StringDataSet("@ModelApprove.DetailList", RefineExpando(obj)).Tables[0];
        }

        if (!isExcel)
            return Results.Json(ToDic(dt));

        return ExcelDetailDown(dt, "MODEL_APPROVE_DATA");
    }

    [ManualMap]
    public static int Registration(IOptions<Setting>? setting, ILogger<FileService> logger, IFormFileCollection? files, string modelCode, string modelName, char type, string? revNote)
    {
        if (ModelRecipeParamMapNewService.Check(modelCode) <= 0)
        {
            return -1;
        }

        SetSetting(setting);

        string filePath = null;
        if (!files.IsNullOrEmpty()) {
            var file = files[0];
            var uploadDir = "ModelRecipeApprove/" + DateTime.Now.ToString("yyyy-MM-dd");
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
                return -1;
            }

            filePath = Path.Combine(uploadPath, fileName);
            using (var stream = File.Create(filePath))
            {
                file.CopyTo(stream);
            }
            filePath = Path.Combine((uploadDir + "/"), fileName);
        }

        dynamic obj = new ExpandoObject();
        obj.ModelCode = modelCode;
        obj.ModelName = modelName;
        obj.Type = type;
        obj.RevNote = string.IsNullOrEmpty(revNote) ? "" : revNote;
        obj.Filelocation = string.IsNullOrEmpty(filePath) ? "" : filePath;
        obj.RequestId = NewShortId();
        obj.CorpId = UserCorpId;
        obj.FacId = UserFacId;

        RemoveCache();

        return DataContext.StringNonQuery("@ModelApprove.Insert", RefineExpando(obj));
    }
    [ManualMap]
    public static IResult GetFile(IOptions<Setting>? setting, ILogger<ChecksheetResultService> logger, string filelocation)
    {
        SetSetting(setting);

        string filePath = GetUploadPath(filelocation);

        if (string.IsNullOrEmpty(filelocation) || filePath != null && !File.Exists(filePath))
        {
            logger.LogCritical("비정상 파일 다운로드 요청: {filelocation}, {UserId}", filelocation, UserId);
            return Results.Problem("비정상적인 파일 다운로드가 확인되었습니다. 요청 내역이 기록되었습니다.");
        }

        return Results.File(filePath, "application/force-download");
    }

    [ManualMap]
    public static int CountCheck(string modelCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ModelCode = modelCode;

        return DataContext.StringValue<int>("@ModelApprove.CountEx", RefineExpando(obj, true));
    }

    [ManualMap]
    public static int ApproveCheck(string modelCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ModelCode = modelCode;

        return DataContext.StringValue<int>("@ModelApprove.ApproveCheck", RefineExpando(obj, true));
    }

    [ManualMap]
    public static int StatusCheck(string modelCode, string requestId)
    {
        dynamic obj = new ExpandoObject();
        obj.ModelCode = modelCode;
        obj.RequestId = requestId;

        return DataContext.StringValue<int>("@ModelApprove.StatusCheck", RefineExpando(obj, true));
    }

    [ManualMap]
    public static int GroupCheck(string updateType)
    {
        dynamic obj = new ExpandoObject();
        obj.Type = updateType;

        return DataContext.StringValue<int>("@ModelApprove.GroupCheck", RefineExpando(obj, true));
    }

    [ManualMap]
    public static int ApproveUpdate([FromBody] ModelApproveEntity entity)
    {
        RemoveCache();

        if (GroupCheck(entity.UpdateType) <= 0)
        {
            return -1;
        }

        if (StatusCheck(entity.ModelCode, entity.RequestId) <= 0)
        {
            return -1;
        }

        if (entity.UpdateType == "reject")
        {
            return DataContext.StringNonQuery("@ModelApprove.RejectUpdate", RefineEntity(entity));
        }
        else if (entity.UpdateType == "comment")
        {
            return DataContext.StringNonQuery("@ModelApprove.Update", RefineEntity(entity));
        }
        else if (entity.UpdateType == "approve")
        {
            if (CountCheck(entity.ModelCode) <= 0)
            {
                return -1;
            }
            else
            {
                int ver = CountSelect(entity.ModelCode);
                ver++;
                if (ver < 9) 
                {
                    entity.RevCode = "RE0" + ver + "-" + entity.ModelCode;
                }
                else
                {
                    entity.RevCode = "RE" + ver + "-" + entity.ModelCode;
                }

                return DataContext.StringNonQuery("@ModelApprove.ApproveUpdate", RefineEntity(entity));
            }
        }

        return -1;
    }

    [ManualMap]
    public static IResult ExcelDown(DataTable dt, string fileName)
    {
        List<Tuple<string, string, double, Type, Func<DataRow, object>?>> mapList = new()
        {
            new("approve_dt", "승인일", 35, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("approve_dt")?.ToString("yyyy-MM-dd hh:mm:ss") ?? string.Empty; }),
            new("create_dt", "요청일", 35, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("create_dt")?.ToString("yyyy-MM-dd hh:mm:ss") ?? string.Empty; }),
            new("rev_code", "REV", 20, typeof(string), null),
            new("model_code", "모델코드", 40, typeof(string), null),
            new("model_name", "모델명", 20, typeof(string), null),
            new("type", "구분", 20, typeof(string), null),
            new("rev_note", "등록사유", 20, typeof(string), null),
            new("approve_yn", "승인여부", 20, typeof(string), null),
            //new("filelocation", "첨부파일", 45, typeof(string), null),
            new("create_user", "요청자", 20, typeof(string), null),
            new("val1", "합의1", 20, typeof(string), null),
            new("val2", "합의2", 20, typeof(string), null),
            new("val3", "합의3", 40, typeof(string), null),
            new("note", "승인자", 45, typeof(string), null),
            new("reason_note", "Note", 20, typeof(string), null)
        };

        using var excel = ExcelEx.ToExcel(dt, mapList);

        return Results.File(excel.GetAsByteArray(), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }

    [ManualMap]
    public static IResult ExcelDetailDown(DataTable dt, string fileName)
    {
        List<Tuple<string, string, double, Type, Func<DataRow, object>?>> mapList = new()
        {
            new("recipe_change_yn", "변경항목", 40, typeof(string), null),
            new("rev_code", "REV", 20, typeof(string), null),
            new("model_code", "모델코드", 40, typeof(string), null),
            new("p_number", "P-NUMBER", 20, typeof(string), null),
            new("p_code", "P-CODE", 20, typeof(string), null),
            new("e_code", "E-CODE", 45, typeof(string), null),
            new("recipeCode", "Recipe Code", 20, typeof(string), null),
            new("recipeName", "Recipe Name", 20, typeof(string), null),
            new("pType", "Type", 20, typeof(string), null),
            new("svPvCode", "SV/PV CODE", 20, typeof(string), null),
            new("svPvName", "SV/PV NAME", 20, typeof(string), null),
            new("sv_std", "SV 기준값", 40, typeof(string), null),
            new("pv_std", "PV 표준값", 20, typeof(string), null),
            new("pv_lcl", "PV LCL", 45, typeof(string), null),
            new("pv_ucl", "PV UCL", 20, typeof(string), null),
            new("pv_lsl", "PV LSL", 20, typeof(string), null),
            new("pv_usl", "PV USL", 20, typeof(string), null)
        };

        using var excel = ExcelEx.ToExcel(dt, mapList);

        return Results.File(excel.GetAsByteArray(), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }
}