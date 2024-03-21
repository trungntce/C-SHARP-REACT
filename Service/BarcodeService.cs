namespace WebApp;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Drawing.Printing;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.WebSockets;
using System.Text;
using System.Xml.Linq;
using Framework;
using k8s.KubeConfigModels;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OfficeOpenXml;
using Unity.Interception.Utilities;
using YamlDotNet.Core.Tokens;

public class BarcodeService : MinimalApiService, IMinimalApi, Map.IMap
{
    public BarcodeService(ILogger<BarcodeService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/error", nameof(ErrorList));
        group.MapGet("/recognition", nameof(RecognitionList));

        group.MapGet("/reader", nameof(ReaderList));                                //리더기 가동현황
        group.MapPost("/readerusupdate", nameof(ReaderListUpdate));                 //리더기 가동현황

        group.MapGet("/epstatus", nameof(EpStatusList));                              //ep 가동현황
        group.MapPost("/epstatusupdate", nameof(EpStatusListUpdate));                 //ep 가동현황

        group.MapGet("/communicationstatus", nameof(EqpCommunicationStatusList));               //설비 상태
        group.MapPost("/communicationstatusupdate", nameof(EqpCommunicationStatusListUpdate));  //설비 상태
        group.MapGet("/getvrseqpdt", nameof(GetVrsEqpDt));                                      //설비 상태        

        group.MapGet("/mespnaelitemlist", nameof(MesPnaelItemList));
        


        return RouteAllEndpoint(group);
    }
    
    public static IResult List(DateTime fromDt, DateTime toDt, string? panelId, string? workorder, string? itemCode, string? itemName , string? modelCode, string? modelName, bool isExcel = false)
    {
        dynamic obj = new ExpandoObject();

        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);
        obj.PanelId = panelId;
        obj.Workorder = workorder;
        obj.ItemCode = itemCode;
        obj.ItemName = itemName;
        obj.ModelCode= modelCode;
        obj.ModelName= modelName;

        var dt = DataContext.StringDataSet("@Barcode.List", RefineExpando(obj, true)).Tables[0];

        FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

        if (!isExcel)
            return Results.Json(ToDic(dt));

