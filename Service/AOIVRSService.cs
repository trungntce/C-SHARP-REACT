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

public class AOIVRSService : MinimalApiService, IMinimalApi
{
    static List<KeyValuePair<string, string>> _defectList = new() {
        new KeyValuePair<string, string>("None"             , "none")
    ,   new KeyValuePair<string, string>("Short_D/F"        , "shortDf")
    ,   new KeyValuePair<string, string>("Short_E/T"        , "shortEt")
    ,   new KeyValuePair<string, string>("Short_M/D"        , "shortMd")
    ,   new KeyValuePair<string, string>("Short_D/F_repair" , "shortDfRepair")
    ,   new KeyValuePair<string, string>("Short_E/T_repair" , "shortEtRepair")
    ,   new KeyValuePair<string, string>("Short_M/D"        , "shortMd6")
    ,   new KeyValuePair<string, string>("Open_D/F"         , "openDf")
    ,   new KeyValuePair<string, string>("Open_E/T"         , "openEt")
    ,   new KeyValuePair<string, string>("Open_madong"      , "openMadong")
    ,   new KeyValuePair<string, string>("Slit_D/F"         , "slitDf")
    ,   new KeyValuePair<string, string>("Slit_E/T"         , "slitEt")
    ,   new KeyValuePair<string, string>("Slit_madong"      , "slitMadong")
    ,   new KeyValuePair<string, string>("Open_qc"          , "openQc")
    ,   new KeyValuePair<string, string>("Dong_cuc"         , "dongCuc4")
    ,   new KeyValuePair<string, string>("Dong_cuc"         , "dongCuc5")
    ,   new KeyValuePair<string, string>("Pine_hole"        , "pineHole")
    ,   new KeyValuePair<string, string>("Lech_hole_D/F"    , "lechHoleDf")
    ,   new KeyValuePair<string, string>("Lech_hole_cnc"    , "lechHoleCnc")
    ,   new KeyValuePair<string, string>("Chua_mon"         , "chuaMon")
    ,   new KeyValuePair<string, string>("Tran_dong"        , "tranDong0")
    ,   new KeyValuePair<string, string>("Tran_dong"        , "tranDong1")
    ,   new KeyValuePair<string, string>("Tac_hole"         , "tacHole")
    ,   new KeyValuePair<string, string>("Tenting"          , "tenting")
    ,   new KeyValuePair<string, string>("Pjt"              , "pjt")
    ,   new KeyValuePair<string, string>("Khac"             , "khac")
    ,   new KeyValuePair<string, string>("Short_D/F_aor"    , "shortDfAor")
    ,   new KeyValuePair<string, string>("Short_E/T_aor"    , "shortEtAor")
    ,   new KeyValuePair<string, string>("Short_M/D_aor"    , "shortMdAor")
    ,   new KeyValuePair<string, string>("Dc_aor"           , "dcAor")
    ,   new KeyValuePair<string, string>("Aor"              , "aor")
    ,   new KeyValuePair<string, string>("Miss_feature"     , "missFeature")
    ,   new KeyValuePair<string, string>("Skip_pcb"         , "skipPcb")
    ,   new KeyValuePair<string, string>("Short_point"      , "shortPoint")
    };

    public AOIVRSService(ILogger<AOIVRSService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
		group.MapGet("/nglist", nameof(NGList));
        group.MapGet("/modeleqpng", nameof(ModelEqpNgList));
        group.MapGet("/detail", nameof(ListDetail));
        group.MapGet("/bypanel", nameof(ListByPanel));
        group.MapGet("/bypanellist", nameof(ListByPanelList));

        return RouteAllEndpoint(group);
    }

