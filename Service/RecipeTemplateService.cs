namespace WebApp;

using System;
using System.Collections;
using System.Collections.ObjectModel;
using System.Data;
using System.Data.SqlClient;
using System.Dynamic;
using System.Text.Json;
using Framework;
using IdentityModel.OidcClient;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using OfficeOpenXml;
using Org.BouncyCastle.Asn1.Ocsp;
using Unity.Interception.Utilities;

public class RecipeTemplateService : MinimalApiService, IMinimalApi
{
	public RecipeTemplateService(ILogger<RecipeTemplateService> logger) : base(logger)
	{
	}

	public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
	{
        group.MapPost("/uploadexcel", nameof(UploadExcel));
        group.MapGet("/downloadimporttemplate", nameof(ExcelTemplateDown));
        group.MapGet("/modellist", nameof(ModelList));
        group.MapPost("/uploadmodelexcel", nameof(UploadModelExcel));
        group.MapPost("/eqpimport", nameof(EqpImport));
        group.MapPost("/modelimport", nameof(ModelImport));

        return RouteAllEndpoint(group);
	}

    public static List<IEnumerable<IDictionary>> List(string? rawType, string? eqpCode)
	{
        List<IEnumerable<IDictionary>> result = new List<IEnumerable<IDictionary>>();

        var dt = EqpRecipeParamCheckService.List(rawType, eqpCode);

        var listPv = dt.Where(x => ConvertEx.ConvertTo(x["pvsv"], "") == "P");

        var listSv = dt.Where(x => ConvertEx.ConvertTo(x["pvsv"], "") == "S");

        result.Add(listPv);
        result.Add(listSv);

        return result;
    }

