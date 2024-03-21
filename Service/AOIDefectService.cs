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

public class AOIDefectService : MinimalApiService, IMinimalApi
{
    public AOIDefectService(ILogger<AOIDefectService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
		group.MapGet("totalmondefect", nameof(TotalMonDefect));
		group.MapGet("totalweekdefect", nameof(TotalWeekDefect));
		group.MapGet("totaldaydefect", nameof(TotalDayDefect));

		//group.MapGet("detaildefect", nameof(DetailDefect));

		group.MapGet("detailmondefect", nameof(DetailMonDefect));
		group.MapGet("detailweekdefect", nameof(DetailWeekDefect));
		group.MapGet("detaildaydefect", nameof(DetailDayDefect));

		return RouteAllEndpoint(group);
    }

    public static IEnumerable<IDictionary> List()
	{
		dynamic obj = new ExpandoObject();

		//DataTable dt = DataContext.StringDataSetEx(Setting.ErpConn, "@MonitoringDetail.AoiListYield", obj).Tables[0];
		DataTable dt = DataContext.StringDataSet("@AOIDefect.AOIList" , RefineExpando(obj, true)).Tables[0];

        return ToDic(dt);
	}

	[ManualMap]
	public static IEnumerable<IDictionary> TotalMonDefect(DateTime toDt, string? appCode, string? modelCode, string? modelName, string? layers)
	{
		dynamic obj = new ExpandoObject();
		obj.ToDt = SearchToDt(toDt);
		obj.AppCode = appCode;
		obj.ModelCode = modelCode;
		obj.ModelName = modelName;
		obj.Layer = layers;

		DataTable dt = DataContext.StringDataSet("@AOIDefect.AOIMonDefect", RefineExpando(obj, true)).Tables[0];

		return ToDic(dt);
	}

	[ManualMap]
	public static IEnumerable<IDictionary> TotalWeekDefect(DateTime toDt, string? appCode, string? modelCode, string? modelName, string? layers)
	{
		dynamic obj = new ExpandoObject();
        obj.ToDt = SearchToDt(toDt);
        obj.AppCode = appCode;
		obj.ModelCode = modelCode;
		obj.ModelName = modelName;
		obj.Layer = layers;

		DataTable dt = DataContext.StringDataSet("@AOIDefect.AOIWeekDefect", RefineExpando(obj, true)).Tables[0];

		return ToDic(dt);
	}

	[ManualMap]
	public static IEnumerable<IDictionary> TotalDayDefect(DateTime toDt, string? appCode, string? modelCode, string? modelName, string? layers)
	{
		dynamic obj = new ExpandoObject();
        obj.ToDt = SearchToDt(toDt);
        obj.AppCode = appCode;
		obj.ModelCode = modelCode;
		obj.ModelName = modelName;
		obj.Layer = layers;

		DataTable dt = DataContext.StringDataSet("@AOIDefect.AOIDayDefect", RefineExpando(obj, true)).Tables[0];

		return ToDic(dt);
	}

	[ManualMap]
	public static IEnumerable<IDictionary> DetailMonDefect(string eqpCode, DateTime toDt, string? appCode, string? modelCode, string? modelName, string? layers, string? ngCodes)
	{
		dynamic obj = new ExpandoObject();
		obj.EqpCode = eqpCode;
        obj.ToDt = SearchToDt(toDt);
        obj.AppCode = appCode;
		obj.ModelCode = modelCode;
		obj.ModelName = modelName;
		obj.Layer = layers;
		obj.NgCodes = ngCodes;

		DataTable dt = DataContext.StringDataSet("@AOIDefect.AOIMonDefect", RefineExpando(obj, true)).Tables[0];

		return ToDic(dt);
	}

	[ManualMap]
	public static IEnumerable<IDictionary> DetailWeekDefect(string eqpCode, DateTime toDt, string? appCode, string? modelCode, string? modelName, string? layers, string? ngCodes)
	{
		dynamic obj = new ExpandoObject();
		obj.EqpCode = eqpCode;
        obj.ToDt = SearchToDt(toDt);
        obj.AppCode = appCode;
		obj.ModelCode = modelCode;
		obj.ModelName = modelName;
		obj.Layer = layers;
		obj.NgCodes = ngCodes;

		DataTable dt = DataContext.StringDataSet("@AOIDefect.AOIWeekDefect", RefineExpando(obj, true)).Tables[0];

		return ToDic(dt);
	}

	[ManualMap]
	public static IEnumerable<IDictionary> DetailDayDefect(string eqpCode, DateTime toDt, string? appCode, string? modelCode, string? modelName, string? layers, string? ngCodes)
	{
		dynamic obj = new ExpandoObject();
		obj.EqpCode = eqpCode;
        obj.ToDt = SearchToDt(toDt); ;
		obj.AppCode = appCode;
		obj.ModelCode = modelCode;
		obj.ModelName = modelName;
		obj.Layer = layers;
		obj.NgCodes = ngCodes;

		DataTable dt = DataContext.StringDataSet("@AOIDefect.AOIDayDefect", RefineExpando(obj, true)).Tables[0];

		return ToDic(dt);
	}


}
