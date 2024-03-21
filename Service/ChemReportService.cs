namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Data.SqlClient;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Mvc;

public class ChemReportService : MinimalApiService, IMinimalApi , Map.IMap
{
    public ChemReportService(ILogger<ChemReportService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/detaillist", nameof(DetailList));
        group.MapGet("/panel", nameof(PanelList));
        group.MapGet("/chart", nameof(ListForChart));
        group.MapGet("/groupchart", nameof(GroupListForChart));

        return RouteAllEndpoint(group);
    }

    public static IResult List(DateTime fromDt, DateTime toDt,  string operClass, string? isTotal, string? eqpCode, string? chemicalList, string? operCode)
    {
        dynamic obj = new ExpandoObject();
        obj.FromDt = fromDt;
        obj.ToDt = toDt;
        obj.OperCode = operCode;
        obj.EqpCode = eqpCode;
        obj.OperClass = operClass;
        obj.ChemName = chemicalList;
        obj.Yack = "약품분석";
        obj.Et = "E/T Rate";

        DataTable dt = null;
        if(isTotal == "A")
        {
            //전체
            dt = DataContext.StringDataSet("@ChemReport.List", RefineExpando(obj, true)).Tables[0];
        }
        else if(isTotal == "B")
        {
            //전체
            dt = DataContext.StringDataSet("@ChemReport.ListMaxAdj", RefineExpando(obj, true)).Tables[0];
        }

        FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

        return Results.Json(ToDic(dt));
    }

    [ManualMap]
    public static IResult DetailList(string operClass, string eqpCode, string chemName, string measureDt, string factorDesc)//bool isExcel = false)
    {
        dynamic obj = new ExpandoObject();
        obj.OperClass = operClass;
        obj.EqpCode = eqpCode;
        obj.ChemName = chemName;
        obj.MeasureDt = measureDt;
        obj.FactorDesc = factorDesc;
        obj.Yack = "약품분석";
        obj.Et = "E/T Rate";

        DataTable dt = DataContext.StringDataSet("@ChemReport.DetailList", RefineExpando(obj, true)).Tables[0];

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
       
        return ToDic(DataContext.StringDataSet("@ChemReport.OperClassList", new { }).Tables[0]);
    }

    public static IEnumerable<IDictionary> ListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(),
            DateTime.Now.AddMinutes(GetCacheMin()),
            ListAll);

        return list;
    }

    public static Map GetMap(string? category = null)
    {

        return ListAllCache()
           .Where(x => category == null || x.TypeKey<string>("category").StartsWith(category, StringComparison.OrdinalIgnoreCase))
           .Select(y =>
           {
               return new MapEntity(
                    y.TypeKey<string>("operClassCode"),
                    y.TypeKey<string>("operClassDescription"),
                    string.Empty,
                    'Y');
           }).ToMap();

        //return DataContext.StringDataSet("@DiWater.SystemList", new { }).Tables[0];
        //throw new NotImplementedException();
    }


    //public static IEnumerable<IDictionary> ChemListAll()
    //{

    //    return ToDic(DataContext.StringDataSet("@ChemReport.ChemicalDescriptionList", new { }).Tables[0]);
    //}



    [ManualMap]
    public static DataTable ChemListCache(string operClass)
    {
        dynamic obj = new ExpandoObject();
        obj.operClass = operClass;

        if (operClass == null)
            return DataContext.StringDataSet("@ChemReport.ChemicalDescriptionList", RefineExpando(obj)).Tables[0];

        //var list = UtilEx.FromCache(
        //    BuildCacheKey("chem_name"),
        //    DateTime.Now.AddMinutes(GetCacheMin()),
        //    () =>
        //    {
        //        return DataContext.StringDataSet("@ChemReport.ChemicalDescriptionList", RefineExpando(obj)).Tables[0];
        //    });
        var list = DataContext.StringDataSet("@ChemReport.ChemicalDescriptionList", RefineExpando(obj)).Tables[0];
        return list;
    }

    [ManualMap]
    public static Map ChemGetMap(string? category = null)
    {
        //if (category == null)
        //    return DataContext.StringDataSet("@ChemReport.ChemicalDescriptionList", RefineExpando(obj)).Tables[0];

        return ChemListCache(category).AsEnumerable()
        .OrderBy(x => x.TypeCol<string>("chem_name"))
        .Select(y =>
        {
            return new MapEntity(
                y.TypeCol<string>("chem_name"),
                y.TypeCol<string>("oper_description"),
                string.Empty,
                'Y');
        }).ToMap();
    }
    [ManualMap]
    public static void ChemNaleListRefreshMap()
    {
        UtilEx.RemoveCache(BuildCacheKey("chem_name"));
    }

    public static void RefreshMap()
    {
        throw new NotImplementedException();
    }
}