    [ManualMap]
    public static List<IEnumerable<IDictionary>> UploadExcel(IOptions<Setting>? setting, ILogger<FileService> logger, IFormFileCollection files)
    {
        DataTable dt = new DataTable();

        SetSetting(setting);
        var uploadDir = "Recipe/Template/" + DateTime.Now.ToString("yyyy-MM-dd") + "/";
        var uploadPath = GetUploadPath(uploadDir);
        if (!Directory.Exists(uploadPath))
        {
            Directory.CreateDirectory(uploadPath);
        }
        var file = files[0];
        string guid = Guid.NewGuid().ToString();
        var fileName = guid + Path.GetExtension(file.FileName);
        string ext = Path.GetExtension(file.FileName);
        if (!string.IsNullOrWhiteSpace(ext) && BlockExtList.Contains(ext.ToLower()))
        {
            logger.LogCritical("업로드 금지 파일 업로드: {fielName}, {UserId}", fileName, UserId);
        }
        else
        {
            dynamic obj = new ExpandoObject();
            obj.DataKey = NewShortId();
            obj.Filename = fileName;
            obj.Filelocation = uploadDir;
            obj.DataType = 'E';

            var info = DataContext.StringNonQuery("@RecipeTemplate.FileInsert", RefineExpando(obj));


            var filePath = Path.Combine(uploadPath, fileName);
            using (var stream = File.Create(filePath))
            {
                file.CopyTo(stream);
            }

            dt.Columns.Add("eqp_code", typeof(string));
            dt.Columns.Add("group_code", typeof(string));
            dt.Columns.Add("group_name", typeof(string));
            dt.Columns.Add("raw_type", typeof(string));
            dt.Columns.Add("pvsv", typeof(string));
            dt.Columns.Add("first_name", typeof(string));
            dt.Columns.Add("tablename", typeof(string));
            dt.Columns.Add("columnname", typeof(string));
            dt.Columns.Add("last_name", typeof(string));
            dt.Columns.Add("std", typeof(string));
            dt.Columns.Add("lcl", typeof(string));
            dt.Columns.Add("ucl", typeof(string));
            dt.Columns.Add("lsl", typeof(string));
            dt.Columns.Add("usl", typeof(string));
            dt.Columns.Add("start_time", typeof(string));
            dt.Columns.Add("end_time", typeof(string));
            dt.Columns.Add("interlock_yn", typeof(string));
            dt.Columns.Add("alarm_yn", typeof(string));

            int totalRows = 0;
            var fileLocation = new FileInfo(filePath);
            using (ExcelPackage package = new ExcelPackage(fileLocation))
            {
                ExcelWorksheet sheet = package.Workbook.Worksheets[0];
                totalRows = sheet.Dimension.Rows;

                // i = 1 is header row
                for (var i = 2; i <= totalRows; i++)
                {
                    string eqpCode = sheet.Cells[i, 1].Value?.ToString();
                    string groupCode = sheet.Cells[i, 2].Value?.ToString();
                    string groupName = sheet.Cells[i, 3].Value?.ToString();
                    string rawType = sheet.Cells[i, 4].Value?.ToString();
                    string pvsv = sheet.Cells[i, 5].Value?.ToString();
                    string firstName = sheet.Cells[i, 6].Value?.ToString();
                    string tablename = sheet.Cells[i, 7].Value?.ToString();
                    string columnname = sheet.Cells[i, 8].Value?.ToString();
                    string lastName = sheet.Cells[i, 9].Value?.ToString();
                    string std = sheet.Cells[i, 10].Value?.ToString();
                    string lcl = sheet.Cells[i, 11].Value?.ToString();
                    string ucl = sheet.Cells[i, 12].Value?.ToString();
                    string lsl = sheet.Cells[i, 13].Value?.ToString();
                    string usl = sheet.Cells[i, 14].Value?.ToString();
                    string startTime = sheet.Cells[i, 15].Value?.ToString();
                    string endTime = sheet.Cells[i, 16].Value?.ToString();
                    string interlockAlarm = sheet.Cells[i, 17].Value?.ToString();

                    DataRow row = dt.NewRow();

                    row[0] = string.IsNullOrEmpty(eqpCode) ? "" : eqpCode;
                    row[1] = string.IsNullOrEmpty(groupCode) ? "" : groupCode;
                    row[2] = string.IsNullOrEmpty(groupName) ? "" : groupName;
                    row[3] = string.IsNullOrEmpty(rawType) ? "" : rawType;
                    row[4] = string.IsNullOrEmpty(pvsv) ? "" : pvsv;
                    row[5] = string.IsNullOrEmpty(firstName) ? "" : firstName;
                    row[6] = string.IsNullOrEmpty(tablename) ? "" : tablename;
                    row[7] = string.IsNullOrEmpty(columnname) ? "" : columnname;
                    row[8] = string.IsNullOrEmpty(lastName) ? "" : lastName;
                    row[9] = string.IsNullOrEmpty(std) ? "" : std;
                    row[10] = string.IsNullOrEmpty(lcl) ? "" : lcl;
                    row[11] = string.IsNullOrEmpty(ucl) ? "" : ucl;
                    row[12] = string.IsNullOrEmpty(lsl) ? "" : lsl;
                    row[13] = string.IsNullOrEmpty(usl) ? "" : usl;
                    row[14] = string.IsNullOrEmpty(startTime) ? "" : startTime;
                    row[15] = string.IsNullOrEmpty(endTime) ? "" : endTime;
                    row[16] = string.IsNullOrEmpty(interlockAlarm) ? "N" : interlockAlarm.Split('/')[0];
                    row[17] = string.IsNullOrEmpty(interlockAlarm) ? "N" : interlockAlarm.Split('/')[1];

                    dt.Rows.Add(row);
                }
            }
        }

        List<IEnumerable<IDictionary>> result = new List<IEnumerable<IDictionary>>();

        var listPv = ToDic(dt).Where(x => ConvertEx.ConvertTo(x["pvsv"], "") == "P");
        result.Add(listPv);

        var listSv = ToDic(dt).Where(x => ConvertEx.ConvertTo(x["pvsv"], "") == "S");
        result.Add(listSv);

        return result;
    }
    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }

    [ManualMap]
    public static int EqpImport(ICollection data)
    {
        RemoveCache();

        int result = 0;

        foreach (JsonElement json in data)
        {
            try
            {
                var row = JsonConvert.DeserializeObject<Dictionary<string, string>>(json.ToString());

                if (row == null) 
                { 
                    return -1; 
                }

                if (string.IsNullOrEmpty(row["eqpCode"].ToString())) 
                { 
                    return -1; 
                }

                if (string.IsNullOrEmpty(row["tablename"].ToString())) 
                { 
                    return -1; 
                }

                if (string.IsNullOrEmpty(row["columnname"].ToString())) 
                { 
                    return -1; 
                }

                if (!string.IsNullOrEmpty(row["groupCode"].ToString()))
                {
                    dynamic obj = new ExpandoObject();
                    obj.CorpId = UserCorpId;
                    obj.FacId = UserFacId;
                    obj.CreateUser = UserId;
                    obj.GroupCode = row["groupCode"];
                    obj.GroupName = row["groupName"];

                    if (DataContext.StringValue<int>("@RecipeTemplate.ParamRecipeGroupSelect", RefineExpando(obj, true)) <= 0)
                    {
                        var db = DataContext.Create(null);
                        db.IgnoreParameterSame = true;

                        string groupCode = db.ExecuteStringScalar<string>("@RecipeTemplate.ParamRecipeGroupInsert", RefineExpando(obj));

                        obj.GroupCode = groupCode;

                        //return -1;
                    }

                    obj.EqpCode = row["eqpCode"];
                    obj.FirstName = row["firstName"];
                    obj.Std = row["std"];
                    obj.InterlockYn = row["interlockYn"];
                    obj.AlarmYn = row["alarmYn"];
                    obj.RawType = row["rawType"];
                    obj.TableName = row["tablename"];
                    obj.ColumnName = row["columnname"];
                    obj.StartTime = row["startTime"];
                    obj.EndTime = row["endTime"];

                    if (row["pvsv"].ToString() == "P")
                    {
                        obj.Lcl = row["lcl"];
                        obj.Ucl = row["ucl"];
                        obj.Lsl = row["lsl"];
                        obj.Usl = row["usl"];

                        result += DataContext.StringNonQuery("@RecipeTemplate.ParamInsert", RefineExpando(obj));
                    }
                    else if (row["pvsv"].ToString() == "S")
                    {
                        result += DataContext.StringNonQuery("@RecipeTemplate.RecipeInsert", RefineExpando(obj));
                    }
                }    
            }
            catch (Exception ex)
            {
                return -1;
            }
        }
        return result;
    }

    [ManualMap]
    public static int ModelImport(ICollection data)
    {
        RemoveCache();

        int result = 0;
        var _model = "";

        foreach (JsonElement json in data)
        {
            var row = JsonConvert.DeserializeObject<Dictionary<string, string>>(json.ToString());

            if (row == null) 
            { 
                return -1; 
            }

            if (!string.IsNullOrEmpty(row["recipeCode"].ToString()))
            {
                dynamic obj = new ExpandoObject();
                obj.CorpId = UserCorpId;
                obj.FacId = UserFacId;
                obj.CreateUser = UserId;
                obj.ModelCode = row["modelCode"];

                if (result == 0)
                {
                    _model = row["modelCode"];

                    if (ModelApproveService.ApproveCheck(obj.ModelCode) > 0)
                    {
                        return -2;
                    }

                    if ((DataContext.StringValue<int>("@ModelOperExtNew.EditCheck", RefineExpando(obj, true))) > 0)
                    {
                        return -3;
                    }
                }
                else if (_model != row["modelCode"])
                {
                    obj.ModelCode = _model;
                    DataContext.StringNonQuery("@RecipeTemplate.DeleteModel", RefineExpando(obj));

                    return -1;
                }

                obj.GroupCode = row["recipeCode"];

                if (DataContext.StringValue<int>("@RecipeTemplate.ParamRecipeGroupSelect", RefineExpando(obj, true)) <= 0)
                {
                    DataContext.StringNonQuery("@RecipeTemplate.DeleteModel", RefineExpando(obj));

                    return -1;
                }

                try
                {
                    obj.OperCode = row["operCode"];
                    obj.OperSeqNo = row["operSeqNo"];
                    obj.EqpCode = row["eqpCode"];

                    DataTable dt = DataContext.StringDataSet("@RecipeTemplate.ModelList", RefineExpando(obj)).Tables[0];

                    var mapList = dt.AsEnumerable().Select(x => new
                    {
                        modelCode = x.TypeCol<string>("model_code"),
                        operSeqNo = x.TypeCol<int>("oper_seq_no"),
                        operCode = x.TypeCol<string>("oper_code"),
                        eqpCode = x.TypeCol<string>("eqp_code"),
                    }).ToList();

                    var map = mapList.FirstOrDefault(y => y.modelCode == row["modelCode"] && y.operSeqNo == int.Parse(row["operSeqNo"]) && y.operCode == row["operCode"] && y.eqpCode == row["eqpCode"]);

                    if (map == null)
                    {
                        continue;
                    }
                    else
                    {
                        obj.InterlockYn = string.IsNullOrEmpty(row["interlockYn"]) ? "N" : row["interlockYn"];

                        result += DataContext.StringNonQuery("@RecipeTemplate.ParamModelInsert", RefineExpando(obj));
                        result += DataContext.StringNonQuery("@RecipeTemplate.RecipeModelInsert", RefineExpando(obj));

                        obj.ApproveKey = NewShortId();
                        result += DataContext.StringNonQuery("@ModelRecipeParamMapNew.RecipeParamApproveExUpdate", RefineExpando(obj));
                    }
                }
                catch (Exception ex)
                {
                    DataContext.StringNonQuery("@RecipeTemplate.DeleteModel", RefineExpando(obj));
                    return -1;
                }
            }
        }

        return result;
    }

    [ManualMap]
    public static IResult UploadModelExcel(IOptions<Setting>? setting, ILogger<FileService> logger, IFormFileCollection files)
    {
        DataTable dt = new DataTable();

        SetSetting(setting);
        var uploadDir = "Recipe/Template/" + DateTime.Now.ToString("yyyy-MM-dd") + "/";
        var uploadPath = GetUploadPath(uploadDir);
        if (!Directory.Exists(uploadPath))
        {
            Directory.CreateDirectory(uploadPath);
        }
        var file = files[0];
        string guid = Guid.NewGuid().ToString();
        var fileName = guid + Path.GetExtension(file.FileName);
        string ext = Path.GetExtension(file.FileName);
        if (!string.IsNullOrWhiteSpace(ext) && BlockExtList.Contains(ext.ToLower()))
        {
            logger.LogCritical("업로드 금지 파일 업로드: {fielName}, {UserId}", fileName, UserId);
            return Results.Problem($"금지된 확장자가 업로드 되었습니다. [{ext}] 요청 내역이 기록되었습니다.");
        }
        else
        {
            dynamic obj = new ExpandoObject();
            obj.DataKey = NewShortId();
            obj.Filename = fileName;
            obj.Filelocation = uploadDir;
            obj.DataType = 'M';

            var info = DataContext.StringNonQuery("@RecipeTemplate.FileInsert", RefineExpando(obj));


            var filePath = Path.Combine(uploadPath, fileName);
            using (var stream = File.Create(filePath))
            {
                file.CopyTo(stream);
            }

            dt.Columns.Add("modelCode", typeof(string));
            dt.Columns.Add("interlockYn", typeof(string));
            dt.Columns.Add("operSeqNo", typeof(string));
            dt.Columns.Add("operCode", typeof(string));
            dt.Columns.Add("operDesc", typeof(string));
            dt.Columns.Add("eqpCode", typeof(string));
            dt.Columns.Add("eqpDesc", typeof(string));
            dt.Columns.Add("recipeCode", typeof(string));
            dt.Columns.Add("recipeName", typeof(string));
            dt.Columns.Add("pType", typeof(string));
            dt.Columns.Add("svPvCode", typeof(string));
            dt.Columns.Add("svPvName", typeof(string));
            dt.Columns.Add("svStd", typeof(string));
            dt.Columns.Add("pvStd", typeof(string));
            dt.Columns.Add("pvLcl", typeof(string));
            dt.Columns.Add("pvUcl", typeof(string));
            dt.Columns.Add("pvLsl", typeof(string));
            dt.Columns.Add("pvUsl", typeof(string));

            int totalRows = 0;
            var fileLocation = new FileInfo(filePath);
            using (ExcelPackage package = new ExcelPackage(fileLocation))
            {
                ExcelWorksheet sheet = package.Workbook.Worksheets[0];
                totalRows = sheet.Dimension.Rows;

                // i = 1 is header row
                for (var i = 2; i <= totalRows; i++)
                {
                    string modelCode = sheet.Cells[i, 1].Value?.ToString();
                    string interlockYn = sheet.Cells[i, 2].Value?.ToString();
                    string operSeqNo = sheet.Cells[i, 3].Value?.ToString();
                    string operCode = sheet.Cells[i, 4].Value?.ToString();
                    string operDesc = sheet.Cells[i, 5].Value?.ToString();
                    string eqpCode = sheet.Cells[i, 6].Value?.ToString();
                    string eqpDesc = sheet.Cells[i, 7].Value?.ToString();
                    string recipeCode = sheet.Cells[i, 8].Value?.ToString();
                    string recipeName = sheet.Cells[i, 9].Value?.ToString();
                    string pType = sheet.Cells[i, 10].Value?.ToString();
                    string svPvCode = sheet.Cells[i, 11].Value?.ToString();
                    string svPvName = sheet.Cells[i, 12].Value?.ToString();
                    string svStd = sheet.Cells[i, 13].Value?.ToString();
                    string pvStd = sheet.Cells[i, 14].Value?.ToString();
                    string pvLcl = sheet.Cells[i, 15].Value?.ToString();
                    string pvUcl = sheet.Cells[i, 16].Value?.ToString();
                    string pvLsl = sheet.Cells[i, 17].Value?.ToString();
                    string pvUsl = sheet.Cells[i, 18].Value?.ToString();

                    DataRow row = dt.NewRow();

                    row[0] = string.IsNullOrEmpty(modelCode) ? "" : modelCode;
                    row[1] = string.IsNullOrEmpty(interlockYn) ? "N" : interlockYn;
                    row[2] = string.IsNullOrEmpty(operSeqNo) ? "" : operSeqNo;
                    row[3] = string.IsNullOrEmpty(operCode) ? "" : operCode;
                    row[4] = string.IsNullOrEmpty(operDesc) ? "" : operDesc;
                    row[5] = string.IsNullOrEmpty(eqpCode) ? "" : eqpCode;
                    row[6] = string.IsNullOrEmpty(eqpDesc) ? "" : eqpDesc;
                    row[7] = string.IsNullOrEmpty(recipeCode) ? "" : recipeCode;
                    row[8] = string.IsNullOrEmpty(recipeName) ? "" : recipeName;
                    row[9] = string.IsNullOrEmpty(pType) ? "" : pType;
                    row[10] = string.IsNullOrEmpty(svPvCode) ? "" : svPvCode;
                    row[11] = string.IsNullOrEmpty(svPvName) ? "" : svPvName;
                    row[12] = string.IsNullOrEmpty(svStd) ? "" : svStd;
                    row[13] = string.IsNullOrEmpty(pvStd) ? "" : pvStd;
                    row[14] = string.IsNullOrEmpty(pvLcl) ? "" : pvLcl;
                    row[15] = string.IsNullOrEmpty(pvUcl) ? "" : pvUcl;
                    row[16] = string.IsNullOrEmpty(pvLsl) ? "" : pvLsl;
                    row[17] = string.IsNullOrEmpty(pvUsl) ? "" : pvUsl;

                    dt.Rows.Add(row);
                }
            }
        }

        return Results.Json(dt);
    }

    [ManualMap]
    public static IResult ExcelTemplateDown(string? rawType, string? eqpCode)
    {
        dynamic obj = new ExpandoObject();
        obj.EqpCode = eqpCode;

        DataTable dt = new DataTable();

        if (rawType == "L")
        {
            dt = DataContext.StringDataSet("@EqpRecipeParamCheck.PlcList", RefineExpando(obj, true)).Tables[0];
            FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

            // LastName이 있는 값들
            var containLast = dt.AsEnumerable().Where(x => x.TypeCol<string>("last_name").Contains("||") || x.TypeCol<string>("first_name").Contains("||")).ToList();
            // LastName이 없는 값들
            var noContainLast = dt.AsEnumerable().Where(x => !x.TypeCol<string>("last_name").Contains("||") || !x.TypeCol<string>("first_name").Contains("||")).ToList();

            // LastName 을 null 처리
            foreach (var item in noContainLast)
            {
                item["last_name"] = null;
            }
            // LastName이 들어가 있는 값을 Split 하고 First, Last 에 넣어줌
            foreach (var item in containLast)
            {
                string first_name = item.TypeCol<string>("first_name");
                // split 
                string[] split = first_name.Split("||");

                item["first_name"] = split[0];
                item["last_name"] = split[1];
            }
        }
        else if (rawType == "P")
        {
            dt = DataContext.StringDataSet("@EqpRecipeParamCheck.PcList", RefineExpando(obj, true)).Tables[0];
            FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);


            // LastName이 있는 값들
            var containLast = dt.AsEnumerable().Where(x => x.TypeCol<string>("last_name").Contains("||") || x.TypeCol<string>("first_name").Contains("||")).ToList();
            // LastName이 없는 값들
            var noContainLast = dt.AsEnumerable().Where(x => !x.TypeCol<string>("last_name").Contains("||") || !x.TypeCol<string>("first_name").Contains("||")).ToList();

            // LastName 을 null 처리
            foreach (var item in noContainLast)
            {
                item["last_name"] = null;
            }
            // LastName이 들어가 있는 값을 Split 하고 First, Last 에 넣어줌
            foreach (var item in containLast)
            {
                string first_name = item.TypeCol<string>("first_name");
                // split 
                string[] split = first_name.Split("||");

                item["first_name"] = split[0];
                item["last_name"] = split[1];
            }
        }

        dt.Columns.Add("group_code", typeof(string));
        dt.Columns.Add("group_name", typeof(string));
        dt.Columns.Add("std", typeof(string));
        dt.Columns.Add("lcl", typeof(string));
        dt.Columns.Add("ucl", typeof(string));
        dt.Columns.Add("lsl", typeof(string));
        dt.Columns.Add("usl", typeof(string));
        dt.Columns.Add("start_time", typeof(string));
        dt.Columns.Add("end_time", typeof(string));
        dt.Columns.Add("interlock_alarm", typeof(string));

        List<Tuple<string, string, double, Type, Func<DataRow, object>?>> mapList = new()
        {
            new("eqp_code", "설비코드\r\nCode thiết bị ", 40, typeof(string), null),
            new("group_code", "레시피그룹코드\r\nCode group recipe", 40, typeof(string), null),
            new("group_name", "레시피그룹코드\r\nTên group recipe", 40, typeof(string), null),
            new("raw_type", "수집유형\r\nLoại hình thu thập", 40, typeof(string), null),
            new("pvsv", "SV/PV\r\n Phân loại SV/PV", 45, typeof(string), null),
            new("first_name", "SV/PV Name\r\n Tên SV/PV", 45, typeof(string), null),
            new("tablename", "설비(테이블)\r\nThiết bị ( table )", 20, typeof(string), null),
            new("columnname", "기술항목명\r\nHạng mục ( hàng )", 40, typeof(string), null),
            new("last_name", "기술항목명\r\nTên hạng mục kỹ thuật", 40, typeof(string), null),
            new("std", "표준값\r\nGiá trị tiêu chuẩn", 20, typeof(string), null),
            new("lcl", "lcl", 45, typeof(string), null),
            new("ucl", "ucl", 20, typeof(string), null),
            new("lsl", "lsl", 20, typeof(string), null),
            new("usl", "usl", 40, typeof(string), null),
            new("start_time", "시작\r\nBắt đầu", 20, typeof(string), null),
            new("end_time", "종료\r\nHoàn thành ", 20, typeof(string), null),
            new("interlock_alarm", "인터락(Y/N)/ 알람(Y/N)\r\nInterlock / Alarm ", 20, typeof(string), null)
        };
        
        string fileName = "eqp_recipe_param_template";

        using var excel = ExcelEx.ToExcel(dt, mapList);

        return Results.File(excel.GetAsByteArray(), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }

    [ManualMap]
    public static IResult ModelList(string? operCode, string? modelCode,bool isExcel = false)
    {
        dynamic obj = new ExpandoObject();
        obj.ModelCode = modelCode;
        obj.OperCode = operCode;

        DataTable dt = DataContext.StringDataSet("@RecipeTemplate.ModelList", RefineExpando(obj)).Tables[0];

        if (!isExcel)
            return Results.Json(ToDic(dt));

        return ExcelModelDown(dt, "MODEL_RECIPE_TEMPLATE");
    }

    [ManualMap]
    public static IResult ExcelModelDown(DataTable dt, string fileName)
    {
        dt.Columns.Add("recipe_code", typeof(string));
        dt.Columns.Add("recipe_name", typeof(string));
        dt.Columns.Add("p_type", typeof(string));
        dt.Columns.Add("sv_pv_code", typeof(string));
        dt.Columns.Add("sv_pv_name", typeof(string));
        dt.Columns.Add("sv_std", typeof(string));
        dt.Columns.Add("pv_std", typeof(string));
        dt.Columns.Add("pv_lcl", typeof(string));
        dt.Columns.Add("pv_ucl", typeof(string));
        dt.Columns.Add("pv_lsl", typeof(string));
        dt.Columns.Add("pv_usl", typeof(string));

        List<Tuple<string, string, double, Type, Func<DataRow, object>?>> mapList = new()
        {
            new("model_code", "모델코드\r\nCode model", 40, typeof(string), null),
            new("interlock_yn", "인터락 (Y/N)\r\nInterlock", 40, typeof(string), null),
            new("oper_seq_no", "공정순서\r\nThứ tự công đoạn", 20, typeof(string), null),
            new("oper_code", "공정코드\r\nCode công đoạn", 20, typeof(string), null),
            new("oper_desc", "공정명\r\nTên công đoạn", 20, typeof(string), null),
            new("eqp_code", "설비코드\r\nCode thiết bị", 45, typeof(string), null),
            new("eqp_desc", "설비명\r\nTên thiết bị", 20, typeof(string), null),
            new("recipe_code", "Recipe Code ( Group Code)", 20, typeof(string), null),
            new("recipe_name", "Recipe Name ( Group Name)", 20, typeof(string), null),
            new("p_type", "SV/PV\r\n Phân loại SV/PV", 20, typeof(string), null),
            new("sv_pv_code", "SV/PV CODE", 20, typeof(string), null),
            new("sv_pv_name", "SV/PV NAME", 20, typeof(string), null),
            new("sv_std", "SV 기준값\r\nGiá trị tiêu chuẩn SV", 40, typeof(string), null),
            new("pv_std", "PV 표준값\r\nGiá trị tiêu chuẩn PV", 20, typeof(string), null),
            new("pv_lcl", "PV LCL", 45, typeof(string), null),
            new("pv_ucl", "PV UCL", 20, typeof(string), null),
            new("pv_lsl", "PV LSL", 20, typeof(string), null),
            new("pv_usl", "PV USL", 20, typeof(string), null)
        };

        using var excel = ExcelEx.ToExcel(dt, mapList);

        return Results.File(excel.GetAsByteArray(), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }
}