namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

public class CuPlatingService : MinimalApiService, IMinimalApi, Map.IMap
{
    public CuPlatingService(ILogger<CuPlatingService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/afterlast", nameof(ListAfterLast));
        group.MapGet("/month", nameof(ListMonth));
        //group.MapGet("/limits", nameof(Limits));
        return RouteAllEndpoint(group);
    }

    public static CuPlatingList ListAll()
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 1440;

        return new CuPlatingList(DataContext.StringEntityList<CuPlatingEntity>("@CuPlating.List", RefineExpando(obj)));
    }

    public static IResult List(string? eqpCode, int? duration, bool isExcel = false)
    {
        dynamic obj = new ExpandoObject();
        obj.EqCode = eqpCode;
        obj.Duration = duration;

        var rtn = new CuPlatingList(DataContext.StringEntityList<CuPlatingEntity>("@CuPlating.List", RefineExpando(obj, true)));
        if (isExcel)
        {
            var dt = rtn.ToTable();

            Dictionary<string, string> colDic = new()
            {
                { "Time", "측정시간" },
                { "EqCode", "장비코드" },
                { "D001", "측정값1" },
                { "D002", "측정값2" },
                { "D003", "측정값3" },
                { "D004", "측정값4" },
            };

            string fileName = "CuPlating";
            return Results.File(
                ExcelEx.ToExcelSimple(dt, colDic), 
                "application/force-download", 
                $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
        }

        return Results.Json(rtn);
    }

    [ManualMap]
    public static CuPlatingList ListAfterLast(DateTime lastTime, string eqpCode)
    {
        dynamic obj = new ExpandoObject();
        obj.LastDt = lastTime;
        obj.EqpCode = eqpCode;

        return new CuPlatingList(DataContext.StringEntityList<CuPlatingEntity>("@CuPlating.ListAfterLast", RefineExpando(obj, true)));
    }

    [ManualMap]
    public static IResult ListMonth(string? eqpCode)
    {
        dynamic obj = new ExpandoObject();
        obj.EqpCode = eqpCode;

        var dt = DataContext.StringDataSet("@CuPlating.ListMonth", RefineExpando(obj, true)).Tables[0];
        return Results.Json(ToDic(dt));
    }

/*    [ManualMap]
    public static DataTable Limits(string? eqpCode)
    {
        dynamic obj = new ExpandoObject();
        obj.EqpCode = eqpCode;

        return DataContext.StringDataSet("@CuPlating.Limits", RefineExpando(obj, true)).Tables[0];
    }*/

    public static CuPlatingList ListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(),
            DateTime.Now.AddMinutes(GetCacheMin()),
            ListAll);

        return list;
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }

    public static Map GetMap(string? category = null)
    {
        throw new NotImplementedException();

    }

    public static void RefreshMap()
    {
        RemoveCache();
    }
}


//[ManualMap]
//public static PreProcessingList ListOneRow(string? equipName)
//{
//    dynamic obj = new ExpandoObject();
//    obj.EquipName = equipName;

//    var t = DataContext.StringEntityList<PreProcessingEntity>("@PreProcessing.ListOneRow", RefineExpando(obj, true));

//    return new PreProcessingList(t);
//}