        return ExcelDown(dt, "Barcode");
    }

    [ManualMap]
    public static IResult ErrorList(DateTime fromDt, DateTime toDt, string? eqpCode, string? ipAddr, bool isExcel = false)
    {
        dynamic obj = new ExpandoObject();

        obj.FromDt = fromDt;
        obj.ToDt = toDt.AddDays(1);
        obj.EqpCode = eqpCode;
        obj.IpAddr = ipAddr;

        var dt = DataContext.StringDataSet("@Barcode.ErrorList", RefineExpando(obj, true)).Tables[0];

        FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

        if (!isExcel)
            return Results.Json(ToDic(dt));

        return ErrorExcelDown(dt, "BarcodeError");
    }

    [ManualMap]
    public static IResult ReaderList(string? deviceName, string? deviceId, string? readerStatus, bool isExcel = false)
    {
        dynamic obj = new ExpandoObject();

        obj.DeviceName = deviceName;
        obj.DeviceId = deviceId;
        obj.readerStatus = readerStatus;

        // 바코드 리더기 조회
        var dt = DataContext.StringDataSet("@Barcode.ReaderList", RefineExpando(obj, true)).Tables[0];

        //var healthCheck = HealthCheckService.List(null, null, deviceId, null, null);

        if (!isExcel)
        {
            return Results.Json(ToDic(dt));
        }

        return ReaderListExelDown(dt, "EPLIST");
    }

    [ManualMap]
    public static IResult ReaderListExelDown(DataTable dt, string fileName)
    {
        Dictionary<string, string> colDic = new()
        {
            { "hc_code", "Device ID" },
            { "hc_name", "Device 명" },
            { "workcenter_description", "작업자명" },
            { "last_dt", "마지막 응답시간" },
            { "status", "상태" },
        };

        return Results.File(ExcelEx.ToExcelSimple(dt, colDic), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }

    [ManualMap]
    public static int ReaderListUpdate([FromBody] IDictionary dic)
    {
        string rawJson = dic.TypeKey<string>("rawJson");

        var rawList = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(rawJson);

        int result = 0;

        if (rawList.Count > 0)
        {
            dynamic obj = new ExpandoObject();
            obj.Json = rawJson;

            // 바코드 리더기 로우 업데이트
            result = DataContext.StringNonQuery("@Barcode.ReaderListUpdate", RefineExpando(obj));
        }
        return result;
    }

    [ManualMap] 
    public static IResult EpStatusList(string? deviceName, string? deviceId, string? readerStatus, bool isExcel = false)
    {
        dynamic obj = new ExpandoObject();

        obj.DeviceName = deviceName;
        obj.DeviceId = deviceId;
        obj.readerStatus = readerStatus;

        // ep 가동현황 조회
        var dt = DataContext.StringDataSet("@Barcode.EpStatusList", RefineExpando(obj, true)).Tables[0];

        //var healthCheck = HealthCheckService.List(null, null, deviceId, null, null);

        if (!isExcel)
        {
            return Results.Json(ToDic(dt));
        }

        return EpStatusListtExelDown(dt, "EPLIST");
    }

    [ManualMap]
    public static IResult EpStatusListtExelDown(DataTable dt, string fileName)
    {
        Dictionary<string, string> colDic = new()
        {
            { "hc_code", "Device ID" },
            { "hc_name", "Device 명" },
            { "workcenter_description", "작업자명" },
            { "last_dt", "마지막 응답시간" },
            { "status", "상태" },
        };

        return Results.File(ExcelEx.ToExcelSimple(dt, colDic), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }

    [ManualMap]
    public static int EpStatusListUpdate([FromBody] IDictionary dic)
    {
        string rawJson = dic.TypeKey<string>("rawJson");

        var rawList = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(rawJson);

        int result = 0;

        if (rawList.Count > 0)
        {
            dynamic obj = new ExpandoObject();
            obj.Json = rawJson;


            DataContext.StringNonQuery("@Barcode.EpStatusListDownInsert", RefineExpando(obj));
            // ep 가동현황 로우 업데이트
            result = DataContext.StringNonQuery("@Barcode.EpStatusListUpdate", RefineExpando(obj));
        }
        return result;
    }

    [ManualMap]
    public static IEnumerable<IDictionary> EqpCommunicationStatusList(string? eqpCode,string ? eqpName, string? commStatus)
    {
        dynamic obj = new ExpandoObject();
        obj.EqpCode = eqpCode;
        obj.EqpName = eqpName;
        obj.CommStatus = commStatus;
        obj.Run = "run";
        obj.Failure = "failure";
        obj.Down = "down";
        // 설비 통신 상태 조회
        var dt = DataContext.StringDataSet("@Barcode.CommunicationStatusList", RefineExpando(obj, true)).Tables[0];

        //var healthCheck = HealthCheckService.List(null, null, deviceId, null, null);

        return ToDic(dt);

    }

    [ManualMap]
    public static DataTable GetVrsEqpDt()
    {
        return DataContext.StringDataSet("@Barcode.GetVrsEqpDt").Tables[0];
    }

    [ManualMap]
    public static int EqpCommunicationStatusListUpdate([FromBody] IDictionary dic)
    {
        string rawJson = dic.TypeKey<string>("rawJson");

        var rawList = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(rawJson);
        int result = 0;

        if (rawList.Count > 0)
        {
            dynamic obj = new ExpandoObject();
            obj.Json = rawJson;


            DataContext.StringNonQuery("@Barcode.CommunicationStatusListDownInsert", RefineExpando(obj));
            // 설비 통신 로우 업데이트
            result = DataContext.StringNonQuery("@Barcode.CommunicationStatusListUpdate", RefineExpando(obj));
        }
        return result;
    }

    [ManualMap]
	public static IResult RecognitionList(DateTime fromDt, DateTime toDt, string? workorder, string? eqpCode, string? modelCode, string? rtrSheet, string? barcode, string? dupe, bool isExcel = false)
	{
		dynamic obj = new ExpandoObject();

		obj.FromDt = SearchFromDt(fromDt);
		obj.ToDt = SearchToDt(toDt);
		obj.Workorder = workorder;
		obj.EqpCode = eqpCode;
        obj.ModelCode = modelCode;
        obj.RtrSheet = rtrSheet;
        obj.Barcode = barcode;
        obj.Dupe = dupe;

		// 바코드 인식수 조회
		DataTable dt = DataContext.StringDataSet("@Barcode.RecognitionList", RefineExpando(obj, true)).Tables[0];
		FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);
		FindLabel(dt, "workcenterCode", "workcenterDesc", (Func<string, string>)ErpWorkCenterService.SelectCacheName);

		if (!isExcel)
			return Results.Json(ToDic(dt));

		return ExcelDownBarcodeRecognition(dt, "BARCODERECO");
	}

	[ManualMap]
	public static IResult ExcelDownBarcodeRecognition(DataTable dt, string fileName)
	{
		List<Tuple<string, string, double, Type, Func<DataRow, object>?>> mapList = new()
		{
            new("chk", "중복", 20, typeof(string), null),
			new("createDt", "일시", 17, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("create_dt")?.ToString("yyyy-MM-dd HH:mm") ?? string.Empty; }),
			new("modelCode", "모델코드", 35, typeof(string), null),
			new("modelName", "모델명", 35, typeof(string), null),
			new("workorder", "BATCH NO", 35, typeof(string), null),
            new("workorderMulti", "MUTI BATCH NO", 35, typeof(string), null),

			new("operSeqNo", "공정 순서", 35, typeof(string), null),
			new("operDesc", "공정명", 35, typeof(string), null),
			new("rtrSheet", "RTR/SHEET", 35, typeof(string), null),
            new("eqpCode", "설비코드", 35, typeof(string), null),
			new("eqpName", "설비명", 35, typeof(string), null),
			new("eqpNameMulti", "다중 설비명", 35, typeof(string), null),
			new("workcenterCode", "작업장코드", 35, typeof(string), null),
			new("workcenterDesc", "작업장명", 35, typeof(string), null),
			
			new("erpCnt", "LOT 기준 수량", 10, typeof(int), null),
			new("barcodeCnt", "바코드 인식수량", 10, typeof(int), null),
			new(string.Empty, "바코드 인식률", 15, typeof(double), (row) => BBTService.DevideFormat(row, "barcodeCnt", "erpCnt")),

			new("panelCnt", "MES 등록 수량", 10, typeof(int), null),
			new(string.Empty, "DATA LOSS율", 15, typeof(double), (row) => BarcodeService.DevideLossFormat(row, "panelCnt", "barcodeCnt")),

			new("startDt", "4m 시작", 17, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("start_dt")?.ToString("yyyy-MM-dd HH:mm") ?? string.Empty; }),
			new("endDt", "4m 종료", 17, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("end_dt")?.ToString("yyyy-MM-dd HH:mm") ?? string.Empty; }),
			new("scanDtMin", "스캔 시작", 17, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("scan_dt_min")?.ToString("yyyy-MM-dd HH:mm") ?? string.Empty; }),
			new("scanDtMax", "스캔 종료", 17, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("scan_dt_max")?.ToString("yyyy-MM-dd HH:mm") ?? string.Empty; }),

		};

		using var excel = ExcelEx.ToExcel(dt, mapList);

		return Results.File(excel.GetAsByteArray(), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
	}

    /// <summary>
    /// 조헌수 부장의 요청에 의한
    /// MES 바코드 , non4M , ng ,ok 하나로 합친 테이블 구성
    /// </summary>
    /// <param name="groupKey"></param>
    /// <param name="eqpCode"></param>
    /// <returns></returns>
    [ManualMap]
    public static IResult MesPnaelItemList(string groupKey, string eqpCode, bool isExcel = false)
    {
        dynamic obj = new ExpandoObject();
        obj.GroupKey = groupKey;
        obj.EqpCode = eqpCode;
        
        DataTable dt = DataContext.StringDataSet("@Barcode.MesPanelItemList", RefineExpando(obj, true)).Tables[0];
        if (dt.Rows.Count == 0)
            return null;

        if (!isExcel)
            return Results.Json(ToDic(dt));

        return ExcelDownBarcodePanelItemList(dt, "PANELITEM");
    }

    [ManualMap]
    public static IResult ExcelDownBarcodePanelItemList(DataTable dt, string fileName)
    {
        List<Tuple<string, string, double, Type, Func<DataRow, object>?>> mapList = new()
        {
            new("panel_group_key", "그룹키", 17,  typeof(string), null),
            new("device_id", "디바이스", 35, typeof(string), null),
            new("eqp_code", "공정 코드", 35, typeof(string), null),
            new("panel_id", "판넬 아이디", 35, typeof(string), null),
            new("remark", "OK/NG 유무", 35, typeof(string), null),
            new("create_dt", "생성일자", 35, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("create_dt")?.ToString("yyyy-MM-dd HH:mm") ?? string.Empty; }),
        };

        using var excel = ExcelEx.ToExcel(dt, mapList);

        return Results.File(excel.GetAsByteArray(), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }

    [ManualMap]
	public static double DevideLossFormat(DataRow row, string numCol, string denomCol)
	{
        if(row.TypeCol<double>(UtilEx.ToSnake(denomCol)) == 0 || row.TypeCol<double>(UtilEx.ToSnake(numCol)) == 0)
            return 0;
        else 
		    return Math.Round((row.TypeCol<double>(UtilEx.ToSnake(denomCol)) - row.TypeCol<double>(UtilEx.ToSnake(numCol))) / row.TypeCol<double>(UtilEx.ToSnake(denomCol)) * 100, 2);
	}

	[ManualMap]
    public static IResult ExcelDown(DataTable dt, string fileName)
    {
        Dictionary<string, string> colDic = new()
        {
            { "panel_id", "PANEL BARCODE" },
            { "item_description", "제품명" },
            { "model_code", "모델코드" },
            { "device_id", "Device ID" },
            { "eqp_code", "장비코드" },
            { "eqp_name", "장비명" },
            { "workorder", "LOT" },
			{ "oper_seq_no", "공정순서" },
			{ "oper_description", "공정명" },
			{ "scan_dt", "스캔일시" },
			{ "create_dt", "생성시간" },
		};

        return Results.File(ExcelEx.ToExcelSimple(dt, colDic), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }

    [ManualMap]
    public static IResult ErrorExcelDown(DataTable dt, string fileName)
    {
        Dictionary<string, string> colDic = new()
        {
            { "error_type", "오류" },
            { "ip_addr", "IP" },
            { "eqp_code", "장비코드" },
            { "eqp_name", "장비명" },
            { "scan_dt", "스캔일시" },
        };

        return Results.File(ExcelEx.ToExcelSimple(dt, colDic), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }

    [ManualMap]
    public static DataTable BarcordNameListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey($"barcode_list"),
            DateTime.Now.AddMinutes(GetCacheMin()),
            () =>
            {
                return DataContext.StringDataSet("@Barcode.HealthCheckEqpList").Tables[0];
            });


        return list;
    }

    public static Map GetMap(string? category = null)
    {
        return BarcordNameListAllCache().AsEnumerable()
       .OrderBy(x => x.TypeCol<string>("eqp_code"))
       .Select(y =>
       {
           return new MapEntity(
               y.TypeCol<string>("eqp_code"),
               y.TypeCol<string>("eqp_desc"),
               string.Empty,
               'Y');
       }).ToMap();
    }

    public static void RefreshMap()
    {
        throw new NotImplementedException();
    }
}
