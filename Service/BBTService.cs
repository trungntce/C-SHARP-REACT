namespace WebApp;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Drawing.Printing;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.WebSockets;
using System.Text;
using System.Text.RegularExpressions;
using Framework;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OfficeOpenXml;

public class BBTService : MinimalApiService, IMinimalApi
{
	static List<KeyValuePair<string, string>> _defectList = new() {
		new KeyValuePair<string, string>("4WNG"			, "raw4wng"),
		new KeyValuePair<string, string>("SHORT"        , "rawshort"),
		new KeyValuePair<string, string>("SHORTS2"      , "rawshorts2"),
		new KeyValuePair<string, string>("uSH2"			, "rawush2"),
		new KeyValuePair<string, string>("4WNG uSH2"    , "raw4wngush2"),
		new KeyValuePair<string, string>("OPEN"			, "rawopen"),
		new KeyValuePair<string, string>("OPEN SHORTS"  , "rawopenshorts"),
		new KeyValuePair<string, string>("uSH1"			, "rawush1"),
		new KeyValuePair<string, string>("AUX"			, "rawaux"),
		new KeyValuePair<string, string>("4WNG SHORT"   , "raw4wngshort"),
		new KeyValuePair<string, string>("OPEN SHORT"   , "rawopenshort"),
		new KeyValuePair<string, string>("OPEN SPARK"   , "rawopenspark"),
		new KeyValuePair<string, string>("SPARK"        , "rawspark"),
		new KeyValuePair<string, string>("4WNG SPARK"   , "raw4wngspark"),
		new KeyValuePair<string, string>("OPEN uSH2"    , "rawopenush2"),
		new KeyValuePair<string, string>("4WNG SHORTS"  , "raw4wngshorts"),
		new KeyValuePair<string, string>("4WNG uSH1"    , "raw4wngush1"),
		new KeyValuePair<string, string>("SHORTS"       , "rawshorts"),
		new KeyValuePair<string, string>("C"			, "rawc"),
		new KeyValuePair<string, string>("ERROR"        , "rawerror"),
		new KeyValuePair<string, string>("OPEN uSH1"    , "rawopenush1")
	};

	public BBTService(ILogger<BBTService> logger) : base(logger)
	{
	}

	public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
	{
		group.MapGet("/detail", nameof(ListDetail));
		group.MapGet("/ng", nameof(NgList));
		group.MapGet("/bypanel", nameof(ListByPanel));

		return RouteAllEndpoint(group);
	}

	public static IResult List(DateTime fromDt, DateTime toDt, string groupby, string? eqpCode, string? workorder, string? vendorCode, string? itemCode, string? itemName, string? modelCode, string? appCode, string? panelId, bool isExcel = false, string? type = null, string? orderby = "DT")
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
		obj.Groupby = groupby;
		obj.Orderby = orderby;
		obj.PanelId = panelId;

		DataTable dt = DataContext.StringDataSet("@BBT.List", RefineExpando(obj, true)).Tables[0];

		if (type == "list")
		{
			if (dt.Rows.Count > 0)
				dt = dt.Select($"ng_rate < 20").OrderByDescending(x => x.Field<DateTime>("create_dt")).CopyToDataTable();
		}

		if (!isExcel)
			return Results.Json(ToDic(dt));

