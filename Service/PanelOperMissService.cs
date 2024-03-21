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
using Framework;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OfficeOpenXml;

public class PanelOperMissService : MinimalApiService, IMinimalApi
{
    public PanelOperMissService(ILogger<PanelOperMissService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/getlist", nameof(GetList));
        return RouteAllEndpoint(group);
    }
    [ManualMap]
    public static List<DataTable> List(string workorder)
    {

        var ds = DataContext.DataSet("dbo.sp_panel_oper_miss_list", new { workorder });



        List<DataTable> dtList = new List<DataTable>();
        dtList.Add(ds.Tables[0]);
        dtList.Add(ds.Tables[1]);
        dtList.Add(ds.Tables[2]);

 

        return dtList;
    }

    [ManualMap]
    public static List<DataTable> GetList(string workorder)
    {

        var ds = DataContext.DataSet("dbo.sp_panel_oper_miss_list", new { workorder });


        List<DataTable> dtList = new List<DataTable>();
        dtList.Add(ds.Tables[0]);
        dtList.Add(ds.Tables[1]);
        dtList.Add(ds.Tables[2]);

        return dtList;
    }

}
