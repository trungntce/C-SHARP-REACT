namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;

public class NgReportService : MinimalApiService, IMinimalApi
{
    public NgReportService(ILogger<NgReportService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/paramnext", nameof(ParamNgNextList));
        group.MapGet("/recipenext", nameof(RecipeNgNextList));
        group.MapGet("/spcnext", nameof(SpcNgNextList));

        group.MapGet("/paramng", nameof(ParamNgList));
		group.MapGet("/spcng", nameof(SpcNgList));

        group.MapGet("/param", nameof(MutiNgListParam));
        group.MapGet("/spc", nameof(MutiNgListSpc));
        group.MapGet("/anal", nameof(MutiNgListAnal));

        group.MapGet("/eqpspc", nameof(EqpSpcJudgeList));

        group.MapGet("/paramcount", nameof(MutiNgCountParam));
		group.MapGet("/spccount", nameof(MutiNgCountSpc));
		group.MapGet("/analcount", nameof(MutiNgCountAnal));

		return RouteAllEndpoint(group);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> ParamNgNextList(DateTime fromDt, DateTime toDt, string? eqpCode, string? workorder, string? modelCode, string? modelName)
    {
        dynamic obj = new ExpandoObject();
        obj.FromDt = fromDt.AddHours(8);
        obj.ToDt = toDt.AddDays(1).AddHours(7).AddMinutes(59).AddSeconds(59);
        obj.EqpCode = eqpCode;
        obj.Workorder = workorder;
        obj.ModelCode = modelCode;
        obj.ModelName = modelName;

        DataTable dt = DataContext.StringDataSet("@NgReport.ParamNgNextList", RefineExpando(obj, true)).Tables[0];

        FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);
        FindLabel(dt, "eqpCodeNg", "eqpNameNg", (Func<string, string>)ErpEqpService.SelectCacheName);

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> RecipeNgNextList(DateTime fromDt, DateTime toDt, string? eqpCode, string? workorder, string? modelCode, string? modelName)
    {
        dynamic obj = new ExpandoObject();
        obj.FromDt = fromDt.AddHours(8);
        obj.ToDt = toDt.AddDays(1).AddHours(7).AddMinutes(59).AddSeconds(59);
        obj.EqpCode = eqpCode;
        obj.Workorder = workorder;
        obj.ModelCode = modelCode;
        obj.ModelName = modelName;

        DataTable dt = DataContext.StringDataSet("@NgReport.RecipeNgNextList", RefineExpando(obj, true)).Tables[0];

        FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);
        FindLabel(dt, "eqpCodeNg", "eqpNameNg", (Func<string, string>)ErpEqpService.SelectCacheName);

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> SpcNgNextList(DateTime fromDt, DateTime toDt, string? eqpCode, string? workorder, string? modelCode, string? modelName)
    {
        dynamic obj = new ExpandoObject();
        obj.FromDt = fromDt.AddHours(8);
        obj.ToDt = toDt.AddDays(1).AddHours(7).AddMinutes(59).AddSeconds(59);
        obj.EqpCode = eqpCode;
        obj.Workorder = workorder;
        obj.ModelCode = modelCode;
        obj.ModelName = modelName;

        DataTable dt = DataContext.StringDataSet("@NgReport.SpcNgNextList", RefineExpando(obj, true)).Tables[0];

        FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);
        FindLabel(dt, "eqpCodeNg", "eqpNameNg", (Func<string, string>)ErpEqpService.SelectCacheName);

        return ToDic(dt);
    }

	[ManualMap]
	public static IEnumerable<IDictionary> ParamNgList(DateTime fromDt, DateTime toDt, string? workorder, string? eqpCode, string? modelCode, string? modelName)
	{
		dynamic obj = new ExpandoObject();
        obj.FromDt = fromDt.AddHours(8);
        obj.ToDt = toDt.AddDays(1).AddHours(7).AddMinutes(59).AddSeconds(59);
        obj.EqpCode = eqpCode;
		obj.Workorder = workorder;
        obj.ModelCode = modelCode;
		obj.ModelName = modelName;

		DataTable dt = DataContext.StringDataSet("@NgReport.ParamNgList", RefineExpando(obj, true)).Tables[0];

        FindLabel(dt, "eqpCodeNg", "eqpNameNg", (Func<string, string>)ErpEqpService.SelectCacheName);

        return ToDic(dt);
	}


	[ManualMap]
	public static IEnumerable<IDictionary> SpcNgList(DateTime fromDt, DateTime toDt, string? workorder, string? eqpCode, string? modelCode, string? modelName)
	{
		dynamic obj = new ExpandoObject();
        obj.FromDt = fromDt.AddHours(8);
        obj.ToDt = toDt.AddDays(1).AddHours(7).AddMinutes(59).AddSeconds(59);
        obj.EqpCode = eqpCode;
		obj.Workorder = workorder;
		obj.ModelCode = modelCode;
		obj.ModelName = modelName;

		DataTable dt = DataContext.StringDataSet("@NgReport.SpcNgList", RefineExpando(obj, true)).Tables[0];

		FindLabel(dt, "eqpCodeNg", "eqpNameNg", (Func<string, string>)ErpEqpService.SelectCacheName);

		return ToDic(dt);
	}

	[ManualMap]
	public static IEnumerable<IDictionary> MutiNgListParam(DateTime fromDt, DateTime toDt, string? workorder, string? eqpCode, string? modelCode, string? modelName, string? unit)
	{
		dynamic obj = new ExpandoObject();
        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);
        obj.EqpCode = eqpCode;
		obj.Workorder = workorder;
		obj.ModelCode = modelCode;
		obj.ModelName = modelName;

		List<IEnumerable<IDictionary>> lstData = new List<IEnumerable<IDictionary>>();

