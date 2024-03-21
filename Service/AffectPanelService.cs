namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Data.SqlClient;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

public class AffectPanelService : MinimalApiService, IMinimalApi
{
    public AffectPanelService(ILogger<AffectPanelService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/param", nameof(ParamList));
        group.MapGet("/param/panel", nameof(AffectPanelList));

        group.MapGet("/panel", nameof(PanelList));
        group.MapGet("/recipeparam", nameof(PanelParamRecipeList));

        return RouteAllEndpoint(group);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> ParamList(DateTime fromDt, DateTime toDt, string? workorder, string? vendorCode, string? itemCode, string? itemName, string? modelCode, string? modelName, string? panelId, char? judge)
    {
        dynamic obj = new ExpandoObject();
        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);
        obj.Workorder = workorder;
        obj.VendorCode = vendorCode;
        obj.ItemCode = itemCode;
        obj.ItemName = itemName;
        obj.ModelCode = modelCode;
        obj.ModelName = modelName;
        obj.PanelId = panelId;
        obj.Judge = judge;

        DataTable dt = DataContext.StringDataSet("@AffectPanel.ParamList", RefineExpando(obj, true)).Tables[0];

        FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

        return ToDic(dt);
    }


    [ManualMap]
    public static IEnumerable<IDictionary> AffectPanelList(string? workorder, string? operSeqNo, string? eqpCode, DateTime eqpStartDt, DateTime eqpEndDt)
    {
        dynamic obj = new ExpandoObject();
        obj.Workorder = workorder;
        obj.OperSeqNo = operSeqNo;
        obj.EqpCode = eqpCode;
        obj.FromDt = eqpStartDt;
        obj.ToDt = eqpEndDt;

        DataTable dt = DataContext.DataSet("dbo.sp_panel_item_list", RefineExpando(obj, true)).Tables[0];

        FindLabel(dt, "paramJudge", "paramJudgeName", (string value) => CodeService.CodeName("PANEL_JUDGE", value));
        FindLabel(dt, "recipeJudge", "recipeJudgeName", (string value) => CodeService.CodeName("PANEL_JUDGE", value));

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> PanelList(DateTime fromDt, DateTime toDt, string? workorder, string? vendorCode, string? itemCode, string? itemName, string? modelCode, string? modelName)
    {
        dynamic obj = new ExpandoObject();
        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);
        obj.Workorder = workorder;
        obj.VendorCode = vendorCode;
        obj.ItemCode = itemCode;
        obj.ItemName = itemName;
        obj.ModelCode = modelCode;
        obj.ModelName = modelName;

        DataTable dt = DataContext.StringDataSet("@AffectPanel.PanelList", RefineExpando(obj, true)).Tables[0];

        FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

        FindLabel(dt, "paramJudge", "paramJudgeName", (string value) => CodeService.CodeName("PANEL_JUDGE", value));
        FindLabel(dt, "recipeJudge", "recipeJudgeName", (string value) => CodeService.CodeName("PANEL_JUDGE", value));

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IEnumerable<IDictionary>> PanelParamRecipeList(string itemKey)
    {
        dynamic obj = new ExpandoObject();
        obj.ItemKey = itemKey;

        DataSet ds = DataContext.StringDataSet("@AffectPanel.PanelParamRecipeList", obj);
        DataTable dtParam = ds.Tables[0];
        DataTable dtRecipe = ds.Tables[1];

        return new List<IEnumerable<IDictionary>>() { ToDic(dtParam), ToDic(dtRecipe) };
    }
}
