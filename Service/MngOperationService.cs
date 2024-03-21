namespace WebApp;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Drawing.Printing;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.WebSockets;
using System.Reflection;
using System.Text;
using Framework;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Practices.EnterpriseLibrary.Data;
using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.FormulaParsing.Excel.Functions.DateTime;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Math;

public class MngOperationService : MinimalApiService, IMinimalApi, Map.IMap
{
    public MngOperationService(ILogger<MngOperationService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/typelist", nameof(GetEquip)); 

        

        return RouteAllEndpoint(group);
    }


    [ManualMap]
    public static List<DataTable> GetEquip(string mesDate, string equipment)
    {
        dynamic obj = new ExpandoObject();
        obj.MesDate = mesDate;
        obj.Equip = equipment;
        obj.Start = $"{mesDate} 08:00:00";
        var list = new List<DataTable>();

        foreach (var i in DataContext.StringDataSet("@MonitoringDetail.Select", obj).Tables)
        {
            list.Add(i);
        }

        return list;
    }


    [ManualMap]
    public static DataTable TypeListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey($"room_list"),
            DateTime.Now.AddMinutes(GetCacheMin()),
            () => {
                return DataContext.StringDataSet("@MngOperation.TypeList").Tables[0];
            });


        return list;
    }

    public static Map GetMap(string? category = null)
    {
        return TypeListAllCache().AsEnumerable()
       .OrderBy(x => x.TypeCol<string>("type_num"))
       .Select(y => {
           return new MapEntity(
               y.TypeCol<string>("eqp_code"),
               y.TypeCol<string>("eqp_name"),
               y.TypeCol<string>("type_name"),
               'Y');
       }).ToMap();
    }

    public static void RefreshMap()
    {
        throw new NotImplementedException();
    }
}
