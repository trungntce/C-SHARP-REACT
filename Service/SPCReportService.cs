namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Data.SqlClient;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.JsonPatch.Operations;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

public class SPCReportService : MinimalApiService, IMinimalApi, Map.IMap
{
    public SPCReportService(ILogger<SPCReportService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        //관리도
        group.MapGet("/detaillist", nameof(DetailList));
        group.MapGet("/panel", nameof(PanelList));
        group.MapGet("/chart", nameof(ListForChart));
        group.MapGet("/groupchart", nameof(GroupListForChart));

        //blacklist
        group.MapGet("/blacklistget", nameof(BlackListGet));
        group.MapPut("/blacklistput", nameof(BlackListPut));
        group.MapPost("/blacklistupdate", nameof(BlackListUpdate));
        group.MapPost("/set", nameof(BlackListUpdate));
        group.MapDelete("/blacklistdelete", nameof(BlackListDelete));

        return RouteAllEndpoint(group);
    }

    //public static void RemoveCache()
    //{
    //    UtilEx.RemoveCache(BuildCacheKey());
    //}

    #region 관리도
    public static IResult List(DateTime fromDt, DateTime toDt,  string itemCode, string operCode, string inspectDesc, string judge, string eqpCode, string? modelCode, string? workorder)
    {
        dynamic obj = new ExpandoObject();
        obj.FromDt = fromDt;
        obj.ToDt = toDt;
        obj.ItemCode = itemCode;
        obj.ModelCode = modelCode;
        obj.OperCode = operCode;
        obj.InspectDesc = inspectDesc;
        obj.EqpCode = eqpCode;
        //obj.Workorder = workorder;
        //obj.Trust = "신뢰성 검사";
        //obj.Iqc = "IQC 치수 검사";
        //obj.Cmi = "CMI두께";
        //obj.Ipqc = "IPQC 치수검사";
        //obj.Chisu = "치수 - ";
        var model = "";
        if (modelCode != null)
        {
            model = modelCode;
        }

        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;
        DataTable dt = new DataTable();
        dt = db.ExecuteStringDataSet("@SPCReport.List",new { fromDt, toDt, itemCode, operCode, inspectDesc, modelCode = model, eqpCode  , judge}).Tables[0];


        //DataTable dt = DataContext.StringDataSet("@SPCReport.List", RefineExpando(obj, true)).Tables[0];

        //FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

        return Results.Json(ToDic(dt));
    }

    [ManualMap]
    public static IResult DetailList(DateTime inspectionDate, string itemCode, string modelCode,  string workorder, int operSeqNo, string operCode, string inspectionDesc, string lsl, string  usl,  string? eqpCode)//bool isExcel = false)
    {

        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;
        DataTable dt = new DataTable();

        

        dt = DataContext.StringDataSet("@SPCReport.DetailList", new { from_dt = inspectionDate, to_dt = inspectionDate, itemCode, modelCode, workorder, operSeqNo, operCode, inspect_desc = inspectionDesc, lsl, usl }).Tables[0];

        return Results.Json(ToDic(dt));

        //if (!isExcel)
        //    return Results.Json(ToDic(dt));

        //return ExcelDown(dt, "cuplating");
    }

    [ManualMap]
    public static IResult PanelList(string groupKey, bool isExcel = false)
    {
        DataTable dt = DataContext.StringDataSet("@CuPlatingEx.PanelList", new { groupKey }).Tables[0];

        if (!isExcel)
            return Results.Json(ToDic(dt));

        return ExcelDown(dt, "cuplating");
    }

