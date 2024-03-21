namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Dynamic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using Framework;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Org.BouncyCastle.Ocsp;
using Newtonsoft.Json;
using System.Media;

public class AOIVRSDataService : MinimalApiService, IMinimalApi
{
    static List<KeyValuePair<string, string>> _defectList = new() {
        new KeyValuePair<string, string>("None"             , "none")
    ,   new KeyValuePair<string, string>("Open"        , "open")
    ,   new KeyValuePair<string, string>("Short"        , "short")
    ,   new KeyValuePair<string, string>("Khuyết 손상"        , "khuyet")
    ,   new KeyValuePair<string, string>("Khuyết phần trên 상부손상" , "khuyet_phan_tren")
    ,   new KeyValuePair<string, string>("Lồi 돌출" , "loi")
    ,   new KeyValuePair<string, string>("Foot"        , "foot")
    ,   new KeyValuePair<string, string>("Pit"         , "pit")
    ,   new KeyValuePair<string, string>("Dry film"         , "dry_film")
    ,   new KeyValuePair<string, string>("Lệch Hole 홀터짐"      , "lech_hole")
    ,   new KeyValuePair<string, string>("Pin Hole"         , "pin_hole")
    ,   new KeyValuePair<string, string>("Mạ tắc Hole 홀막힘"         , "ma_tac_hole")
    ,   new KeyValuePair<string, string>("Nhăn 주름"      , "nhan")
    ,   new KeyValuePair<string, string>("Biến màu 변색"          , "bien_mau")
    ,   new KeyValuePair<string, string>("Chấm đen 흑점"         , "cham_den")
    ,   new KeyValuePair<string, string>("Quá ET 과에칭"         , "qua_et")
    ,   new KeyValuePair<string, string>("Dị vật 이물"        , "di_vat")
    ,   new KeyValuePair<string, string>("Tenting"    , "tenting")
    ,   new KeyValuePair<string, string>("GAI ĐỒNG 돌기"    , "gai_dong")
    ,   new KeyValuePair<string, string>("Ngấm dung dịch 액터짐"         , "ngam_dung_dich")
    ,   new KeyValuePair<string, string>("Dimple"        , "dimple")
    ,   new KeyValuePair<string, string>("Void"        , "void")
    ,   new KeyValuePair<string, string>("CUP 동표면 이상"         , "cup")
    ,   new KeyValuePair<string, string>("Tràn đồng 잔동"          , "tran_dong")
    ,   new KeyValuePair<string, string>("KHAC 기타"          , "khac")
    //,   new KeyValuePair<string, string>("Pjt"              , "pjt")
    //,   new KeyValuePair<string, string>("Khac"             , "khac")
    //,   new KeyValuePair<string, string>("Short_D/F_aor"    , "short_df_aor")
    //,   new KeyValuePair<string, string>("Short_E/T_aor"    , "short_et_aor")
    //,   new KeyValuePair<string, string>("Short_M/D_aor"    , "short_md_aor")
    //,   new KeyValuePair<string, string>("Dc_aor"           , "dc_aor")
    //,   new KeyValuePair<string, string>("Aor"              , "aor")
    //,   new KeyValuePair<string, string>("Miss_feature"     , "miss_feature")
    //,   new KeyValuePair<string, string>("Skip_pcb"         , "skip_pcb")
    //,   new KeyValuePair<string, string>("Short_point"      , "short_point")
    };

    public AOIVRSDataService(ILogger<AOIVRSDataService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
		group.MapGet("/nglist", nameof(NGList)); 
        group.MapGet("/bypanel", nameof(ListByPanel));

        return RouteAllEndpoint(group);
    }

