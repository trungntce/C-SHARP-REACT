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
using OfficeOpenXml.FormulaParsing.Excel.Functions.Math;
using Org.BouncyCastle.Ocsp;

public class BBTDefectService : MinimalApiService, IMinimalApi
{
    public BBTDefectService(ILogger<BBTDefectService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
		group.MapGet("totalmondefect", nameof(TotalMonDefect));
		group.MapGet("totalweekdefect", nameof(TotalWeekDefect));
		group.MapGet("totaldaydefect", nameof(TotalDayDefect));

		group.MapGet("totaldefect", nameof(TotalDefect));
		group.MapGet("detaildefect", nameof(DetailDefect));

		return RouteAllEndpoint(group);
    }

    public static IEnumerable<IDictionary> List()
	{
		dynamic obj = new ExpandoObject();

		DataTable dt = DataContext.StringDataSet("@MonitoringDetail.BBTList", RefineExpando(obj, true)).Tables[0];

        return ToDic(dt);
	}

	[ManualMap]
	public static IEnumerable<IDictionary> TotalMonDefect(DateTime toDt, string? eqpCode, string? appCode, string? modelCode, string? modelName)
	{
		dynamic obj = new ExpandoObject();
		obj.ToDt = SearchToDt(toDt);
		obj.EqpCode = eqpCode;
		obj.AppCode = appCode;
		obj.ModelCode = modelCode;
		obj.ModelName = modelName;

		DataTable dt = DataContext.StringDataSet("@BBTDefect.BBTMonDefect", RefineExpando(obj, true)).Tables[0];

		return ToDic(dt);
	}

	[ManualMap]
	public static IEnumerable<IDictionary> TotalWeekDefect(DateTime toDt, string? eqpCode, string? appCode, string? modelCode, string? modelName)
	{
		dynamic obj = new ExpandoObject();
        obj.ToDt = SearchToDt(toDt);
        obj.EqpCode = eqpCode;
		obj.AppCode = appCode;
		obj.ModelCode = modelCode;
		obj.ModelName = modelName;

		DataTable dt = DataContext.StringDataSet("@BBTDefect.BBTWeekDefect", RefineExpando(obj, true)).Tables[0];

		return ToDic(dt);
	}

	[ManualMap]
	public static IEnumerable<IDictionary> TotalDayDefect(DateTime toDt, string? eqpCode, string? appCode, string? modelCode, string? modelName)
	{
		dynamic obj = new ExpandoObject();
        obj.ToDt = SearchToDt(toDt);
        obj.EqpCode = eqpCode;
		obj.AppCode = appCode;
		obj.ModelCode = modelCode;
		obj.ModelName = modelName;

		DataTable dt = DataContext.StringDataSet("@BBTDefect.BBTDayDefect", RefineExpando(obj, true)).Tables[0];

		return ToDic(dt);
	}

	[ManualMap]
	public static IEnumerable<IDictionary> TotalDefect(DateTime toDt,string? appCode, string? modelCode, string? modelName, string? layers)
	{
		dynamic obj = new ExpandoObject();
        obj.ToDt = toDt;
        obj.AppCode = appCode;
        obj.ModelCode = modelCode;
        obj.ModelName = modelName;

		DataTable dt = DataContext.StringDataSet("@BBTDefect.TotalDefect", RefineExpando(obj, true)).Tables[0];

		return ToDic(dt);
	}

	[ManualMap]
	public static IEnumerable<IDictionary> DetailDefect(string eqpCode, DateTime toDt, string? appCode, string? modelCode, string? modelName)
	{
		dynamic obj = new ExpandoObject();
		obj.EqpCode = eqpCode;
		obj.ToDt = toDt;
		obj.AppCode = appCode;
		obj.ModelCode = modelCode;
		obj.ModelName = modelName;

		DataTable dt = DataContext.StringDataSet("@BBTDefect.DetailDefect", RefineExpando(obj, true)).Tables[0];


		return ToDic(dt);
	}


}
