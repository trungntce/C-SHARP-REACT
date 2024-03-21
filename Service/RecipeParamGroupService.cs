namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Dynamic;

using Framework;
using Microsoft.AspNetCore.Mvc;

public class RecipeParamGroupService : MinimalApiService, IMinimalApi
{
	public RecipeParamGroupService(ILogger<RecipeParamGroupService> logger) : base(logger)
	{
	}

	public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
	{
		return RouteAllEndpoint(group);
	}

	public static IEnumerable<IDictionary> List(string? eqpCode)
	{
		dynamic obj = new ExpandoObject();

		obj.EqpCode = eqpCode;

		DataTable dt = DataContext.StringDataSet("@RecipeParamGroup.List", RefineExpando(obj, true)).Tables[0];

		return ToDic(dt);
	}

	public static void RemoveCache()
	{
		UtilEx.RemoveCache(BuildCacheKey());
	}
}

