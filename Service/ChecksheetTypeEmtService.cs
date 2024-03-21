namespace WebApp;

using Framework;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using OfficeOpenXml;
using System.Data;
using System.Dynamic;
using System.Text;

public class ChecksheetTypeEmtService : MinimalApiService, IMinimalApi
{
    public ChecksheetTypeEmtService(ILogger<MinimalApiService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/item", nameof(CksEmtList));
        group.MapGet("/itemcks", nameof(CksEmtItemList));
        group.MapPost("/iteminsert", nameof(ItemInsert));
        group.MapDelete("/itemdel", nameof(DeleteItem));
        group.MapPost("/upload", nameof(Upload));
        group.MapPost("/uploadexcel", nameof(UploadExcel));
        group.MapGet("/downloadexceltemp", nameof(ExcelTempDown));
        return RouteAllEndpoint(group);
    }
    
    public static IResult List(string groupType, string? checksheetGroupCode, string? checksheetCode, string? workcenterCode, char? useYn, string? eqpCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ChecksheetGroupCode = checksheetGroupCode;
        obj.ChecksheetCode = checksheetCode;
        obj.UseYn = useYn;
        obj.WorkcenterCode = workcenterCode;
        obj.GroupType = groupType;
        obj.EqpCode = eqpCode;

        DataTable dt = DataContext.StringDataSet("@CheckSheetTypeEmt.List", RefineExpando(obj, true)).Tables[0];

        return Results.Json(ToDic(dt));
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }


    [ManualMap]
    public static int CountSelect(string ChecksheetCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ChecksheetCode = ChecksheetCode;

        return DataContext.StringValue<int>("@CheckSheetTypeEmt.CountSelect", RefineExpando(obj, true));
    }

    public static int Insert([FromBody] CheckSheetEntity entity)
    {
        if (CountSelect(entity.ChecksheetGroupCode) > 0)
            return -1;

        RemoveCache();

        return DataContext.StringNonQuery("@CheckSheetTypeEmt.Insert", RefineEntity(entity));
    }

    public static int Update([FromBody] CheckSheetEntity entity)
    {
        //int x = int.Parse(entity.rev.ToString());
        //x = x++;
        //entity.rev = x.ToString();

        RemoveCache();

        return DataContext.StringNonQuery("@CheckSheetTypeEmt.Update", RefineEntity(entity));
    }

    public static int Delete(string ChecksheetCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ChecksheetCode = ChecksheetCode;

        RemoveCache();

        return DataContext.StringNonQuery("@CheckSheetTypeEmt.Delete", RefineExpando(obj));
    }

    [ManualMap]
    public static IResult CksEmtList(string ChecksheetCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ChecksheetCode = ChecksheetCode;

        DataTable dt = DataContext.StringDataSet("@CheckSheetTypeEmt.ListItem", RefineExpando(obj, true)).Tables[0];
        return Results.Json(ToDic(dt));
    }

    [ManualMap]
    public static IResult CksEmtItemList(string EqpCode, string ChecksheetCode, string ChecksheetGroupCode, bool isExcel = false)
    {
        dynamic obj = new ExpandoObject();
        obj.EqpCode = EqpCode;
        obj.ChecksheetCode = ChecksheetCode;
        obj.ChecksheetGroupCode = ChecksheetGroupCode;

        DataTable dt = DataContext.StringDataSet("@CheckSheetTypeEmt.ListCksItem", RefineExpando(obj, false)).Tables[0];

        if (!isExcel)
            return Results.Json(ToDic(dt));

        return ExcelDown(dt, "ChecksheetItemEMT");
      
    }


