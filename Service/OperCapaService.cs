namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Dynamic;

using Framework;
using Microsoft.AspNetCore.Mvc;

public class OperCapaService : MinimalApiService, IMinimalApi
{
	public OperCapaService(ILogger<OperCapaService> logger) : base(logger)
	{
	}

	public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
	{

		return RouteAllEndpoint(group);
	}

	public static IEnumerable<IDictionary> List(string? operGroupName)
	{
		dynamic obj = new ExpandoObject();

		obj.OperGroupName = operGroupName;

		DataTable dt = DataContext.StringDataSet("@OperCapa.List", RefineExpando(obj, true)).Tables[0];

		return ToDic(dt);
	}

	public static int Insert([FromBody] OperCapaEntity entity)
	{

		RemoveCache();

		return DataContext.StringNonQuery("@OperCapa.Insert", RefineEntity(entity));
	}

	public static int Update([FromBody] OperCapaEntity entity)
	{
		RemoveCache();

		return DataContext.StringNonQuery("@OperCapa.Update", RefineEntity(entity));
	}

	public static int Delete(int rowNo)
	{
		dynamic obj = new ExpandoObject();
		obj.RowNo = rowNo;

		RemoveCache();

		return DataContext.StringNonQuery("@OperCapa.Delete", RefineExpando(obj));
	}

	public static void RemoveCache()
	{
		UtilEx.RemoveCache(BuildCacheKey());
	}

}

