
namespace WebApp;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Threading.Tasks;
using System.Data;
using System.Transactions;
using Framework;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Mvc;
using System.Dynamic;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Math;
using static Unity.Storage.RegistrationSet;
using System.Net;
using Google.Protobuf;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Newtonsoft.Json;

public class DocManageStdService : MinimalApiService, IMinimalApi
{
    public DocManageStdService(ILogger<UserService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        //string tug = JsonConvert.SerializeObject(_iMineType);
        group.MapPost("getfile", nameof(ShowImg));
        group.MapPost("upload", nameof(Upload));
        group.MapPost("delete", nameof(deletedoc));
        group.MapPost("save", nameof(savedoc));

        return RouteAllEndpoint(group);
    }



    public static IResult List(string dept_filter)        
    {
        if (dept_filter == null) dept_filter = "";

        string sqlFilter = string.Format(DataContext.SqlCache.GetSingleSql("DocManageStd.List"), dept_filter);

        DataTable dtResult = StringDataSetWrap(sqlFilter, new Dictionary<string, object>()).Tables[0];
        return OkWrap(dtResult);
    }


    [ManualMap]
    public static IResult Upload(IOptions<Setting>? setting, ILogger<FileService> logger, IFormFileCollection files,string doc_no)
    {
        SetSetting(setting);

        foreach (var file in files)
        {
            var uploadDir = "DocManageStd/" + DateTime.Now.ToString("yyyy-MM-dd");
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
            obj.guid = guid;
            obj.doc_no = doc_no;
            // obj.ChecksheetCode = checksheetCode;
            // obj.ChecksheetItemCode = checksheetItemCode;
            obj.file_name = fileName;
            obj.file_path = uploadDir;
            //DataContext.StringNonQuery("@ChecksheetApi.InsertImg", RefineExpando(obj));

           // var obj = DictToExpandoWrap(entity);
            
            try
            {
                var db = DataContext.Create(null);
                db.IgnoreParameterSame = false;
                var success = db.ExecuteStringScalar<object>("@DocManageStd.Upsert", RefineExpando(obj, true));
                //db.ExecuteStringScalar<object>("@DocManageStd.UpHist", RefineExpando(obj, true));
                return OkWrap(success);
            }
            catch
            {
                return FailWrap();
            }
        }
        return OkWrap();
    }


    [ManualMap]
    public static IResult savedoc([FromBody] Dictionary<string, object> entity)
    {
        var obj = DictToExpandoWrap(entity);
        try
        {
            var db = DataContext.Create(null);
            db.IgnoreParameterSame = false;
            var success = db.ExecuteStringScalar<object>("@DocManageStd.Upsert", RefineExpando(obj, true));
            //db.ExecuteStringScalar<object>("@DocManageStd.UpHist", RefineExpando(obj, true));
            return OkWrap(success);
        }
        catch
        {
            return FailWrap();
        }
    }


    [ManualMap]
    public static IResult ShowImg(IOptions<Setting>? setting, ILogger<ChecksheetResultService> logger, [FromBody] Dictionary<string, object> entity)
    {
        SetSetting(setting);

        string downloadname = "";
        string imgPath = "";
        string imgName = "";
        string guid = "";
        if (entity.ContainsKey("file_name")) imgName = entity["file_name"].ToString();
        if (entity.ContainsKey("file_path")) imgPath = entity["file_path"].ToString();
        if (entity.ContainsKey("guid")) guid = entity["guid"].ToString();

        if (entity.ContainsKey("att_file")) downloadname = entity["att_file"].ToString();


        if (string.IsNullOrEmpty(imgPath))
        {
            return Results.Problem("비정상적인 파일 다운로드가 확인되었습니다. 요청 내역이 기록되었습니다.");
        }
        string fullPath = GetUploadPath(imgPath) + "/" + imgName;
        

        if (fullPath != null && !File.Exists(fullPath))
        {
            logger.LogCritical("비정상 파일 다운로드 요청: {Guid}, {UserId}", guid, UserId);
            return Results.Problem("비정상적인 파일 다운로드가 확인되었습니다. 요청 내역이 기록되었습니다.");
        }
        string minetype = "";
        string ext = Path.GetExtension(imgName);
        //if (_iMineType.ContainsKey(ext)) minetype = _iMineType[ext];
        //string tug = JsonConvert.SerializeObject(_iMineType);
        return Results.File(fullPath, "application/octet-stream", downloadname);
    }


    [ManualMap]
    public static IResult deletedoc([FromBody] Dictionary<string, object> entity)
    {
        var obj = DictToExpandoWrap(entity);
        try
        {
            var db = DataContext.Create(null);
            db.IgnoreParameterSame = false;
            var success = db.ExecuteStringScalar<object>("@DocManageStd.Delete", RefineExpando(obj, true));
            //db.ExecuteStringScalar<object>("@DocManageStd.UpHist", RefineExpando(obj, true));
            return OkWrap(success);
        }
        catch
        {
            return FailWrap();
        }
    }

}
