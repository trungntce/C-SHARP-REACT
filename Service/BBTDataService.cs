using Framework;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Math;
using System.Data;
using System.Dynamic;

namespace WebApp.Service;

public class BBTDataService : MinimalApiService, IMinimalApi
{
    static List<KeyValuePair<string, string>> _defectList = new() {
        new KeyValuePair<string, string>("4W"           , "4w_cnt"),
        new KeyValuePair<string, string>("Aux"          , "aux_cnt"),
        new KeyValuePair<string, string>("Both"         , "both_cnt"),
        new KeyValuePair<string, string>("C"            , "c_cnt"),
        new KeyValuePair<string, string>("ER"           , "er_cnt"),
        new KeyValuePair<string, string>("Open"         , "open_cnt"),
        new KeyValuePair<string, string>("SPK"          , "spk_cnt"),
        new KeyValuePair<string, string>("Short"        , "short_cnt"),
        //new KeyValuePair<string, string>("4WNG"         , "raw4wng"),
        //new KeyValuePair<string, string>("SHORT"        , "rawshort"),
        //new KeyValuePair<string, string>("SHORTS2"      , "rawshorts2"),
        //new KeyValuePair<string, string>("uSH2"         , "rawush2"),
        //new KeyValuePair<string, string>("4WNG uSH2"    , "raw4wngush2"),
        //new KeyValuePair<string, string>("OPEN"         , "rawopen"),
        //new KeyValuePair<string, string>("OPEN SHORTS"  , "rawopenshorts"),
        //new KeyValuePair<string, string>("uSH1"         , "rawush1"),
        //new KeyValuePair<string, string>("AUX"          , "rawaux"),
        //new KeyValuePair<string, string>("4WNG SHORT"   , "raw4wngshort"),
        //new KeyValuePair<string, string>("OPEN SHORT"   , "rawopenshort"),
        //new KeyValuePair<string, string>("OPEN SPARK"   , "rawopenspark"),
        //new KeyValuePair<string, string>("SPARK"        , "rawspark"),
        //new KeyValuePair<string, string>("4WNG SPARK"   , "raw4wngspark"),
        //new KeyValuePair<string, string>("OPEN uSH2"    , "rawopenush2"),
        //new KeyValuePair<string, string>("4WNG SHORTS"  , "raw4wngshorts"),
        //new KeyValuePair<string, string>("4WNG uSH1"    , "raw4wngush1"),
        //new KeyValuePair<string, string>("SHORTS"       , "rawshorts"),
        //new KeyValuePair<string, string>("C"            , "rawc"),
        //new KeyValuePair<string, string>("ERROR"        , "rawerror"),
        //new KeyValuePair<string, string>("OPEN uSH1"    , "rawopenush1")
    };

    public BBTDataService(ILogger<BBTService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/byworkorder", nameof(ListWorkorderDetail));
        group.MapGet("/bypanel", nameof(ListPanelDetail));

        return RouteAllEndpoint(group);
    }

    public static IResult List(DateTime fromDt, DateTime toDt, string? eqpCode, string? workorder, string? vendorCode, string? itemCode, string? itemName, string? modelCode, string? appCode, string? panelId, bool isExcel = false, string? orderby = "DT")
    {
        if (string.IsNullOrWhiteSpace(eqpCode) || eqpCode.Trim() == "[]")
            eqpCode = null;

        dynamic obj = new ExpandoObject();

        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);
        obj.EqpCode = eqpCode;
        obj.Workorder = workorder;
        obj.VendorCode = vendorCode;
        obj.ItemCode = itemCode;
        obj.ItemName = itemName;
        obj.ModelCode = modelCode;
        obj.AppCode = appCode;
        obj.Orderby = orderby;
        obj.PanelId = panelId;

        DataTable dt = DataContext.StringDataSet("@BBTData.List", RefineExpando(obj, true)).Tables[0];

        if (!isExcel)
            return Results.Json(ToDic(dt));

