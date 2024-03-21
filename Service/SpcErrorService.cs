namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Dynamic;

using Framework;
using Microsoft.AspNetCore.Mvc;

public class SpcErrorService : MinimalApiService, IMinimalApi
{
	public SpcErrorService(ILogger<SpcErrorService> logger) : base(logger)
	{
	}

	public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
	{

		return RouteAllEndpoint(group);
	}

	public static IEnumerable<IDictionary> List(DateTime fromDt, DateTime toDt, string? workorder, string? modelCode)
	{
		dynamic obj = new ExpandoObject();

		obj.FromDt= SearchFromDt(fromDt);
		obj.ToDt = SearchToDt(toDt);
		obj.Workorder = workorder;
		obj.ModelCode = modelCode;

		DataTable dt = DataContext.StringDataSet("@SpcError.List", RefineExpando(obj, true)).Tables[0];

		return ToDic(dt);
	}

}

