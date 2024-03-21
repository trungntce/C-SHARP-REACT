namespace WebApp;

using System;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

public class PreProcessingService : MinimalApiService, IMinimalApi, Map.IMap
{
    public PreProcessingService(ILogger<PreProcessingService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        //group.MapGet("/onerow", ListOneRow);
        group.MapGet("/afterlast", nameof(ListAfterLast));
        group.MapGet("/month", nameof(ListMonth));
        group.MapGet("/limits", nameof(Limits));
        return RouteAllEndpoint(group);
    }
    
    public static PreProcessingList ListAll()
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 1440;

		return new PreProcessingList(DataContext.StringEntityList<PreProcessingEntity>("@PreProcessing.List", RefineExpando(obj)));
    }

    public static PreProcessingList List(int? duration, string? equipName)
    {

        dynamic obj = new ExpandoObject();
        obj.Duration = duration;
        obj.Equipname = equipName;

        return new PreProcessingList(DataContext.StringEntityList<PreProcessingEntity>("@PreProcessing.List", RefineExpando(obj)));
    }

    [ManualMap]
    public static PreProcessingList ListAfterLast(DateTime? lastTime, string? equipName)
    {
        dynamic obj = new ExpandoObject();
        obj.lastDt = lastTime;
        obj.Equipname = equipName;

        var t = DataContext.StringEntityList<PreProcessingEntity>("@PreProcessing.ListAfterLast", RefineExpando(obj, true));

        return new PreProcessingList(t);
    }

    [ManualMap]
    public static IResult ListMonth(string? equipName)
    {
        dynamic obj = new ExpandoObject();
        obj.Equipname = equipName;

        var dt = DataContext.StringDataSet("@PreProcessing.ListMonth", RefineExpando(obj, true)).Tables[0];
        return Results.Json(ToDic(dt));
    }

    [ManualMap]
    public static IResult Limits(string? equipName)
    {
        dynamic obj = new ExpandoObject();
        obj.Equipname = equipName;

        var dt = DataContext.StringDataSet("@PreProcessing.Limits", RefineExpando(obj, true)).Tables[0];
        return Results.Json(ToDic(dt));
    }

    public static PreProcessingList ListAllCache()
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