        return ExcelDown(dt, "BBT");
    }

    [ManualMap]
    public static IResult ListWorkorderDetail(string? workorder, DateTime fromDt, DateTime toDt, string? operCode, string? eqpCode, bool isExcel = false)
    {
        dynamic obj = new ExpandoObject();

        obj.EqpCode = eqpCode;
        obj.Workorder = workorder;
        obj.OperCode = operCode;
        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);

        DataTable dt = DataContext.StringDataSet("@BBTData.ListWorkorderDetail", RefineExpando(obj, true)).Tables[0];

        
        if (!isExcel)
            return Results.Json(ToDic(dt));

        return ExcelDownWorkorder(dt, "BBT");
    }

    [ManualMap]
    public static IResult ListPanelDetail(string? panelId, DateTime fromDt, DateTime toDt, string? eqpCode, string? operCode, string? workorder, bool isExcel = false)
    {
        dynamic obj = new ExpandoObject();

        obj.PanelId = panelId;
        obj.Workorder = workorder;
        obj.OperCode = operCode;
        obj.EqpCode = eqpCode;
        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);

        DataTable dt1 = DataContext.StringDataSet("@BBTData.ListPanelDetail", RefineExpando(obj, true)).Tables[0];
        DataTable dt2 = DataContext.StringDataSet("@BBTData.ListPanelEqp", RefineExpando(obj, true)).Tables[0];


        //List< DataTable > dataTables = new List<DataTable>();
        //dataTables.Add(dt1);
        //dataTables.Add(dt2);

        DataTable dataTable = new DataTable();

        dataTable.Columns.Add("row_id", typeof(string));
        dataTable.Columns.Add("judge_name", typeof(string));
        dataTable.Columns.Add("pnl_rate", typeof(string));
        dataTable.Columns.Add("ng_rate", typeof(string));
        dataTable.Columns.Add("eqp_name", typeof(string));
        dataTable.Columns.Add("scan_time", typeof(string));
        dataTable.Columns.Add("roll_id", typeof(string));
        dataTable.Columns.Add("oper_seq_no", typeof(string));
        dataTable.Columns.Add("oper_description", typeof(string));
        dataTable.Columns.Add("eqp_description", typeof(string));

        var rowNum = dt1.Rows.Count > dt2.Rows.Count ? dt1.Rows.Count : dt2.Rows.Count;

        for (int i = 0; i < rowNum; i++)
        {
            DataRow row = dataTable.NewRow();

            row["row_id"] = dt1.Rows.Count >= i + 1 ? dt1.Rows[i]["row_id"] : "";
            row["judge_name"] = dt1.Rows.Count >= i + 1 ? dt1.Rows[i]["judge_name"] : "";
            row["pnl_rate"] = dt1.Rows.Count >= i + 1 ? dt1.Rows[i]["judge_cnt"] : "";
            row["ng_rate"] = dt1.Rows.Count >= i + 1 ? DevideFormat(dt1.Rows[i], "judge_cnt", "total_ng").ToString() + "%" : "";
            row["eqp_name"] = dt1.Rows.Count >= i + 1 ? dt1.Rows[i]["eqp_name"] : "";
            row["scan_time"] = dt1.Rows.Count >= i + 1 ? dt1.Rows[i].TypeCol<DateTime?>("scan_time")?.ToString("yyyy-MM-dd HH:mm:ss") : string.Empty;
            row["roll_id"] = dt1.Rows.Count >= i + 1 ? dt1.Rows[i]["roll_id"] : "";
            row["oper_seq_no"] = dt2.Rows.Count >= i + 1 ? dt2.Rows[i]["oper_seq_no"] : "";
            row["oper_description"] = dt2.Rows.Count >= i + 1 ? dt2.Rows[i]["oper_description"] : "";
            row["eqp_description"] = dt2.Rows.Count >= i + 1 ? dt2.Rows[i]["eqp_description"] : "";

            dataTable.Rows.Add(row);
        }

        if (!isExcel)
            return Results.Json(ToDic(dataTable));

        return ExcelDownPanel(dataTable, "BBT");
    }
    [ManualMap]
    public static IResult ExcelDown(DataTable dt, string fileName)
    {
        List<Tuple<string, string, double, Type, Func<DataRow, object>?>> mapList = new()
        {
            //new("item_code", "제품코드", 25, typeof(string), null),
            new("item_name", "제품명", 40, typeof(string), null),
            //new("model_description", "MODEL NAME", 30, typeof(string), null),
            new("model_code", "모델코드", 30, typeof(string), null),
            new("workorder", "BATCH", 35, typeof(string), null),
            new("app_name", "공정명", 30, typeof(string), null),
            //new("eqp_code", "장비코드", 20, typeof(string), null),
            new("eqp_name", "장비명", 35, typeof(string), null),
            new("tool_id", "TOOL", 20, typeof(string), null),
            new("total_cnt", "총 검사수량(PCS)", 10, typeof(int), null),
            new("ng_cnt", "불량수량(PCS)", 10, typeof(int), null),
            new("ng_rate", "불량율BATCH", 15, typeof(string), (row) => DevideFormat(row, "ng_cnt", "total_cnt").ToString() + "%"),
            new("std_rate", "기준불량율", 10, typeof(int), null),
            new("panel_cnt", "PNL", 10, typeof(int), null),
            new("total_defect", "DEFECT 수", 10, typeof(double), null),
            new("defect_rate", "DPU", 10, typeof(double),  (row) => DevideFormatNotPercent(row, "total_defect", "panel_cnt")),
        };

        foreach (var item in _defectList)
        {
            dt.Columns.Add(item.Value + "_dpu", typeof(double));
            dt.Columns.Add(item.Value + "_rate", typeof(string));

            mapList.Add(new(item.Value, item.Key + " 수량", 10, typeof(int), null));
            mapList.Add(new(item.Value + "_std_rate", item.Key + " 기준DPU", 10, typeof(double), null));
            mapList.Add(new(item.Value + "_dpu", item.Key + " DPU", 10, typeof(double), null));
            mapList.Add(new(item.Value + "_rate", item.Key + " 점유율", 15, typeof(string), (row) => DevideFormat(row, item.Value, "total_defect").ToString() + "%"));
        }

        mapList.Add(new("mes_date", "MES일자", 12, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("mes_date")?.ToString("yyyy-MM-dd") ?? string.Empty; }));
        mapList.Add(new("start_dt", "4M등록 시간", 19, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("start_dt")?.ToString("yyyy-MM-dd HH:mm:ss") ?? string.Empty; }));
        mapList.Add(new("end_dt", "4M END 시간", 19, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("end_dt")?.ToString("yyyy-MM-dd HH:mm:ss") ?? string.Empty; }));

        using var excel = ExcelEx.ToExcel(dt, mapList);

        return Results.File(excel.GetAsByteArray(), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }

    [ManualMap]
    public static IResult ExcelDownWorkorder(DataTable dt, string fileName)
    {
        dt.Columns.Add("pnl_rate", typeof(double));
        dt.Columns.Add("worst_dpu", typeof(string));
        dt.Columns.Add("worst_rate", typeof(string));

        List<Tuple<string, string, double, Type, Func<DataRow, object>?>> mapList = new()
        {
            new("row_num", "NO", 20, typeof(string), null),
            new("match_panel_id", "PNL ID", 40, typeof(string), null),
            new("pnl_rate", "PNL불량율", 20, typeof(double), (row) => DevideFormat(row, "worst_total", "total_cnt").ToString() + "%"),
            new("judge_name", "WORST 불량", 45, typeof(string), null),
            new("worst_total", "DPU", 20, typeof(string), null),
            new("worst_rate", "WORST 불량율", 20, typeof(string), (row) => DevideFormat(row, "judge_cnt", "total_cnt").ToString() + "%"),
            new("scan_time", "SCAN 시간", 35, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("scan_time")?.ToString("yyyy-MM-dd HH:mm:ss") ?? string.Empty; }),
        };

        using var excel = ExcelEx.ToExcel(dt, mapList);

        return Results.File(excel.GetAsByteArray(), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }

    [ManualMap]
    public static IResult ExcelDownPanel(DataTable dt, string fileName)
    {

        List<Tuple<string, string, double, Type, Func<DataRow, object>?>> mapList = new()
        {
            new("row_id", "NO", 20, typeof(string), null),
            new("judge_name", "불량항목", 30, typeof(string), null),
            new("pnl_rate", "PNL DPU", 20, typeof(string), null),
            new("ng_rate", "불량 점유율", 20, typeof(string), null),
            new("eqp_name", "장비명", 20, typeof(string), null),
            new("scan_time", "SCAN 시간", 35, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("scan_time")?.ToString("yyyy-MM-dd HH:mm:ss") ?? string.Empty; }),
            new("roll_id", "ROLL ID", 25, typeof(string), null),
            new("oper_seq_no", "공순", 20, typeof(string), null),
            new("oper_description", "공정명", 40, typeof(string), null),
            new("eqp_description", "설비명", 40, typeof(string), null),
        };

        using var excel = ExcelEx.ToExcel(dt, mapList);

        return Results.File(excel.GetAsByteArray(), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }

    [ManualMap]
    public static double DevideFormat(DataRow row, string numCol, string denomCol)
    {
        return Math.Round(row.TypeCol<double>(UtilEx.ToSnake(numCol)) / row.TypeCol<double>(UtilEx.ToSnake(denomCol)) * 100, 2);
    }

    [ManualMap]
    public static double DevideFormatNotPercent(DataRow row, string numCol, string denomCol)
    {
        return Math.Round(row.TypeCol<double>(UtilEx.ToSnake(numCol)) / row.TypeCol<double>(UtilEx.ToSnake(denomCol)), 2);
    }
}
