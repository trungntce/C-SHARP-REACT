namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Dynamic;

using Framework;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

public class RollSplitService : MinimalApiService, IMinimalApi
{
	public RollSplitService(ILogger<RollSplitService> logger) : base(logger)
	{
	}

	public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
	{
		group.MapGet("/rollsplittree", nameof(RollSplitTree));
		group.MapGet("/rollpanel", nameof(RollSplitPanelList));

		return RouteAllEndpoint(group);
	}

	public static IEnumerable<IDictionary> List(string? rollId, DateTime fromDt, DateTime toDt)
	{
		dynamic obj = new ExpandoObject();

		obj.RollId = rollId;
		obj.FromDt= SearchFromDt(fromDt);
		obj.ToDt = SearchToDt(toDt);

		DataTable dt = DataContext.StringDataSet("@RollSplit.List", RefineExpando(obj, true)).Tables[0];

		return ToDic(dt);
	}

	[ManualMap]
	public static IResult RollSplitTree(string? childId, bool isExcel = false)
	{
		dynamic obj = new ExpandoObject();

		obj.RollId = childId;


		DataTable dt = DataContext.DataSet("dbo.sp_roll_map_list_tree", RefineExpando(obj, true)).Tables[0];
		FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

		if (!isExcel)
			return Results.Json(ToDic(dt));

		return ExcelDown(dt, "ROLL_분할이력"); ;
	}

	public static void RemoveCache()
	{
		UtilEx.RemoveCache(BuildCacheKey());
	}

	[ManualMap]
	public static IEnumerable<IDictionary> RollSplitPanelList(string? workorder, string? eqpCode, string? parentId, string? childId)
	{
		dynamic obj = new ExpandoObject();
		obj.Workorder = workorder;
		obj.EqpCode = eqpCode;
		obj.ChildId = parentId != null ? parentId : childId;

		DataTable dt = DataContext.StringDataSet("@RollSplit.RollSplitPanelList", RefineExpando(obj, true)).Tables[0];

		return ToDic(dt);
	}

	[ManualMap]
	public static IResult ExcelDown(DataTable dt, string fileName)
	{

		List<Tuple<string, string, double, Type, Func<DataRow, object>?>> mapList = new()
		{
			new("child_id", "ROLL ID", 35, typeof(string), null),
			new("parent_id", "Parent Roll", 40, typeof(string), null),
			new("workorder", "BATCH", 50, typeof(string), null),
			new("defect_name", "불량명", 35, typeof(string), null),
			new("worker_name", "작업자", 35, typeof(string), null),
			new("reason", "분할사유", 45, typeof(string), null),
			new("create_dt", "분할시기", 35, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("create_dt")?.ToString("yyyy-MM-dd") ?? string.Empty; }),
			

		};

		using var excel = ExcelEx.ToExcel(dt, mapList);

		return Results.File(excel.GetAsByteArray(), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
	}

}

