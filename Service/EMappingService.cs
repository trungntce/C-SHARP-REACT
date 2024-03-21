namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Dynamic;
using System.Linq;
using Framework;

public class EMappingService : MinimalApiService, IMinimalApi
{
    public EMappingService(ILogger<EMappingService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
		group.MapGet("/sum", nameof(bbtPNLSumList));
		group.MapGet("/itempcs", nameof(ItemPcsList));
		group.MapGet("/pcs", nameof(PCSList));
        //group.MapGet("/pcsrate", nameof(PCSRateList));

        group.MapGet("/panel", nameof(PanelList));
        group.MapGet("/bbt", nameof(UnionBBTList));
        group.MapGet("/aoi", nameof(UnionAOIList));
        group.MapGet("/blackhole", nameof(UnionBlackHoleList));
        group.MapGet("/blackhole/bypanel", nameof(BlackHoleListByPanel));

        group.MapGet("/layout", nameof(LayoutList));
        group.MapPut("/layout", nameof(LayoutInsert));
        group.MapPost("/layout", nameof(LayoutUpdate));
        group.MapDelete("/layout", nameof(LayoutDelete));
        group.MapGet("/layout/select", nameof(LayoutSelect));
        group.MapGet("/layout/byworkorder", nameof(LayoutSelectByWorkorder));


		return RouteAllEndpoint(group);
    }

    public static IEnumerable<IDictionary> List(DateTime fromDt, DateTime toDt, string? itemCode, string? workorder, string? panelId)
    {
		dynamic obj = new ExpandoObject();
		obj.FromDt = SearchFromDt(fromDt);
		obj.ToDt = SearchToDt(toDt);
		obj.ItemCode = itemCode;
		obj.Workorder = workorder;
		obj.PanelId = panelId;

		DataTable dt = DataContext.StringDataSet("@EMapping.BBTPNLLIst", RefineExpando(obj, true)).Tables[0];

		return ToDic(dt);
    }

	[ManualMap]
	public static IEnumerable<IDictionary> bbtPNLSumList(DateTime fromDt, DateTime toDt, string? itemCode, string? workorder, string? panelId)
	{
		dynamic obj = new ExpandoObject();
		obj.FromDt = SearchFromDt(fromDt);
		obj.ToDt = SearchToDt(toDt);
		obj.ItemCode = itemCode;
		obj.Workorder = workorder;
		obj.PanelId = panelId;

		DataTable dt = DataContext.StringDataSet("@EMapping.BBTSumList", RefineExpando(obj, true)).Tables[0];

		return ToDic(dt);
	}

	[ManualMap] 
	public static IEnumerable<IDictionary> PCSList(string? workorder, string? panelId, string? judgeName, string? panelSeq)
	{

		DataTable rstDt = new DataTable();

		dynamic obj = new ExpandoObject();
		obj.JudgeName = judgeName;
		obj.PanelId = panelId?.Trim();
		obj.Workorder = workorder?.Trim();
        obj.PanelSeq = panelSeq;

		
		rstDt = DataContext.StringDataSet("@EMapping.BBTPNLPcs", RefineExpando(obj, true)).Tables[0];
		
		return ToDic(rstDt);
	}

	[ManualMap]
	public static IEnumerable<IDictionary> PCSRateList(string? workorder, string? panelId, string? judgeName)
	{

		DataTable rstDt = new DataTable();

		dynamic obj = new ExpandoObject();
		obj.JudgeName = judgeName;

		if (panelId != null)
		{
			obj.PanelId = panelId.Trim();
			rstDt = DataContext.StringDataSet("@EMapping.BBTPNLPcsRate", RefineExpando(obj, true)).Tables[0];
		}
		else if (workorder != null)
		{
			obj.Workorder = workorder.Trim();
			rstDt = DataContext.StringDataSet("@EMapping.BBTLOTPcsRate", RefineExpando(obj, true)).Tables[0];
		}

		return ToDic(rstDt);
	}

	[ManualMap]
	public static IEnumerable<IDictionary> ItemPcsList(string? itemCode)
	{
		dynamic obj = new ExpandoObject();
		obj.ItemCode = itemCode;

		DataTable dt = DataContext.StringDataSet("@EMapping.ItemPcsList", RefineExpando(obj, true)).Tables[0];

		return ToDic(dt);
	}

    [ManualMap]
    public static List<EMappingLayoutEntity> LayoutList(int pageNo, int pageSize, string? itemCode, string? modelCode, string? remark)
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = pageNo;
        obj.PageSize = pageSize;
        obj.ItemCode = itemCode;
        obj.ModelCode = modelCode;
        obj.Remark = remark;

        var list = DataContext.StringEntityList<EMappingLayoutEntity>("@EMapping.LayoutList", RefineExpando(obj, true));

        return list;
    }

    [ManualMap]
    public static EMappingLayoutEntity LayoutSelect(string modelCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ModelCode = modelCode;

        var entity = DataContext.StringEntity<EMappingLayoutEntity>("@EMapping.LayoutSelect", RefineExpando(obj, true));

        return entity;
    }

    [ManualMap]
    public static EMappingLayoutEntity LayoutSelectByWorkorder(string workorder)
    {
        dynamic obj = new ExpandoObject();
        obj.Workorder = workorder;

        var entity = DataContext.StringEntity<EMappingLayoutEntity>("@EMapping.LayoutSelectByWorkorder", RefineExpando(obj, true));

        return entity;
    }

    [ManualMap]
    public static int LayoutInsert(EMappingLayoutEntity entity)
    {
        return DataContext.StringNonQuery("@EMapping.LayoutInsert", RefineEntity(entity));
    }

    [ManualMap]
    public static int LayoutUpdate(EMappingLayoutEntity entity)
    {
        return DataContext.StringNonQuery("@EMapping.LayoutUpdate", RefineEntity(entity));
    }

    [ManualMap]
    public static int LayoutDelete(string modelCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ModelCode = modelCode;

        return DataContext.StringNonQuery("@EMapping.LayoutDelete", RefineExpando(obj, true));
    }

    [ManualMap]
    public static IEnumerable<IDictionary> UnionBBTList(string workorder)
    {
        dynamic obj = new ExpandoObject();
        obj.Workorder = workorder;

        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        DataTable dt = db.ExecuteStringDataSet("@EMapping.UnionBBTList", RefineExpando(obj, true)).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> UnionAOIList(string workorder)
    {
        dynamic obj = new ExpandoObject();
        obj.Workorder = workorder;

        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        DataTable dt = db.ExecuteStringDataSet("@EMapping.UnionAOIList", RefineExpando(obj, true)).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> UnionBlackHoleList(string workorder)
    {
        dynamic obj = new ExpandoObject();
        obj.Workorder = workorder;

        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        DataTable dt = db.ExecuteStringDataSet("@EMapping.UnionBlackHoleList", RefineExpando(obj, true)).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static IResult BlackHoleListByPanel(string workorder, string? panelId)
    {
        dynamic obj = new ExpandoObject();

        obj.Workorder = workorder;
        obj.PanelId = panelId;

        DataTable dt = DataContext.StringDataSet("@EMapping.BlackHoleListByPanel", RefineExpando(obj, true)).Tables[0];
        return Results.Json(ToDic(dt));
    }

    [ManualMap]
    public static IEnumerable<IDictionary> PanelList(string workorder)
    {
        dynamic obj = new ExpandoObject();
        obj.Workorder = workorder;

        DataTable dt = DataContext.StringDataSet("@EMapping.PanelList", RefineExpando(obj, true)).Tables[0];

        return ToDic(dt);
    }
}