    public static IResult List(DateTime fromDt, DateTime toDt, string groupby, string? eqpCode, string? workorder, string? itemCode, string? itemName, string? modelCode, string? appCode, bool isExcel = false)
	{
        dynamic obj = new ExpandoObject();
       
        obj.FromDt      = SearchFromDt(fromDt);
        obj.ToDt        = SearchToDt(toDt);
        obj.EqpCode     = string.IsNullOrEmpty(eqpCode) ? "" : eqpCode;
		obj.Workorder   = string.IsNullOrEmpty(workorder) ? "" : workorder;
        obj.ItemCode    = string.IsNullOrEmpty(itemCode) ? "" : itemCode;
        obj.ItemName    = string.IsNullOrEmpty(itemName) ? "" : itemName;
		obj.ModelCode   = string.IsNullOrEmpty(modelCode) ? "" : modelCode;
		obj.AppCode     = string.IsNullOrEmpty(appCode) ? "" : appCode;
		obj.Groupby     = string.IsNullOrEmpty(groupby) ? "" : groupby;

		DataTable dt = DataContext.DataSet("dbo.sp_aoi_vrs_data_list", RefineExpando(obj, false)).Tables[0];

        Func<string, string> eqpFunc = ErpEqpService.SelectCacheName;
        FindLabel(dt, "eqpCode", "eqpName", eqpFunc);

        if(!isExcel)
            return Results.Json(ToDic(dt));

        return ExcelDown(dt, "AOI_VRS검사DATA");
	}

    [ManualMap]
    public static IResult NGList(DateTime fromDt, DateTime toDt, string? workorder, string? modelCode, string? eqpCode, string? eqpName, string? operCode, bool isExcel = false)
    {
        dynamic obj = new ExpandoObject();

        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);
        obj.Workorder = workorder;
        obj.ModelCode = modelCode;
        obj.OperCode = operCode;
        obj.EqpCode = eqpCode;
        if (eqpName != null && eqpName != "") obj.EqpName = eqpName;

        DataTable dt = DataContext.DataSet("dbo.sp_aoi_panel_ng_list", RefineParam(obj, false)).Tables[0];

        if (!isExcel)
            return Results.Json(ToDic(dt));

        return ExcelPanelListDown(dt, "AOI_VRS검사BATCH_DATA");


        //DataTable dtEx = DataContext.StringDataSet("@AOIVRSData.NGListEx", RefineParam(obj, true)).Tables[0];

        //if (!isExcel)
        //    return Results.Json(ToDic(dtEx));