    [ManualMap]
    public static IResult ExcelDown(DataTable dt, string fileName)
    {
        List<Tuple<string, string, double, Type, Func<DataRow, object>?>> mapList = new()
        {
			//new("creationDate", "일자", 17, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("creation_date")?.ToString("yyyy-MM-dd HH:mm") ?? string.Empty; }),
			new("checksheetGroupCode", "관리코드", 40, typeof(string), null),
			new("checksheetCode", "작업장코드", 40, typeof(string), null),
            new("eqpCode", "설비코드", 40, typeof(string), null),
            new("equipmentDescription", "설비명", 40, typeof(string), null),
            new("checksheetItemCode", "항목코드", 40, typeof(string), null),
            new("checksheetTypeName", "항목명", 40, typeof(string), null),
            new("dailyCheckType", "일일점검형", 40, typeof(string), null),
            new("ord", "순서", 40, typeof(int), null),
            new("exchgPeriod", "교체주기", 40, typeof(string), null),
            new("standardVal", "규격", 40, typeof(string), null),
            new("minVal", "규격MIN", 40, typeof(string), null),
            new("maxVal", "규격MAX", 40, typeof(string), null),
            new("method", "방법", 40, typeof(string), null),
            new("inspectPoint", "점검포인트", 40, typeof(string), null),
            new("unitMeasureCode", "측정단위", 40, typeof(string), null),
            new("measurePeriod", "측정주기", 40, typeof(string), null),
            new("remark", "설명", 200, typeof(string), null),
            new("useYn", "사용여부", 1, typeof(string), null),
            new("rev", "횟수", 40, typeof(string), null),
            new("validStrtDt", "유효시작일", 40, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("valid_strt_dt")?.ToString("yyyy-MM-dd HH:mm") ?? string.Empty; }),
            new("inputType", "입력유형", 40, typeof(string), null),
            

        };

        using var excel = ExcelEx.ToExcel(dt, mapList);

        return Results.File(excel.GetAsByteArray(), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }

    [ManualMap]
    public static int ItemInsert([FromBody] CheckSheetItemEntity entity)
    {
        if (entity.ChecksheetCode.Equals("")) {
            return -1;
        }
        if (entity.ChecksheetTypeName.Equals("")) {
            return -1;
        }   
        if (entity.EqpCode.Equals("")) {
            return -1;
        }
        
        return DataContext.StringNonQuery("@CheckSheetTypeEmt.InsertItem", RefineEntity(entity));
    }

    [ManualMap]
    public static int DeleteItem(string checksheetCode, string checksheetItemCode, string eqpCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ChecksheetItemCode = checksheetItemCode;
        obj.ChecksheetCode = checksheetCode;
        obj.EqpCode = eqpCode;
        return DataContext.StringNonQuery("@CheckSheetTypeEmt.DeleteItem", RefineExpando(obj, true));
    }
    [ManualMap]
    public static IResult Upload(IOptions<Setting>? setting, ILogger<FileService> logger, IFormFileCollection files)
    {
        SetSetting(setting);
        var file = files[0];

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
        obj.path = uploadDir;
        obj.fileName = fileName;

        return Results.Json(obj);
    }

