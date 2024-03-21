namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Data.SqlClient;
using System.Dynamic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using Framework;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Org.BouncyCastle.Ocsp;

public class CMIService : MinimalApiService, IMinimalApi
{
    public CMIService(ILogger<CMIService> logger) : base(logger)
    {   
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/detail", nameof(ListDetail));

        return RouteAllEndpoint(group);
    }

    public static IEnumerable<IDictionary> List(DateTime fromDt, DateTime toDt)
	{
		dynamic obj = new ExpandoObject();
       
        obj.FromDt      = SearchFromDt(fromDt);
        obj.ToDt        = SearchToDt(toDt);

		DataTable dt = DataContext.StringDataSet("@CMI.List", RefineExpando(obj, true)).Tables[0];

		return ToDic(dt);
	}

	[ManualMap]
	public static IEnumerable<IDictionary> ListDetail(DateTime fromDt, DateTime toDt, string? bomItemCode, string? workorder, string? panel)
	{
		dynamic obj = new ExpandoObject();

		obj.FromDt = fromDt;
		obj.ToDt = toDt;
        obj.ModelCode = bomItemCode;
        obj.Workorder = workorder;
        obj.Panel = panel;

		DataTable dt = DataContext.StringDataSet("@AOIVRS.ListDetail", RefineExpando(obj, true)).Tables[0];

		return ToDic(dt);
	}

}