        //return ExcelPanelListDown(dtEx, "AOI_VRS검사BATCH_DATA");
    }

    [ManualMap]
    public static IResult ListByPanel(DateTime fromDt, DateTime toDt, string? workorder, string? pnlId, string? operCode, string? modelCode, string? eqpCode, string? eqpName, bool isExcel = false)
    {
        dynamic obj = new ExpandoObject();
        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);
        obj.Workorder = workorder;
        obj.PnlId = pnlId;
        obj.OperCode = operCode;
        obj.ModelCode = modelCode;
        obj.EqpCode = eqpCode;
        if (eqpName != null && eqpName != "") obj.EqpName = eqpName;

        DataTable dt1 = DataContext.StringDataSet("@AOIVRSData.ListByPanel", RefineExpando(obj, true)).Tables[0];
        DataTable dt2 = DataContext.StringDataSet("@AOIVRSData.ListEqpByPanel", RefineExpando(obj, true)).Tables[0];


        //List<DataTable> dataTables = new List<DataTable>();
        //dataTables.Add(dt1);
        //dataTables.Add(dt2);

        DataTable dataTable = new DataTable();

        dataTable.Columns.Add("row_id", typeof(string));
        dataTable.Columns.Add("ng_name", typeof(string));
        dataTable.Columns.Add("total_cnt", typeof(string));
        dataTable.Columns.Add("ng_rate", typeof(string));
        dataTable.Columns.Add("eqp_name", typeof(string));
        dataTable.Columns.Add("scan_dt", typeof(string));
        dataTable.Columns.Add("roll_id", typeof(string));
        dataTable.Columns.Add("oper_seq_no", typeof(string));
        dataTable.Columns.Add("oper_description", typeof(string));
        dataTable.Columns.Add("eqp_description", typeof(string)); 

        var rowNum = dt1.Rows.Count > dt2.Rows.Count ? dt1.Rows.Count : dt2.Rows.Count;

        for (int i = 0; i < rowNum; i++)
        {
            DataRow row = dataTable.NewRow();

            row["row_id"] = dt1.Rows.Count >= i + 1 ? dt1.Rows[i]["row_id"] : "";
            row["ng_name"] = dt1.Rows.Count >= i + 1 ? dt1.Rows[i]["ng_name"] : "";
            row["total_cnt"] = dt1.Rows.Count >= i + 1 ? dt1.Rows[i]["total_cnt"] : "";
            row["ng_rate"] = dt1.Rows.Count >= i + 1 ? DevideFormat(dt1.Rows[i], "ng_cnt", "total_ng").ToString() + "%" : "";
            row["eqp_name"] = dt1.Rows.Count >= i + 1 ? dt1.Rows[i]["eqp_name"] : "";
            row["scan_dt"] = dt1.Rows.Count >= i + 1 ? dt1.Rows[i].TypeCol<DateTime?>("scan_dt")?.ToString("yyyy-MM-dd HH:mm:ss") : string.Empty;
            row["roll_id"] = dt1.Rows.Count >= i + 1 ? dt1.Rows[i]["roll_id"] : "";
            row["oper_seq_no"] = dt2.Rows.Count >= i + 1 ? dt2.Rows[i]["oper_seq_no"] : "";
            row["oper_description"] = dt2.Rows.Count >= i + 1 ? dt2.Rows[i]["oper_description"] : "";
            row["eqp_description"] = dt2.Rows.Count >= i + 1 ? dt2.Rows[i]["eqp_description"] : "";

            dataTable.Rows.Add(row);
        }

        if (!isExcel)
            return Results.Json(ToDic(dataTable));

        return ExcelByPanelDown(dataTable, "AOI_VRS검사PNL_DATA");
    }

    [ManualMap]
    public static double CurrencyFormat(DataRow row, string numCol, string denomCol)
    {
        return Math.Round(row.TypeCol<double>(UtilEx.ToSnake(numCol)) / row.TypeCol<double>(UtilEx.ToSnake(denomCol)), 2);
    }

    [ManualMap]
    public static double DevideFormat(DataRow row, string numCol, string denomCol)
    {
        return Math.Round(row.TypeCol<double>(UtilEx.ToSnake(numCol)) / row.TypeCol<double>(UtilEx.ToSnake(denomCol)) * 100, 2);
    }

    [ManualMap]
    public static IResult ExcelDown(DataTable dt, string fileName)
    {
        dt.Columns.Add("defect_rate", typeof(double));

        List<Tuple<string, string, double, Type, Func<DataRow, object>?>> mapList = new()
        {
            //new("item_code", "제품코드", 50, typeof(string), null),
            new("item_name", "제품명", 50, typeof(string), null),
            new("model_code", "모델코드", 40, typeof(string), null),
            new("workorder", "BATCH", 40, typeof(string), null),
            new("app_name", "공정명", 40, typeof(string), null),
            //new("eqp_code", "장비코드", 40, typeof(string), null),
            new("eqp_name", "장비명", 40, typeof(string), null),
            //new("layer", "Layer", 40, typeof(string), null),
            new("pcs_total", "총 검사수량(PCS)", 20, typeof(int), null),
            new("panel_qty", "PNL", 20, typeof(int), null),
            new("ng_pcs_total", "불량수량(PCS)", 20, typeof(int), null),
            new("ng_rate","불량율BATCH", 20, typeof(string), (row) => DevideFormat(row, "ng_pcs_total", "pcs_total").ToString() + "%"),
            new("std_rate","기준불량율", 20, typeof(float), null),
            new("ng_cnt", "Defect 수", 20, typeof(int), null),
            new("defect_rate", "DPU", 20, typeof(double), (row) => CurrencyFormat(row, "ng_cnt", "panel_qty")),

        };

        foreach (var item in _defectList)
        {
            dt.Columns.Add(item.Value + "_df_rate", typeof(double));
            dt.Columns.Add(item.Value + "_dpu", typeof(double));

            mapList.Add(new(item.Value, item.Key + " 수량", 10, typeof(int), null));
            mapList.Add(new(item.Value + "_rate", item.Key + " 기준DPU", 10, typeof(double), null));
            mapList.Add(new(item.Value + "_dpu", item.Key + " DPU", 10, typeof(double), (row) => DevideFormat(row, item.Value, "panel_qty")));
            mapList.Add(new(item.Value + "_df_rate", item.Key + " 점유율", 15, typeof(string), (row) => DevideFormat(row, item.Value, "pcs_total").ToString() + "%"));
        }

        mapList.Add(new("mesdate", "MES일자", 35, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("mesdate")?.ToString("yyyy-MM-dd") ?? string.Empty; }));
        mapList.Add(new("start_dt", "4M등록 시간", 35, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("start_dt")?.ToString("yyyy-MM-dd HH:mm:ss") ?? string.Empty; }));
        mapList.Add(new("end_dt", "4M END 시간", 35, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("end_dt")?.ToString("yyyy-MM-dd HH:mm:ss") ?? string.Empty; }));

        using var excel = ExcelEx.ToExcel(dt, mapList);

        return Results.File(excel.GetAsByteArray(), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }

    [ManualMap]
    public static IResult ExcelPanelListDown(DataTable dt, string fileName)
    {
        dt.Columns.Add("pnl_rate", typeof(string));
        dt.Columns.Add("worst_rate", typeof(string));

        List<Tuple<string, string, double, Type, Func<DataRow, object>?>> mapList = new()
        {
            new("row_id", "NO", 20, typeof(string), null),
            new("pnl_id", "PNL ID", 40, typeof(string), null),
            new("pnl_rate", "PNL불량율", 20, typeof(string), (row) => DevideFormat(row, "total_ng", "pcs_total").ToString() + "%"),
            new("total_ng", "DPU", 20, typeof(double), null),
            new("worst_name", "WORST 불량", 45, typeof(string), null),
            new("worst_rate", "WORST 불량율", 20, typeof(string), (row) => DevideFormat(row, "worst_cnt", "pcs_total").ToString() + "%"),
            new("scan_dt", "SCAN 시간", 35, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("scan_dt")?.ToString("yyyy-MM-dd HH:mm:ss") ?? string.Empty; }),
        };

        using var excel = ExcelEx.ToExcel(dt, mapList);

        return Results.File(excel.GetAsByteArray(), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }

    [ManualMap]
    public static IResult ExcelByPanelDown(DataTable dt, string fileName)
    {
        List <Tuple<string, string, double, Type, Func<DataRow, object>?>> mapList = new()
        {
            new("row_id", "NO", 20, typeof(string), null),
            new("ng_name", "불량항목", 30, typeof(string), null),
            new("total_cnt", "PNL DPU", 20, typeof(string), null),
            new("ng_rate", "불량 점유율", 20, typeof(string), null),
            new("eqp_name", "장비명", 30, typeof(string), null),
            new("scan_dt", "SCAN 시간", 35, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("scan_dt")?.ToString("yyyy-MM-dd HH:mm:ss") ?? string.Empty; }),
            new("roll_id", "ROLL ID", 25, typeof(string), null),
            new("oper_seq_no", "공순", 20, typeof(string), null),
            new("oper_description", "공정명", 40, typeof(string), null),
            new("eqp_description", "설비명", 40, typeof(string), null),
        };

        using var excel = ExcelEx.ToExcel(dt, mapList);

        return Results.File(excel.GetAsByteArray(), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }
}