    [ManualMap]
    public static IResult ExcelTempDown()
    {
        List<Tuple<string, string, double, Type, Func<DataRow, object>?>> mapList = new()
        {
			//new("creationDate", "일자", 17, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("creation_date")?.ToString("yyyy-MM-dd HH:mm") ?? string.Empty; }),
			new("itemCode", "Item code(ChecksheetItemCode)", 40, typeof(string), null),
            new("itemName", "Item name(ChecksheetTypeName)", 40, typeof(string), null),
            new("dailyCheckType", "Định kỳ kiểm tra (DailyCheckType)", 40, typeof(string), null),
            new("checkFreqNum", "Tần suất(checkFreqNum)", 40, typeof(string), null),
            new("inputType", "Phương thức nhập (inputType)", 40, typeof(string), null),
            new("ord", "Thứ tự (ord)", 40, typeof(string), null),
            new("exchgPeriod", "교체주기 (exchgPeriod)", 40, typeof(string), null),
            new("standardVal", "Giá trị tiêu chuẩn (standardVal)", 40, typeof(int), null),
            new("minVal", "Giá trị nhỏ nhất (minVal)", 40, typeof(string), null),
            new("maxVal", "Giá trị lớn nhất(maxVal)", 40, typeof(string), null),
            new("useYn", "Tình trạng sử dụng (useYn)", 40, typeof(string), null),
            new("method", "Phương pháp kiểm tra(method)", 40, typeof(string), null),
            new("inspectPoint", "Các điểm cần kiểm tra (inspectPoint)", 40, typeof(string), null),
            new("remark", "Ghi chú (remark)", 40, typeof(string), null)
        };

        DataTable dt = new();
        dt.Columns.Add("item_code", typeof(string));
        dt.Columns.Add("item_name", typeof(string));
        dt.Columns.Add("daily_check_type", typeof(string));
        dt.Columns.Add("check_freq_num", typeof(string));
        dt.Columns.Add("input_type", typeof(string));
        dt.Columns.Add("ord", typeof(string));
        dt.Columns.Add("exchg_period", typeof(string));
        dt.Columns.Add("standard_val", typeof(string));
        dt.Columns.Add("min_val", typeof(string));
        dt.Columns.Add("max_val", typeof(string));
        dt.Columns.Add("use_yn", typeof(string));
        dt.Columns.Add("method", typeof(string));
        dt.Columns.Add("inspect_point", typeof(string));
        dt.Columns.Add("remark", typeof(string));
        DataRow row = dt.NewRow();
        row.ItemArray = new object[] {
            "ITCOD00001", 
            "Item kiểm tra số 1",
            "Ngày",
            "1",
            "text", 
            "1", 
            "test", 
            "", 
            "", 
            "", 
            "Y", 
            "Kiểm tra bằng mắt thường", 
            "Tất cả", 
            "Kiểm tra hàng ngày"
        };
        dt.Rows.Add(row);
        row = dt.NewRow();
        row.ItemArray = new object[] {
            "ITCOD00002", 
            "Item kiểm tra số 2", 
            "Tuần",
            "1", 
            "number", 
            "1", 
            "test", 
            "", 
            "", 
            "", 
            "Y", 
            "Kiểm tra bằng mắt thường", 
            "Tất cả", 
            "Kiểm tra hàng ngày"
        };
        dt.Rows.Add(row);
        row = dt.NewRow();
        row.ItemArray = new object[] {
            "ITCOD00003", 
            "Item kiểm tra số 3", 
            "Tháng", 
            "1", 
            "text", 
            "1", 
            "test", 
            "", 
            "", 
            "", 
            "Y", 
            "Kiểm tra bằng mắt thường", 
            "Tất cả", 
            "Kiểm tra hàng ngày"
        };
        dt.Rows.Add(row);
        row = dt.NewRow();
        row.ItemArray = new object[] {
            "ITCOD00004", "Item kiểm tra số 4", "Năm", "1", "text", "1", "test", "", "", "", "Y", "Kiểm tra bằng mắt thường", "Tất cả", "Kiểm tra hàng ngày"
        };
        dt.Rows.Add(row);


        using var excel = ExcelEx.ToExcel(dt, mapList);

        return Results.File(excel.GetAsByteArray(), "application/force-download", $"checksheet_item_upload_template.xlsx");
    }

