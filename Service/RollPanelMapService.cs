namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Dynamic;

using Framework;
using Microsoft.AspNetCore.Mvc;

public class RollPanelMapService : MinimalApiService, IMinimalApi
{
	public RollPanelMapService(ILogger<RollPanelMapService> logger) : base(logger)
	{
	}

	public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
	{
        group.MapGet("/pcsmatch", nameof(PcsMatchList));
        return RouteAllEndpoint(group);
	}

	public static IEnumerable<IDictionary> List(DateTime fromDt, DateTime toDt, string? rollId, string? panelId, string? workorder)
	{
		dynamic obj = new ExpandoObject();

		obj.FromDt = SearchFromDt(fromDt);
		obj.ToDt = SearchToDt(toDt);
		obj.Workorder = workorder;
		obj.RollId = rollId;
		obj.PanelId = panelId;

		DataTable dt = DataContext.StringDataSet("@RollPanelMap.List", RefineExpando(obj, true)).Tables[0];

		FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

		return ToDic(dt);
	}

    [ManualMap]
    public static IResult PcsMatchList(DateTime fromDt, DateTime toDt, string? searchcolumn, string? rollid, string? sheetid, string? panelid, string? batch, string? pieceid, bool isExcel = false)
    {
        DateTime FromDt = SearchFromDt(fromDt);
        DateTime ToDt   = SearchToDt(toDt);
        DataTable dt = DataContext.DataSet("dbo.sp_roll_panel_sheet_pcs_match_list", new { FromDt, ToDt, searchcolumn, rollid, panelid, batch, sheetid, pieceid }).Tables[0];

		if (!isExcel ) { 
			return Results.Json(ToDic(dt));
        }

        return ExcelDownPcsMatch(dt, "PCSMATCH");
    }

    [ManualMap]
    public static IResult ExcelDownPcsMatch(DataTable dt, string fileName)
	{
		var today = DateTime.Now;

        List<Tuple<string, string, double, Type, Func<DataRow, object>?>> mapList = new()
        {
            new("workinDt", "투입일자", 17, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("workinDt")?.ToString("yyyy-MM-dd HH:mm") ?? string.Empty; }),
            new("completeDt", "완료일자", 17, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("completeDt")?.ToString("yyyy-MM-dd HH:mm") ?? string.Empty; }),
            new("outDt", "출하일자", 17, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("outDt")?.ToString("yyyy-MM-dd HH:mm") ?? string.Empty; }),

            new("roll_id", "Roll Code", 25, typeof(string), null),
            new("model_id", "Model Code", 25, typeof(string), null),
            new("LotNo", "Batch", 25, typeof(string), null),
            new("PnlCode", "Panel Code", 25, typeof(string), null),
            new("sheet_id", "Sheet Code", 25, typeof(string), null),
            new("piece_id", "PCS Code", 25, typeof(string), null),
        };

        using var excel = ExcelEx.ToExcel(dt, mapList);

        return Results.File(excel.GetAsByteArray(), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }
}