    public static IResult List(DateTime fromDt, DateTime toDt, string groupby, string? eqpCode, string? workorder, string? vendorCode, string? itemCode, string? itemName, string? modelCode, string? appCode, bool isExcel = false)
	{
        dynamic obj = new ExpandoObject();
       
        obj.FromDt      = SearchFromDt(fromDt);
        obj.ToDt        = SearchToDt(toDt);
		obj.EqpCode     = eqpCode;
		obj.Workorder   = workorder;
        obj.VendorCode  = vendorCode;
        obj.ItemCode    = itemCode;
        obj.ItemName    = itemName;
		obj.ModelCode   = modelCode;
		obj.AppCode     = appCode;
		obj.Groupby     = groupby;

		DataTable dt = DataContext.StringDataSet("@AOIVRS.List", RefineExpando(obj, true)).Tables[0];

        //Func<string, string> appFunc = ErpApplicationService.SelectCacheName;
        //FindLabel(dt, "appCode", "appName", appFunc);

        Func<string, string> eqpFunc = ErpEqpService.SelectCacheName;
        FindLabel(dt, "eqpCode", "eqpName", eqpFunc);

        if(!isExcel)
            return Results.Json(ToDic(dt));

        return ExcelDown(dt, "AOI_VRS검사DATA");
	}

    [ManualMap]
    public static IResult ListByPanel(string workorder, int? panelSeq)
    {
        dynamic obj = new ExpandoObject();

        obj.Workorder = workorder;
        obj.PanelSeq = panelSeq;

        DataTable dt = DataContext.StringDataSet("@AOIVRS.ListByPanel", RefineExpando(obj, true)).Tables[0];
        return Results.Json(ToDic(dt));
    }

    [ManualMap]
    public static IResult ListByPanelList(string workorder, string panelList)
    {
        dynamic obj = new ExpandoObject();

        obj.Workorder = workorder;
        obj.PanelList = panelList;

        DataTable dt = DataContext.StringDataSet("@AOIVRS.ListByPanel", RefineExpando(obj, true)).Tables[0];
        return Results.Json(ToDic(dt));
    }

    [ManualMap]
	public static IEnumerable<IDictionary> ListDetail(DateTime fromDt, DateTime toDt, string? bomItemCode, string? workorder, string? panel, string? ngName)
	{
		dynamic obj = new ExpandoObject();

		obj.FromDt = SearchFromDt(fromDt);
		obj.ToDt = SearchToDt(toDt);
        obj.ModelCode = bomItemCode;
        obj.Workorder = workorder;
        obj.Panel = panel;
        obj.NgName = ngName;

		DataTable dt = DataContext.StringDataSet("@AOIVRS.ListDetail", RefineExpando(obj, true)).Tables[0];

		return ToDic(dt);
	}

	[ManualMap]
    public static string ConcatDataTable(DataTable dt, string colName)
    {
        StringBuilder sb = new();

        for (int i = 0; i < dt.Rows.Count; i++)
        {
            DataRow row = dt.Rows[i];
            string value = row.TypeCol<string>(colName);

            if (i > 0)
                value = $",{value}";

            sb.Append(value);
        }

        return sb.ToString();
    }

	[ManualMap]
    public static IEnumerable<IDictionary> NGList(DateTime fromDt, DateTime toDt, string? workorder, string? ngName)
    {
        dynamic obj = new ExpandoObject();

		obj.FromDt = SearchFromDt(fromDt);
		obj.ToDt = SearchToDt(toDt);
		obj.Workorder   = workorder;
        obj.NgName      = ngName;

        DataTable dt = DataContext.StringDataSet("@AOIVRS.NGList", RefineParam(obj, true)).Tables[0];

		return ToDic(dt);
    }

    [ManualMap]
    public static IResult ModelEqpNgList(DateTime fromDt, DateTime toDt, string? eqpCode, string? itemCode, string? itemName, string? modelCode, string? operCode, bool isExcel = false)
    {
        if (string.IsNullOrWhiteSpace(eqpCode) || eqpCode.Trim() == "[]")
            eqpCode = null;

        dynamic obj = new ExpandoObject();

        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);
        obj.EqpCode = eqpCode;
        obj.ItemCode = itemCode;
        obj.ItemName = itemName;
        obj.ModelCode = modelCode;
        obj.OperCode = operCode;

        DataTable dt = DataContext.StringDataSet("@AOIVRS.ModelEqpNgList", RefineParam(obj, true)).Tables[0];

        FindLabel(dt, "prevEqpCode", "prevEqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

        if (!isExcel)
            return Results.Json(ToDic(dt));

        return ExcelDownModelEqpNg(dt, "AOIVRSNG");

    }

