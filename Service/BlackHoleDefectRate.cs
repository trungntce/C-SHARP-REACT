namespace WebApp;

using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using YamlDotNet.Core;

public class BlackHoleDefectRateService : MinimalApiService, IMinimalApi, Map.IMap
{
    public BlackHoleDefectRateService(ILogger<BlackHoleDefectRateService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/chartdata", nameof(ChartData));
        group.MapGet("/minmaxavg", nameof(MinMaxAvgData));
        group.MapGet("/peneldefect", nameof(PanelDefectData));
        group.MapGet("/ngimglist", nameof(PanelDefectData));

        return RouteAllEndpoint(group);
    }

    [ManualMap]
    public static DataTable AllList()
    {
        DataTable dt = new DataTable();
        return dt;
    }

    [ManualMap]
    public static List<DataTable> ChartData(DateTime fromDt, DateTime toDt, string itemCode, string fjd, string? rollId, string? workorder)
    {
        dynamic obj = new ExpandoObject();
        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);
        obj.ItemCode = itemCode;
        obj.Fjd = fjd;
        obj.RollNo = rollId;
        obj.Workorder = workorder;

        /*var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;*/
        var list = new List<DataTable>();

        foreach (var i in DataContext.StringDataSet("@BlackHoleDefectRate.ChartData", RefineExpando(obj, true)).Tables)
        {
            list.Add(i);
        };

        return list;
    }

    [ManualMap]
    public static DataTable MinMaxAvgData(string rollId, string fjd)
    {
        dynamic obj = new ExpandoObject();
        obj.RollId = rollId;
        obj.Fjd = fjd;

        return DataContext.StringDataSet("@BlackHoleDefectRate.MinMaxAvg", RefineExpando(obj, true)).Tables[0];
    }

    [ManualMap]
    public static List<DataTable> PanelDefectData(string rollId, string fjd)
    {
        dynamic obj = new ExpandoObject();
        obj.RollId = rollId;
        obj.Fjd = fjd;

        var list = new List<DataTable>();
        list.Add(DataContext.StringDataSet("@BlackHoleDefectRate.PanelDefect", RefineExpando(obj, true)).Tables[0]);
        list.Add(DataContext.StringDataSet("@BlackHoleDefectRate.NgImgfiles", RefineExpando(obj, true)).Tables[0]);
       
        return list; 
    }

    [ManualMap]
    public static DataTable PanelNgImage(string workorder, string fjd)
    {
        dynamic obj = new ExpandoObject();
        obj.WorkOrder = workorder;
        obj.Fjd = fjd;

        return DataContext.StringDataSet("@BlackHoleDefectRate.NgImgfiles", RefineExpando(obj, true)).Tables[0];
    }

    public static Map GetMap(string? category = null)
    {
        throw new NotImplementedException();
    }

    public static void RefreshMap()
    {
        throw new NotImplementedException();
    }
}