    [ManualMap]
    public static IResult UploadExcel(IOptions<Setting>? setting, ILogger<FileService> logger, string checksheetCode, string eqpCode, IFormFileCollection files)
    {
        SetSetting(setting);
        var file = files[0];

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

        int count = 0;
        int totalRows = 0;
        var fileLocation = new FileInfo(filePath);
        DataTable dt = new DataTable();
        dt.Columns.Add("row_no", typeof(string));
        dt.Columns.Add("remark", typeof(string));
        using (ExcelPackage package = new ExcelPackage(fileLocation))
        {
            ExcelWorksheet sheet = package.Workbook.Worksheets[0];
            totalRows = sheet.Dimension.Rows;
            
            for (var i = 2; i <= totalRows; i++)
            {
                try {
                    CheckSheetItemEntity entity = new();
                    entity.ChecksheetCode = checksheetCode;
                    entity.EqpCode = eqpCode;
                    entity.ChecksheetItemCode = sheet.Cells[i, 1].Value?.ToString();
                    entity.ChecksheetTypeName = sheet.Cells[i, 2].Value?.ToString();
                    string dailyCheckType = sheet.Cells[i, 3].Value?.ToString();
                    dailyCheckType = string.IsNullOrEmpty(dailyCheckType) ? "" : dailyCheckType;
                    entity.DailyCheckType = "D";
                    if ("ngày".Equals(dailyCheckType.Trim().ToLower()))
                    {
                        entity.DailyCheckType = "D";
                    }
                    if ("tuần".Equals(dailyCheckType.Trim().ToLower()))
                    {
                        entity.DailyCheckType = "W";
                    }
                    if ("tháng".Equals(dailyCheckType.Trim().ToLower()))
                    {
                        entity.DailyCheckType = "M";
                    }
                    if ("năm".Equals(dailyCheckType.Trim().ToLower()))
                    {
                        entity.DailyCheckType = "Y";
                    }
                    string checkFreqNum = sheet.Cells[i, 4].Value?.ToString();
                    entity.CheckFreqNum = 1;
                    if (!string.IsNullOrEmpty(checkFreqNum) && checkFreqNum.All(char.IsNumber))
                    {
                        entity.CheckFreqNum = int.Parse(checkFreqNum);
                    }
                    string inputType = sheet.Cells[i, 5].Value?.ToString();
                    entity.InputType = "text";

                    if (!string.IsNullOrEmpty(inputType))
                    {
                        if (inputType.Trim().ToLower().Equals("image")) {
                            entity.InputType = "image";
                        }
                        if (inputType.Trim().ToLower().Equals("number"))
                        {
                            entity.InputType = "number";
                        }
                    }
                    string ord = sheet.Cells[i, 6].Value?.ToString();
                    entity.Ord = 1;
                    if (!string.IsNullOrEmpty(ord) && ord.All(char.IsNumber)) { 
                        entity.Ord = int.Parse(ord);
                    }
                    entity.ExchgPeriod = sheet.Cells[i, 7].Value?.ToString();
                    entity.StandardVal = sheet.Cells[i, 8].Value?.ToString();
                    entity.MinVal = sheet.Cells[i, 9].Value?.ToString();
                    entity.MaxVal = sheet.Cells[i, 10].Value?.ToString();
                    string useYn = sheet.Cells[i, 11].Value?.ToString();
                    entity.UseYn = 'Y';
                    if (!string.IsNullOrEmpty(useYn) && useYn.Trim().Count() <= 1) { 
                        if (useYn.Trim().ToUpper().Equals("Y") || useYn.Trim().ToUpper().Equals("N")) {
                            entity.UseYn = useYn.Trim().ToUpper()[0];
                        }
                    }
                    entity.Method = sheet.Cells[i, 12].Value?.ToString();
                    entity.InspectPoint = sheet.Cells[i, 13].Value?.ToString();
                    entity.Remark = sheet.Cells[i, 14].Value?.ToString();

                    StringBuilder str = new();
                    if (string.IsNullOrEmpty(entity.ChecksheetItemCode)) {
                        str.Append("Item code is required!");
                    }
                    if (string.IsNullOrEmpty(entity.ChecksheetTypeName)) {
                        str.Append("Item name is required!");
                    }
                    if (entity.InputType.Equals("number"))
                    {
                        if (string.IsNullOrEmpty(entity.StandardVal) 
                            || string.IsNullOrEmpty(entity.MinVal) 
                            || string.IsNullOrEmpty(entity.MaxVal)) {
                            str.Append("Phương pháp nhập là [Kiểu số] thì cần phải nhập các giá trị tiêu chuẩn.");
                        }
                    }
                    if (!string.IsNullOrEmpty(str.ToString()))
                    {
                        DataRow row = dt.NewRow();
                        row.ItemArray = new object[] { 
                            "Dòng thứ " + i,
                            str.ToString()
                        };
                        dt.Rows.Add(row);
                        continue;
                    }
                    DataContext.StringNonQuery("@CheckSheetTypeEmt.InsertItem", RefineEntity(entity));
                } 
                catch(Exception e)
                {

                }
            }
        }

        return Results.Json(ToDic(dt));
    }
}

