namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Dynamic;

using Framework;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

public class EqpRecipeParamCheckService : MinimalApiService, IMinimalApi
{
	public EqpRecipeParamCheckService(ILogger<EqpRecipeParamCheckService> logger) : base(logger)
	{
	}

	public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
	{
		return RouteAllEndpoint(group);
	}

	public static IEnumerable<IDictionary> List(string? rawType, string? eqpCode)
	{
		dynamic obj = new ExpandoObject();
		obj.EqpCode = eqpCode;

		DataTable dt = new DataTable();

		if (rawType == "L")
		{
			dt = DataContext.StringDataSet("@EqpRecipeParamCheck.PlcList", RefineExpando(obj, true)).Tables[0];
			FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

			// LastName이 있는 값들
			var containLast = dt.AsEnumerable().Where(x => x.TypeCol<string>("last_name").Contains("||") || x.TypeCol<string>("first_name").Contains("||")).ToList();
			// LastName이 없는 값들
			var noContainLast = dt.AsEnumerable().Where(x => !x.TypeCol<string>("last_name").Contains("||") || !x.TypeCol<string>("first_name").Contains("||")).ToList();

			// LastName 을 null 처리
			foreach (var item in noContainLast)
			{
				item["last_name"] = null;
			}
			// LastName이 들어가 있는 값을 Split 하고 First, Last 에 넣어줌
			foreach (var item in containLast)
			{
				string first_name = item.TypeCol<string>("first_name");
				// split 
				string[] split = first_name.Split("||");

				item["first_name"] = split[0];
				item["last_name"] = split[1];
			}
		}
		else if(rawType == "P")
		{
			dt = DataContext.StringDataSet("@EqpRecipeParamCheck.PcList", RefineExpando(obj, true)).Tables[0];
			FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);


			// LastName이 있는 값들
			var containLast = dt.AsEnumerable().Where(x => x.TypeCol<string>("last_name").Contains("||") || x.TypeCol<string>("first_name").Contains("||")).ToList();
			// LastName이 없는 값들
			var noContainLast = dt.AsEnumerable().Where(x => !x.TypeCol<string>("last_name").Contains("||") || !x.TypeCol<string>("first_name").Contains("||")).ToList();

			// LastName 을 null 처리
			foreach (var item in noContainLast)
			{
				item["last_name"] = null;
			}
			// LastName이 들어가 있는 값을 Split 하고 First, Last 에 넣어줌
			foreach (var item in containLast)
			{
				string first_name = item.TypeCol<string>("first_name");
				// split 
				string[] split = first_name.Split("||");

				item["first_name"] = split[0];
				item["last_name"] = split[1];
			}
		}

		return ToDic(dt);
	}

	public static int Update([FromBody] IDictionary dic)
	{
		string rawJson = dic.TypeKey<string>("rawJson");

		var rawList = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(rawJson);

		int result = 0;

		if (rawList.Count > 0)
		{
			var rawType = rawList[0].TypeKey<string>("rawType");
			dynamic obj = new ExpandoObject();
			obj.Json = rawJson;

			if (rawType == "L")
			{
				result = DataContext.StringNonQuery("@EqpRecipeParamCheck.PlcUpdate", RefineExpando(obj));
			}
			else
			{
				
				result = DataContext.StringNonQuery("@EqpRecipeParamCheck.PcUpdate", RefineExpando(obj));
				
			}
		}

		return result;
	}

	public static void RemoveCache()
	{
		UtilEx.RemoveCache(BuildCacheKey());
	}
}