		return ExcelDown(dt, "BBT", groupby);
	}

	[ManualMap]
	public static IResult ListByPanel(string workorder, int? panelSeq)
	{
		dynamic obj = new ExpandoObject();

		obj.Workorder = workorder;
		obj.PanelSeq = panelSeq;

		DataTable dt = DataContext.StringDataSet("@BBT.ListByPanel", RefineExpando(obj, true)).Tables[0];
		return Results.Json(ToDic(dt));
	}

	[ManualMap]
	public static IResult NgList(DateTime fromDt, DateTime toDt, string? eqpCode, string? itemCode, string? itemName, string? modelCode, string? operCode, bool isExcel = false)
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

		DataTable dt = DataContext.StringDataSet("@BBT.NgList", RefineExpando(obj, true)).Tables[0];

		FindLabel(dt, "prevEqpCode", "prevEqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

		if (!isExcel)
			return Results.Json(ToDic(dt));

		return ExcelDownNg(dt, "BBTNG");
	}

	[ManualMap]
	public static IResult ListDetail(DateTime fromDt, DateTime toDt, char type, int pageNo, int pageSize, string? eqpId, string? workorder, string? vendorCode, string? itemCode, string? itemName, string? modelCode, string? appCode, string? panelId, bool isExcel = false)
	{
		dynamic obj = new ExpandoObject();

		obj.FromDt = SearchFromDt(fromDt);
		obj.ToDt = SearchToDt(toDt);
		obj.EqpId = eqpId;
		obj.Workorder = workorder;
		obj.VendorCode = vendorCode;
		obj.ItemCode = itemCode;
		obj.ItemName = itemName;
		obj.ModelCode = modelCode;
		obj.AppCode = appCode;
		obj.PanelId = panelId;
		obj.Type = type;
		obj.PageNo = pageNo;
		obj.PageSize = pageSize;

		var dt = DataContext.StringDataSet("@BBT.ListDetail", RefineExpando(obj, true)).Tables[0];

		if (!isExcel)
			return Results.Json(ToDic(dt));

		return DetailExcelDown(dt, "BBT-Detail");
	}

	[ManualMap]
	public static IResult ExcelDown(DataTable dt, string fileName, string groupby)
	{
		List<Tuple<string, string, double, Type, Func<DataRow, object>?>> mapList = new()
		{
            new("mesDate", "MES일자", 12, typeof(string), null),
			new("createDt", "등록일시", 19, typeof(DateTime), null),
            new("startDt", "시작일시", 19, typeof(DateTime), null),
            new("endDt", "종료일시", 19, typeof(DateTime), null),
            new("vendorCode", "고객코드", 20, typeof(string), null),
			new("vendorName", "고객사", 35, typeof(string), null),
			new("itemCode", "제품코드", 25, typeof(string), null),
			new("itemName", "제품명", 40, typeof(string), null),
			new("modelCode", "모델코드", 30, typeof(string), null),
			new("workorder", "LOT", 35, typeof(string), null),
			new("panelId", "PANEL No", 35, typeof(string), null),
            new("matchPanelId", "PANEL ID", 35, typeof(string), null),
            new("eqpCode", "장비코드", 20, typeof(string), null),
			new("eqpName", "장비명", 35, typeof(string), null),
			new("appCode", "Application코드", 20, typeof(string), null),
			new("appName", "Application명", 30, typeof(string), null),

			new("panelCnt", "PNL", 10, typeof(int), null),
			new("totalCnt", "PCS", 10, typeof(int), null),
			new("ngCnt", "불량", 10, typeof(int), null),
			new(string.Empty, "불량률", 15, typeof(double), (row) => DevideFormat(row, "ngCnt", "totalCnt")),

			new("4w_cnt", "4W", 10, typeof(int), null),
			new(string.Empty, "불량률", 15, typeof(double), (row) => DevideFormat(row, "4w_cnt", "totalCnt")),

			new("aux_cnt", "Aux", 10, typeof(int), null),
			new(string.Empty, "불량률", 15, typeof(double), (row) => DevideFormat(row, "aux_cnt", "totalCnt")),

			new("both_cnt", "Both", 10, typeof(int), null),
			new(string.Empty, "불량률", 15, typeof(double), (row) => DevideFormat(row, "both_cnt", "totalCnt")),

			new("c_cnt", "C", 10, typeof(int), null),
			new(string.Empty, "불량률", 15, typeof(double), (row) => DevideFormat(row, "c_cnt", "totalCnt")),

			new("er_cnt", "ER", 10, typeof(int), null),
			new(string.Empty, "불량률", 15, typeof(double), (row) => DevideFormat(row, "er_cnt", "totalCnt")),

			new("open_cnt", "Open", 10, typeof(int), null),
			new(string.Empty, "불량률", 15, typeof(double), (row) => DevideFormat(row, "open_cnt", "totalCnt")),

			new("spk_cnt", "SPK", 10, typeof(int), null),
			new(string.Empty, "불량률", 15, typeof(double), (row) => DevideFormat(row, "spk_cnt", "totalCnt")),

			new("short_cnt", "Short", 10, typeof(int), null),
			new(string.Empty, "불량률", 15, typeof(double), (row) => DevideFormat(row, "short_cnt", "totalCnt"))
		};

		switch (groupby)
		{
			case "VENDOR":
				mapList.RemoveAll(x =>
				{
					return
						x.Item1 == "itemCode" ||
						x.Item1 == "itemName" ||
						x.Item1 == "modelCode" ||
						x.Item1 == "workorder" ||
						x.Item1 == "panelId" ||
                        x.Item1 == "matchPanelId";
				});
				break;
			case "ITEM":
				mapList.RemoveAll(x =>
				{
					return
						x.Item1 == "modelCode" ||
						x.Item1 == "workorder" ||
						x.Item1 == "panelId" ||
                        x.Item1 == "matchPanelId";
				});
				break;
			case "MODEL":
				mapList.RemoveAll(x =>
				{
					return
						x.Item1 == "workorder" ||
						x.Item1 == "panelId" ||
                        x.Item1 == "matchPanelId";
				});
				break;
			case "LOT":
				mapList.RemoveAll(x =>
				{
					return
						x.Item1 == "panelId" ||
                        x.Item1 == "matchPanelId";
				});
				break;
			case "PANEL":
				break;
			case "EQP":
				mapList.RemoveAll(x =>
				{
					return
						x.Item1 == "vendorCode" ||
						x.Item1 == "vendorName" ||
						x.Item1 == "itemCode" ||
						x.Item1 == "itemName" ||
						x.Item1 == "modelCode" ||
						x.Item1 == "workorder" ||
						x.Item1 == "panelId" ||
                        x.Item1 == "matchPanelId";
				});
				break;
		}

		foreach (var item in _defectList)
		{
			mapList.Add(new(item.Value, item.Key, 10, typeof(int), null));
			mapList.Add(new(string.Empty, "불량률", 15, typeof(double), (row) => DevideFormat(row, item.Value, "totalCnt")));
		}

		using var excel = ExcelEx.ToExcel(dt, mapList);

		return Results.File(excel.GetAsByteArray(), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
	}

	[ManualMap]
	public static IResult ExcelDownNg(DataTable dt, string fileName)
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

			new("createDt", "일시", 17, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("create_dt")?.ToString("yyyy-MM-dd HH:mm") ?? string.Empty; }),

			new("panelCnt", "PNL", 10, typeof(int), null),
			new("totalCnt", "PCS", 10, typeof(int), null),
			new("ngCnt", "불량", 10, typeof(int), null),
			new(string.Empty, "불량률", 15, typeof(double), (row) => DevideFormat(row, "ngCnt", "totalCnt")),

			new("4w_cnt", "4W", 10, typeof(int), null),
			new(string.Empty, "불량률", 15, typeof(double), (row) => DevideFormat(row, "4w_cnt", "totalCnt")),

			new("aux_cnt", "Aux", 10, typeof(int), null),
			new(string.Empty, "불량률", 15, typeof(double), (row) => DevideFormat(row, "aux_cnt", "totalCnt")),

			new("both_cnt", "Both", 10, typeof(int), null),
			new(string.Empty, "불량률", 15, typeof(double), (row) => DevideFormat(row, "both_cnt", "totalCnt")),

			new("c_cnt", "C", 10, typeof(int), null),
			new(string.Empty, "불량률", 15, typeof(double), (row) => DevideFormat(row, "c_cnt", "totalCnt")),

			new("er_cnt", "ER", 10, typeof(int), null),
			new(string.Empty, "불량률", 15, typeof(double), (row) => DevideFormat(row, "er_cnt", "totalCnt")),

			new("open_cnt", "Open", 10, typeof(int), null),
			new(string.Empty, "불량률", 15, typeof(double), (row) => DevideFormat(row, "open_cnt", "totalCnt")),

			new("spk_cnt", "SPK", 10, typeof(int), null),
			new(string.Empty, "불량률", 15, typeof(double), (row) => DevideFormat(row, "spk_cnt", "totalCnt")),

			new("short_cnt", "Short", 10, typeof(int), null),
			new(string.Empty, "불량률", 15, typeof(double), (row) => DevideFormat(row, "short_cnt", "totalCnt"))
		};

		foreach (var item in _defectList)
		{
			mapList.Add(new(item.Value, item.Key, 10, typeof(int), null));
			mapList.Add(new(string.Empty, "불량률", 15, typeof(double), (row) => DevideFormat(row, item.Value, "totalCnt")));
		}

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

	[ManualMap]
	public static IResult DetailExcelDown(DataTable dt, string fileName)
	{
		List<Tuple<string, string, double, Type, Func<DataRow, object>?>> mapList = new()
		{
			new("mesDate", "일자", 12, typeof(string), null),
			new("vendorCode", "고객코드", 20, typeof(string), null),
			new("vendorName", "고객사", 35, typeof(string), null),
			new("itemCode", "제품코드", 25, typeof(string), null),
			new("itemName", "제품명", 40, typeof(string), null),
			new("modelCode", "모델코드", 30, typeof(string), null),
			new("workorder", "LOT", 35, typeof(string), null),
			new("panelId", "PANEL No", 35, typeof(string), null),
            new("matchPanelId", "PANEL ID", 35, typeof(string), null),
            new("eqpCode", "장비코드", 20, typeof(string), null),
			new("eqpName", "장비명", 35, typeof(string), null),
			new("appCode", "Application코드", 20, typeof(string), null),
			new("appName", "Application명", 30, typeof(string), null),
			new("panelSeq", "PNL", 10, typeof(string), null),
			new("pieceNo", "PCS", 10, typeof(string), null),
			new("lslUslJudge", "결과", 12, typeof(string), null),
			new("pinJudge", "판정", 12, typeof(string), null),
			new("pinA", "Pin A", 10, typeof(string), null),
			new("pinB", "Pin B", 10, typeof(string), null),
			new("lsl", "LSL", 15, typeof(float), null),
			new("usl", "USL", 15, typeof(float), null),
			new("inspVal", "측정값", 15, typeof(float), null),
			new("mpdInspVal", "측정값(MPD)", 15, typeof(float), null),
		};

		using var excel = ExcelEx.ToExcel(dt, mapList);

		return Results.File(excel.GetAsByteArray(), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
	}
}