		if (unit == "lot")
        {
			DataTable dt = DataContext.DataSet("dbo.sp_panel_4m_param_row_group_list", obj).Tables[0];

            FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

            return ToDic(dt);
		}
		else
        {
			DataTable dt = DataContext.StringDataSet("@NgReport.ParamNgList", RefineExpando(obj, true)).Tables[0];

			FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

            return ToDic(dt);
        }
	}

    [ManualMap]
    public static IEnumerable<IDictionary> MutiNgListSpc(DateTime fromDt, DateTime toDt, string? workorder, string? eqpCode, string? modelCode, string? modelName, string? unit)
    {
        dynamic obj = new ExpandoObject();
        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);
        obj.EqpCode = eqpCode;
        obj.Workorder = workorder;
        obj.ModelCode = modelCode;
        obj.ModelName = modelName;

        if (unit == "lot")
        {
            DataTable dt = DataContext.StringDataSet("@NgReport.SpcNgLotList", RefineExpando(obj, true)).Tables[0];

            return ToDic(dt);
        }
        else
        {
            DataTable dt = DataContext.StringDataSet("@NgReport.SpcNgList", RefineExpando(obj, true)).Tables[0];

            return ToDic(dt);
        }
    }

    [ManualMap]
    public static IEnumerable<IDictionary> MutiNgListAnal(DateTime fromDt, DateTime toDt, string? workorder, string? eqpCode, string? modelCode, string? modelName, string? unit)
    {
        dynamic obj = new ExpandoObject();
        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);
        obj.EqpCode = eqpCode;
        obj.Workorder = workorder;
        obj.ModelCode = modelCode;
        obj.ModelName = modelName;

        DataTable dt = DataContext.StringDataSetEx(Setting.ErpConn, "@NgReport.AnalysisList", RefineExpando(obj)).Tables[0];

        return ToDic(dt);
    }


	[ManualMap]
	public static IEnumerable<IDictionary> MutiNgCountParam(DateTime fromDt, DateTime toDt, string? workorder, string? eqpCode, string? modelCode, string? modelName, string? unit)
	{
		dynamic obj = new ExpandoObject();
        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);
        obj.EqpCode = eqpCode;
		obj.Workorder = workorder;
		obj.ModelCode = modelCode;
		obj.ModelName = modelName;

		List<IEnumerable<IDictionary>> lstData = new List<IEnumerable<IDictionary>>();

		if (unit == "lot")
		{
			DataTable dt = DataContext.StringDataSet("@NgReport.ParamNgLotCountList", RefineExpando(obj, true)).Tables[0];
			//DataTable dt1 = DataContext.StringDataSet("@NgReport.SpcNgLotCountList", RefineExpando(obj, true)).Tables[0];
			//DataTable dt2 = DataContext.StringDataSetEx(Setting.ErpConn, "@NgReport.AnalysisCountList", RefineExpando(obj)).Tables[0];

			//DataTable mergedDataTable = MergeDataTables(dt, dt1, dt2);

			return ToDic(dt);
		}
		else
		{
			DataTable dt = DataContext.StringDataSet("@NgReport.ParamNgCountList", RefineExpando(obj, true)).Tables[0];

			return ToDic(dt);
		}
	}

	[ManualMap]
	public static IEnumerable<IDictionary> MutiNgCountSpc(DateTime fromDt, DateTime toDt, string? workorder, string? eqpCode, string? modelCode, string? modelName, string? unit)
	{
		dynamic obj = new ExpandoObject();
        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);
        obj.EqpCode = eqpCode;
		obj.Workorder = workorder;
		obj.ModelCode = modelCode;
		obj.ModelName = modelName;

		if (unit == "lot")
		{
			DataTable dt = DataContext.StringDataSet("@NgReport.SpcNgLotCountList", RefineExpando(obj, true)).Tables[0];

			return ToDic(dt);
		}
		else
		{
			DataTable dt = DataContext.StringDataSet("@NgReport.SpcNgCountList", RefineExpando(obj, true)).Tables[0];

			return ToDic(dt);
		}
	}

	[ManualMap]
	public static IEnumerable<IDictionary> MutiNgCountAnal(DateTime fromDt, DateTime toDt, string? workorder, string? eqpCode, string? modelCode, string? modelName, string? unit)
	{
		dynamic obj = new ExpandoObject();
        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);
        obj.EqpCode = eqpCode;
		obj.Workorder = workorder;
		obj.ModelCode = modelCode;
		obj.ModelName = modelName;

		DataTable dt = DataContext.StringDataSetEx(Setting.ErpConn, "@NgReport.AnalysisCountList", RefineExpando(obj)).Tables[0];

		return ToDic(dt);
	}

    [ManualMap]
    public static IEnumerable<IDictionary> EqpSpcJudgeList(DateTime fromDt, DateTime toDt, string? spcType, string? workorder, string? eqpCode, string? itemCode, string? itemName, string? modelCode, string? modelName)
    {
        dynamic obj = new ExpandoObject();
        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);
        obj.SpcType = spcType;
        obj.EqpCode = eqpCode;
        obj.Workorder = workorder;
        obj.ItemCode = itemCode;
        obj.ItemName = itemName;
        obj.ModelCode = modelCode;
        obj.ModelName = modelName;

        DataTable dt = DataContext.StringDataSet("@NgReport.EqpSpcJudgeList", RefineExpando(obj)).Tables[0];

        FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

        return ToDic(dt);
    }

    static DataTable MergeDataTables(params DataTable[] dataTables)
	{
		DataTable mergedDataTable = new DataTable();

		foreach (DataTable dataTable in dataTables)
		{
			mergedDataTable.Merge(dataTable);
		}

		return mergedDataTable;
	}
}

