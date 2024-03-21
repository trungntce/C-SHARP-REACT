namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Dynamic;
using System.Linq;
using System.Transactions;
using Framework;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Practices.EnterpriseLibrary.Data;
using Newtonsoft.Json;
using YamlDotNet.Core;

public class FDCInterlockService : MinimalApiService, IMinimalApi
{
    public FDCInterlockService(ILogger<FDCInterlockService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/model", nameof(ModelList));
        group.MapGet("/stdoper", nameof(StdOperList));
        group.MapGet("/gapoper", nameof(GapOperList));
        group.MapPost("/defectrate", nameof(DefectRateUpdate));
        group.MapDelete("/defectrate", nameof(DefectRateDelete));

        group.MapPut("/process", nameof(ProcessInsert));
        group.MapPost("/processhandle", nameof(ProcessHandleUpdate));
        group.MapPost("/processsettle", nameof(ProcessSettleUpdate));
        group.MapDelete("/process", nameof(ProcessDelete));
        group.MapPost("/processdeletejson", nameof(ProcessDelete));
        group.MapPost("/deletejson", nameof(Delete));

        group.MapGet("/panel", nameof(PanelList));

        return RouteAllEndpoint(group);
    }

	public static IResult List(char fromToDtType, DateTime fromDt, DateTime toDt,
		char? fdcType, string? operType, char? processStep, string? workorder,
		string? itemCode, string? modelCode, string? modelName, bool isExcel = false)
	{
		dynamic obj = new ExpandoObject();
		obj.FromToDtType = fromToDtType;
		obj.FromDt = SearchFromDt(fromDt);
		obj.ToDt = SearchToDt(toDt);

		obj.FdcType = fdcType;
		obj.OperType = operType;
		obj.ProcessStep = processStep;
		obj.Workorder = workorder;

		obj.ItemCode = itemCode;
		obj.ModelCode = modelCode;
		obj.ModelName = modelName;

		DataTable dt = DataContext.StringDataSet("@FDCInterlock.List", RefineExpando(obj, true)).Tables[0];

		FindLabel(dt, "fdcType", "fdcTypeName", codeId => CodeService.CodeName("FDC_DEFECT_TYPE", codeId));
		FindLabel(dt, "operType", "operTypeName", codeId => CodeService.CodeName("FDC_OPER_TYPE", codeId));
        FindLabel(dt, "handleCode", "handleName", codeId => CodeService.CodeName("FDC_TO_TYPE", codeId));

        if (!isExcel)
            return Results.Json(ToDic(dt));

        return ExcelDown(dt, "FDCINTERLOCK");
    }