    [ManualMap]
    public static IResult ExcelDown(DataTable dt, string fileName)
    {
        Dictionary<string, string> colDic = new()
        {
            { "panel_seq", "판넬No" },
            { "judge", "판정" },
            { "d001_std", "STD" },
            { "d001_lcl", "LCL" },
            { "d001_ucl", "UCL" },
            { "d001_min", "Data1" },
            { "d002_min", "Data2" },
            { "d003_min", "Data3" },
            { "d004_min", "Data4" },
            { "d005_min", "Data5" },
            { "d006_min", "Data6" },
            { "raw_dt", "측정일시" },
        };

        return Results.File(ExcelEx.ToExcelSimple(dt, colDic), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }

    [ManualMap]
    public static IEnumerable<IDictionary> ListForChart(string groupKey, int panelSeq)
    {
        DataTable dt = DataContext.StringDataSet("@CuPlatingEx.ListForChart", new { groupKey, panelSeq }).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> GroupListForChart(string groupKey)
    {
        DataTable dt = DataContext.StringDataSet("@CuPlatingEx.GroupListForChart", new { groupKey }).Tables[0];

        return ToDic(dt);
    }


    public static IEnumerable<IDictionary> ListAll()
    {
        string trust = "신뢰성";
        string chi = "치수 - ";

        dynamic obj = new ExpandoObject();
        obj.Trust = trust;
        obj.Chisu = chi;



        return ToDic(DataContext.StringDataSet("@SPCReport.InspectionDescriptionListByOper", obj).Tables[0]);
    }


    public static IEnumerable<IDictionary> ListAllCache(string? operCode)
    {
        string trust = "신뢰성";
        string chi = "치수 - ";

        dynamic obj = new ExpandoObject();
        obj.Trust = trust;
        obj.Chisu = chi;
        obj.OperCode = operCode;

        if (operCode != null)
        {
            return ToDic(DataContext.StringDataSet("@SPCReport.InspectionDescriptionListByOper", RefineExpando(obj)).Tables[0]);
        }

        var list = UtilEx.FromCache(
            BuildCacheKey("operTest"),
            DateTime.Now.AddMinutes(GetCacheMin()),
            () =>
            {
                return ToDic(DataContext.StringDataSet("@SPCReport.InspectionDescriptionListByOper", RefineExpando(obj)).Tables[0]);
            }
            );
        return list;
    }

    public static Map GetMap(string? category = null)
    {

        if (category == null)
            return new(new());

        //.Where(x => category == null || x.TypeKey<string>("operCode").StartsWith(category, StringComparison.OrdinalIgnoreCase))
        return ListAllCache(category)
           .Select(y => {
               return new MapEntity(
                    y.TypeKey<string>("inspectionDesc"),
                    "[ " + y.TypeKey<string>("category") + " ] - " + y.TypeKey<string>("inspectionDesc"),
                    string.Empty,
                    'Y');
           }).ToMap();

        //return DataContext.StringDataSet("@DiWater.SystemList", new { }).Tables[0];
        //throw new NotImplementedException();
    }

    public static void RefreshMap()
    {
        throw new NotImplementedException();
    }





    #endregion


    #region BLACKLIST

    [ManualMap]
    public static IEnumerable<IDictionary> BlackListGet(string? operCode, string? inspectionDesc, string? eqpCode, string? itemCode)
    {
        dynamic obj = new ExpandoObject();
        obj.OperCode = operCode;
        obj.InspectionDesc = inspectionDesc;
        obj.ItemCode = itemCode;
        obj.EqpCode = eqpCode;


        //return DataContext.StringEntity("@SPCReport.BlackListGet", RefineExpando(obj, true));


        DataTable dt = DataContext.StringDataSet("@SPCReport.BlackListGet", RefineExpando(obj, true)).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static int BlackListPut ([FromBody] SpcRuleEntity entity)
    {
        IEnumerable<IDictionary> dt = BlackListGet(entity.OperCode, entity.InspectionDesc, entity.EqpCode, entity.ItemCode);

        if (dt.Any())
            return -1;

        return DataContext.StringNonQuery("@SPCReport.BlackListPut", RefineEntity(entity));
    }

    [ManualMap]
    public static int BlackListUpdate([FromBody] IDictionary dic)
    {
        
        string json = dic.TypeKey<string>("dic");

        var entity = JsonConvert.DeserializeObject<SpcRuleEntity>(json);

        dynamic obj = new ExpandoObject();
        obj.OperCode = entity.OperCode;
        obj.InspectionDesc = entity.InspectionDesc;
        obj.ItemCode = entity.ItemCode;
        obj.EqpCode = entity.EqpCode;

        DataTable dt = DataContext.StringDataSet("@SPCReport.BlackListGet", RefineExpando(obj, true)).Tables[0];

        if (dt.Rows.Count > 0 && dt.Rows[0].TypeCol<int>("row_no") != entity.RowNo)
            return -1;

        return DataContext.StringNonQuery("@SPCReport.BlackListUpdate", RefineEntity(entity));
    }

    [ManualMap]
    public static int BlackListDelete(int rowNo)
    {
        dynamic obj = new ExpandoObject();
        obj.RowNo = rowNo;

        return DataContext.StringNonQuery("@SPCReport.BlackListDelete", RefineExpando(obj));
    }

    #endregion


    #region getMap

    [ManualMap]
    public static IEnumerable<IDictionary> ListAllBlack()
    {
        string trust = "신뢰성";
        string chi = "치수 - ";

        dynamic obj = new ExpandoObject();
        obj.Trust = trust;
        obj.Chisu = chi;


        return ToDic(DataContext.StringDataSet("@SPCReport.InspectionDescriptionList", obj).Tables[0]);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> ListAllCacheBlack(string? operCode)
    {
        string trust = "신뢰성";
        string chi = "치수 - ";

        dynamic obj = new ExpandoObject();
        obj.Trust = trust;
        obj.Chisu = chi;
        //obj.OperCode = operCode;

        //if (operCode != null)
        //{
        //    return ToDic(DataContext.StringDataSet("@SPCReport.InspectionDescriptionList", RefineExpando(obj)).Tables[0]);
        //}

        var list = UtilEx.FromCache(
            BuildCacheKey("operTest"),
            DateTime.Now.AddMinutes(GetCacheMin()),
            ListAllBlack);
        return list;
    }

    [ManualMap]
    public static Map GetMapBlack(string? category = null)
    {

        //if (category == null)
        //    return new(new());

        //.Where(x => category == null || x.TypeKey<string>("operCode").StartsWith(category, StringComparison.OrdinalIgnoreCase))
        return ListAllCacheBlack(category)
           .Select(y => {
               return new MapEntity(
                    y.TypeKey<string>("inspectionDesc"),
                    "[ " + y.TypeKey<string>("category") + " ] - " + y.TypeKey<string>("inspectionDesc"),
                    string.Empty,
                    'Y');
           }).ToMap();

    }

    [ManualMap]
    public static void RefreshMapBlack()
    {
        throw new NotImplementedException();
    }


    #endregion
}
