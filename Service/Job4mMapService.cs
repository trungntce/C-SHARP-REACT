namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Dynamic;
using System.Linq;
using Framework;

public class Job4mMapService : MinimalApiService, IMinimalApi
{
    public Job4mMapService(ILogger<Job4mMapService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }

    public static IResult List(DateTime fromDt, DateTime toDt, string? modelCode, string? workcenterCode, string? eqpCode, string? workorder, string? status, string? itemCode, bool isExcel = false)
    {
		dynamic obj = new ExpandoObject();
		obj.FromDt = SearchFromDt(fromDt);
		obj.ToDt = SearchToDt(toDt);
		obj.ModelCode = modelCode;
		obj.WorkcenterCode = workcenterCode;
		obj.EqpCode = eqpCode;
		obj.Workorder = workorder;
		obj.Status = status;
		obj.ItemCode = itemCode;

		var dt = DataContext.StringDataSet("@Job4mMap.List", RefineExpando(obj, true)).Tables[0];

		if (!isExcel)
			return Results.Json(ToDic(dt));

		return ExcelDown(dt, "Job4M");

    }

	[ManualMap]
	public static IResult ExcelDown(DataTable dt, string fileName)
	{
		List<Tuple<string, string, double, Type, Func<DataRow, object>?>> mapList = new()
		{
			//new("creationDate", "일자", 17, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("creation_date")?.ToString("yyyy-MM-dd HH:mm") ?? string.Empty; }),
			new("modelMes", "모델코드(MES)", 35, typeof(string), null),
            new("modelErp", "모델코드(ERP)", 35, typeof(string), null),
            new("bomItemDescription", "모델명", 35, typeof(string), null),
			new("itemCode", "제품코드", 35, typeof(string), null),
			new("itemName", "제품명", 35, typeof(string), null),
			new("operationSeqNo", "공정 순서", 35, typeof(string), null),
			new("operationDescription", "공정명", 35, typeof(string), null),
			new("workcenterDescription", "작업장명", 35, typeof(string), null),
			new("equipmentCode", "설비코드", 35, typeof(string), null),
			new("equipmentDescription", "설비명", 35, typeof(string), null),
			new("jobNo", "LOT NO", 35, typeof(string), null),

			new("qty", "LOT 수량", 17, typeof(int), null),
			new("ngJudge", "4M NG", 35, typeof(string), null),

			new("startDt", "4m 시작 시간", 17, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("start_dt")?.ToString("yyyy-MM-dd HH:mm") ?? string.Empty; }),
			new("endDt", "4m 종료 시간", 17, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("end_dt")?.ToString("yyyy-MM-dd HH:mm") ?? string.Empty; }),

            new("worker_code", "작업자 코드", 35, typeof(string), null),
            new("worker_name", "작업자명", 35, typeof(string), null),
			new("4m_msg", "4M 메세지", 50, typeof(string), null),
		};

		using var excel = ExcelEx.ToExcel(dt, mapList);

		return Results.File(excel.GetAsByteArray(), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
	}
}