    [ManualMap]
    public static IResult ExcelDownModelEqpNg(DataTable dt, string fileName)
    {
        List<Tuple<string, string, double, Type, Func<DataRow, object>?>> mapList = new()
        {
            new("itemCode", "제품코드", 25, typeof(string), null),
            new("modelCode", "모델코드", 25, typeof(string), null),
            new("modelDescription", "모델명", 35, typeof(string), null),

            new("prevOperCode", "공정코드", 12, typeof(string), null),
            new("OperDescription", "공정명", 35, typeof(string), null),

            new("prevEqpCode", "장비코드", 20, typeof(string), null),
            new("prevEqpName", "장비명", 35, typeof(string), null),

            new("layer", "Layer", 10, typeof(string), null),

            new("createDt", "일시", 17, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("create_dt")?.ToString("yyyy-MM-dd HH:mm") ?? string.Empty; }),

            new("panelCnt", "PNL", 10, typeof(int), null),
            new("ngCnt", "DEFECT 수", 10, typeof(int), null),
            new(string.Empty, "DEFECT/PNL", 15, typeof(double), (row) => BBTService.DevideFormatNotPercent(row, "ngCnt", "panelCnt")),
        };

        foreach (var item in _defectList)
        {
            mapList.Add(new(item.Value, item.Key, 10, typeof(int), null));
            mapList.Add(new(string.Empty, "점유율", 15, typeof(double), (row) => BBTService.DevideFormat(row, item.Value, "ngCnt")));
        }

        using var excel = ExcelEx.ToExcel(dt, mapList);

        return Results.File(excel.GetAsByteArray(), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }

    [ManualMap]
    public static string DevideFormat(float a, float b) => $"{((a / b) * 100).ToString("F2")}%";

