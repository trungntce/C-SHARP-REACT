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

public class DownListService : MinimalApiService, IMinimalApi
{
    public DownListService(ILogger<DownListService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/communicationdownlist", nameof(CommunicationDownList));                      //설비통신
        group.MapGet("/epstatusdownlist", nameof(EpstatusDownList));                                //EP 프로그램통신

        return RouteAllEndpoint(group);
    }

    [ManualMap]
    public static IResult CommunicationDownList(DateTime fromDt, DateTime toDt, string? eqpCode)
    {
        dynamic obj = new ExpandoObject();
        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);
        obj.EqpCode = eqpCode;

        var dt = DataContext.StringDataSet("@Barcode.CommunicationStatusListDownList", RefineExpando(obj, true)).Tables[0];
        return Results.Json(ToDic(dt));
    }

    [ManualMap]
    public static IResult EpstatusDownList(DateTime fromDt, DateTime toDt, string? eqpCode)
    {
        dynamic obj = new ExpandoObject();
        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);
        obj.EqpCode = eqpCode;

        var dt = DataContext.StringDataSet("@Barcode.EpStatusDownList", RefineExpando(obj, true)).Tables[0];

        return Results.Json(ToDic(dt));
    }
}