    [ManualMap]
    public static IResult ExcelDown(DataTable dt, string fileName)
    {
        DataTable excelDt = dt.Copy();
        excelDt.Columns.Add("status");
        excelDt.Columns.Add("eqp_name");

        foreach (DataRow row in excelDt.Rows)
        {
            var eqp = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(row.TypeCol<string>("eqp_json"));

            row["status"] = row.TypeCol<string>("handle_dt") != null && row.TypeCol<string>("settle_dt") !=null ? "v" : "";
            row["workorder_interlock_code"] = row.TypeCol<string>("workorder_interlock_code") != null ? "v":"";
            row["eqp_name"] = eqp[0].TypeKey<string>("eqpName");
        }

        List<Tuple<string, string, double, Type, Func<DataRow, object>?>> mapList = new()
        {
            //기준정보
            new("workorder", "Batch No.", 35, typeof(string), null),
            new("status", "완료", 10, typeof(string), null),
            new("workorder_interlock_code", "인터락", 10, typeof(string), null),
            new("model_code", "모델코드",35, typeof(string), null),
            //new("eqp_code", "설비코드",25, typeof(string), null),
            //new("eqp_name", "설비명",35, typeof(string), null),
            new("fdc_type_name", "구분", 20, typeof(string), null),
            new("panel_cnt", "판넬", 35, typeof(int), null),
            //기준정보
            new("fdc_type_name", "구분", 20, typeof(string), null),
            new(string.Empty, "기준불량률", 15, typeof(double), (row) => Math.Round(row.TypeCol<double>("defect_rate"),2)), //ch
            //대상공정
            new("oper_seq_no", "공순", 10, typeof(int), null),
            new("oper_code", "공정코드", 15, typeof(string), null),
            new("oper_name", "공정명", 20, typeof(string), null),
            new(string.Empty, "불량률", 10, typeof(double), (row) => Math.Round(row.TypeCol<double>("defect_rate"), 2)),
            new(string.Empty, "Open불량률", 10, typeof(double), (row) => Math.Round(row.TypeCol<double>("open_defect_rate"), 2)), //ch
            new(string.Empty, "Short불량률", 10, typeof(double), (row) => Math.Round(row.TypeCol<double>("short_defect_rate"), 2)), //ch
            //대상공정2
            new("plus_oper_seq_no", "공순2", 10, typeof(string), null),
            new("plus_oper_name", "공정명2", 20, typeof(string), null),
            new(string.Empty, "불량률2", 10, typeof(double), (row) => Math.Round(row.TypeCol<double>("plus_defect_rate"), 2)), //ch
            new(string.Empty, "Open불량률", 10, typeof(double), (row) => Math.Round(row.TypeCol < double >("plus_open_defect_rate"), 2)), //ch
            new(string.Empty, "Short불량률", 10, typeof(double), (row) => Math.Round(row.TypeCol < double >("plus_short_defect_rate"), 2)), //ch
            //비교공정
            new("to_oper_seq_no", "비교공순", 10, typeof(string), null),
            new("to_oper_name", "비교공정명", 20, typeof(string), null),
            new(string.Empty, "비교불량률", 10, typeof(double), (row) => Math.Round(row.TypeCol < double >("to_defect_rate"), 2)), //ch
            new(string.Empty, "비교Open불량률", 10, typeof(double), (row) => Math.Round(row.TypeCol < double >("to_open_defect_rate"), 2)), //ch
            new(string.Empty, "비교Short불량률", 10, typeof(double), (row) => Math.Round(row.TypeCol < double >("to_short_defect_rate"), 2)), //ch
            //처리
            new("handle_name", "처리구분", 20, typeof(string), null),
            new("handle_remark", "처리방법", 35, typeof(string), null),
            //합의
            new("settle_remark", "합의사유", 35, typeof(string), null),
            //일시
            new("create_dt", "발생시간", 35, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("create_dt")?.ToString("yyyy-MM-dd HH:mm") ?? string.Empty; }),
            new("start_dt_4M", "4M Start", 35, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("start_dt_4M")?.ToString("yyyy-MM-dd HH:mm") ?? string.Empty; }),
            new("end_dt_4M", "4M End", 35, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("end_dt_4M")?.ToString("yyyy-MM-dd HH:mm") ?? string.Empty; }),
        };

        using var excel = ExcelEx.ToExcel(excelDt, mapList);

        return Results.File(excel.GetAsByteArray(), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }

    [ManualMap]
    public static double DevideFormat(DataRow row, string numCol, string denomCol)
    {
        return Math.Round(row.TypeCol<double>(UtilEx.ToSnake(numCol)) / row.TypeCol<double>(UtilEx.ToSnake(denomCol)) * 100, 2);
    }

    public static int Delete([FromBody] FDCInterlockProcessEntity entity)
    {
        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        return db.ExecuteStringNonQuery("@FDCInterlock.Delete", RefineEntity(entity));
    }

    [ManualMap]
    public static int ProcessInsert([FromBody] FDCInterlockProcessEntity entity)
    {
        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

       return db.ExecuteStringNonQuery("@FDCInterlock.ProcessInsert", RefineEntity(entity));
    }

    [ManualMap]
    public static int ProcessHandleUpdate([FromBody] FDCInterlockProcessEntity entity)
    {
        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        return db.ExecuteStringNonQuery("@FDCInterlock.ProcessHandleUpdate", RefineEntity(entity));
    }

    [ManualMap]
    public static int ProcessSettleUpdate([FromBody] FDCInterlockProcessEntity entity)
    {
        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        using TransactionScope scope = new();

        int result = db.ExecuteStringNonQuery("@FDCInterlock.ProcessSettleUpdate", RefineEntity(entity));

        if (entity.UpdateYn != 'Y') // 최초 합의
        {
            Dictionary<string, object> dic = new()
            {
                { "json", entity.Json! },
            };

            switch (entity.handleCode)
            {
                case 'D': // 폐기
                {
                    result += DefectInsert(db, dic);

                    break;
                }
                case 'U': // 양품화
                {
                        result += InterlockUpdate(db, dic);
                        break;
                }
                default:
                    break;
            }

        }

        scope.Complete();

        return result;
    }

    [ManualMap]
    public static int DefectInsert(Database db, Dictionary<string, object> dic)
    {
        return db.ExecuteStringNonQuery("@FDCInterlock.DefectInsert", RefineParam(dic));
    }

    [ManualMap]
    public static int InterlockUpdate(Database db, Dictionary<string, object> dic)
    {
        return db.ExecuteStringNonQuery("@FDCInterlock.InterlockUpdate", RefineParam(dic));
    }

    [ManualMap]
    public static int ProcessDelete([FromBody] FDCInterlockProcessEntity entity)
    {
        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        return db.ExecuteStringNonQuery("@FDCInterlock.ProcessDelete", RefineEntity(entity));
    }

    [ManualMap]
    public static IEnumerable<IDictionary> ModelList(string? itemCode, string? modelCode, string? modelName, string? itemCategoryCode, char? settedYn)
    {
        dynamic obj = new ExpandoObject();
        obj.ItemCode = itemCode;
        obj.ModelCode = modelCode;
        obj.ModelName = modelName;
        obj.ItemCategoryCode = itemCategoryCode;
        obj.SettedYn = settedYn;

        DataTable dt = DataContext.StringDataSet("@FDCInterlock.ModelList", RefineExpando(obj, true)).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> StdOperList(string modelCode)
    {
        return ToDic(DataContext.StringDataSet("@FDCInterlock.StdOperList", new { modelCode }).Tables[0]);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> GapOperList(string modelCode)
    {
        return ToDic(DataContext.StringDataSet("@FDCInterlock.GapOperList", new { modelCode }).Tables[0]);
    }

    [ManualMap]
    public static int DefectRateInsert([FromBody] Dictionary<string, object> dic)
    {
        return DataContext.StringNonQuery("@FDCInterlock.DefectRateInsert", RefineParam(dic));
    }

    [ManualMap]
    public static int DefectRateDelete(string modelCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ModelCode = modelCode;

        return DataContext.StringNonQuery("@FDCInterlock.DefectRateDelete", RefineExpando(obj, true));
    }

    [ManualMap]
    public static int DefectRateUpdate([FromBody] Dictionary<string, object?> dic)
    {
        using TransactionScope scope = new();

        var param = dic.ToCleanDic().ToDictionary(x => x.Key, y => y.Value!);

        int result = DefectRateDelete(param.TypeKey<string>("modelCode"));
        result += DefectRateInsert(param);

        scope.Complete();

        return result;
    }

    [ManualMap]
    public static IEnumerable<IDictionary> PanelList(string headerGroupKey)
    {
        return ToDic(DataContext.StringDataSet("@FDCInterlock.PanelList", new { headerGroupKey }).Tables[0]);
    }
}