    [ManualMap]
    public static IResult ExcelDown(DataTable dt, string fileName)
    {
        string dt_json = JsonConvert.SerializeObject(dt);

        dynamic obj = new ExpandoObject();
        obj.json = dt_json;

        DataTable exDt = DataContext.StringDataSet("@AOIVRS.ExcelData", RefineExpando(obj)).Tables[0];

        List<Tuple<string, string, double, Type, Func<DataRow, object>?>> mapList = new()
        {
            new("mesdate", "일시", 35, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("mesdate")?.ToString("yyyy-MM-dd") ?? string.Empty; }),
            new("vendor_name", "고객사", 40, typeof(string), null),
            new("item_code", "제품코드", 50, typeof(string), null),
            new("item_name", "제품명", 50, typeof(string), null),
            new("model_code", "모델코드", 40, typeof(string), null),
            new("workorder", "BATCH", 40, typeof(string), null),
            new("eqp_code", "장비코드", 40, typeof(string), null),
            new("eqp_name", "장비명", 40, typeof(string), null),
            new("panel_cnt", "PNL", 20, typeof(int), null),
            new("ng_pcs_total", "PCS", 20, typeof(int), null),
            new("ngcnt", "Defect 수", 20, typeof(int), null),
            new("defect_pnl", "Defect / PNL", 20, typeof(float), null),
            new("ng_rate","불량률", 20, typeof(float), null),
            new("none", "None", 20, typeof(int), null),
            new("none_rate", "점유율", 20, typeof(string), null),
            new("short_df", "Short_D/F", 20, typeof(int), null),
            new("short_df_rate", "점유율", 20, typeof(float), null),
            new("short_et", "Short_E/T", 20, typeof(int), null),
            new("short_et_rate", "점유율", 20, typeof(float), null),
            new("short_md", "Short_M/D", 20, typeof(int), null),
            new("short_md_rate", "점유율", 20, typeof(float), null),
            new("short_df_repair", "Short_D/F_repair", 20, typeof(int), null),
            new("short_df_repair_rate", "점유율", 20, typeof(float), null),
            new("short_et_repair", "Short_E/T_repair", 20, typeof(int), null),
            new("short_et_repair_rate", "점유율", 20, typeof(float), null),
            new("short_md6", "Short_M/D", 20, typeof(int), null),
            new("short_md6_rate", "점유율", 20, typeof(float), null),
            new("open_df", "Open_D/F", 20, typeof(int), null),
            new("open_df_rate", "점유율", 20, typeof(float), null),
            new("open_et", "Open_E/T", 20, typeof(int), null),
            new("open_et_rate", "점유율", 20, typeof(float), null),
            new("open_madong", "Open_madong", 20, typeof(int), null),
            new("open_madong_rate", "점유율", 20, typeof(float), null),
            new("slit_df", "Slit_D/F", 20, typeof(int), null),
            new("slit_df_rate", "점유율", 20, typeof(float), null),
            new("slit_et", "Slit_E/T", 20, typeof(int), null),
            new("slit_et_rate", "점유율", 20, typeof(float), null),
            new("slit_madong", "Slit_madong", 20, typeof(int), null),
            new("slit_madong_rate", "점유율", 20, typeof(float), null),
            new("open_qc", "Open_qc", 20, typeof(int), null),
            new("open_qc_rate", "점유율", 20, typeof(float), null),
            new("dong_cuc4", "Dong_cuc", 20, typeof(int), null),
            new("dong_cuc4_rate", "점유율", 20, typeof(float), null),
            new("dong_cuc5", "Dong_cuc", 20, typeof(int), null),
            new("dong_cuc5_rate", "점유율", 20, typeof(float), null),
            new("pine_hole", "Pine_hole", 20, typeof(int), null),
            new("pine_hole_rate", "점유율", 20, typeof(float), null),
            new("lech_hole_df", "Lech_hole_D/F", 20, typeof(int), null),
            new("lech_hole_df_rate", "점유율", 20, typeof(float), null),
            new("lech_hole_cnc", "Lech_hole_cnc", 20, typeof(int), null),
            new("lech_hole_cnc_rate", "점유율", 20, typeof(float), null),
            new("chua_mon", "Chua_mon", 20, typeof(int), null),
            new("chua_mon_rate", "점유율", 20, typeof(float), null),
            new("tran_dong0", "Tran_dong", 20, typeof(int), null),
            new("tran_dong0_rate", "점유율", 20, typeof(float), null),
            new("tran_dong1", "Tran_dong", 20, typeof(int), null),
            new("tran_dong1_rate", "점유율", 20, typeof(float), null),
            new("tac_hole", "Tac_hole", 20, typeof(int), null),
            new("tac_hole_rate", "점유율", 20, typeof(float), null),
            new("tenting", "Tenting", 20, typeof(int), null),
            new("tenting_rate", "점유율", 20, typeof(float), null),
            new("pjt", "Pjt", 20, typeof(int), null),
            new("pjt_rate", "점유율", 20, typeof(float), null),
            new("khac", "Khac", 20, typeof(int), null),
            new("khac_rate", "점유율", 20, typeof(float), null),
            new("short_df_aor", "Short_D/F_aor", 20, typeof(int), null),
            new("short_df_aor_rate", "점유율", 20, typeof(float), null),
            new("short_et_aor", "Short_E/T_aor", 20, typeof(int), null),
            new("short_et_aor_rate", "점유율", 20, typeof(float), null),
            new("short_md_aor", "Short_M/D_aor", 20, typeof(int), null),
            new("short_md_aor_rate", "점유율", 20, typeof(float), null),
            new("dc_aor", "D_aor", 20, typeof(int), null),
            new("dc_aor_rate", "점유율", 20, typeof(float), null),
            new("aor", "Aor", 20, typeof(int), null),
            new("aor_rate", "점유율", 20, typeof(float), null),
            new("miss_feature", "Miss_feature", 20, typeof(int), null),
            new("miss_feature_rate", "점유율", 20, typeof(float), null),
            new("skip_pcb", "Skip_pcb", 20, typeof(int), null),
            new("skip_pcb_rate", "점유율", 20, typeof(float), null),
            new("short_point", "Short_point", 20, typeof(int), null),
            new("short_point_rate", "점유율", 20, typeof(float), null),
        };

        using var excel = ExcelEx.ToExcel(exDt, mapList);

        return Results.File(excel.GetAsByteArray(), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }
}
