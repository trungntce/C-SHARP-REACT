namespace WebApp;

using System;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

public class HoldPanelService : MinimalApiService, IMinimalApi, Map.IMap
{
    public HoldPanelService(ILogger<HoldPanelService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapPut("/set", nameof(InsertSet));
        group.MapPut("/off", nameof(InsertOff));

        return RouteAllEndpoint(group);
    }
    
    public static HoldPanelList ListAll()
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;

		return new HoldPanelList(DataContext.StringEntityList<HoldPanelEntity>("@HoldPanel.List", RefineExpando(obj)));
    }
    
    public static HoldPanelList List(string? panelId, string? holdCode)
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;
        obj.PanelId = panelId;
        obj.HoldCode = holdCode;

        return new HoldPanelList(DataContext.StringEntityList<HoldPanelEntity>("@HoldPanel.List", RefineExpando(obj, true)));
    }

    public static HoldPanelList ListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(),
            DateTime.Now.AddMinutes(GetCacheMin()),
            ListAll);

        return list;
    }
    public static int Delete(string panelId, string onDt)
    {
        dynamic obj = new ExpandoObject();
        obj.PanelId = panelId;
        obj.OnDt = onDt;

        RemoveCache();

        return DataContext.StringNonQuery("@HoldPanel.Delete", RefineExpando(obj));
    }
    public static HoldPanelEntity? Select(string panelId)
    {
        dynamic obj = new ExpandoObject();
        obj.panelId = panelId;

        return DataContext.StringEntity<HoldPanelEntity>("@HoldPanel.Select", RefineExpando(obj, true));
    }

    public static int Insert([FromBody] HoldPanelEntity entity)
    {
        //if (Select(panelId) != null)
        //    return -1;

        RemoveCache();

        //return DataContext.StringNonQuery("@BarcodeApi.Panel.InterlockInsert", new { entity.panelId, interlockCode, onRemark, onUpdateUser });
        return DataContext.StringNonQuery("@BarcodeApi.Panel.HoldInsert", new {});
    }

    [ManualMap]
    public static int InsertSet([FromBody] HoldPanelEntity entity)
    {
        dynamic obj = new ExpandoObject();
        obj.panelId = entity.PanelId;
        obj.holdYn = 'Y';
        obj.holdCode = entity.HoldCode;
        obj.onRemark = entity.OnRemark;
        obj.onUpdateUser = entity.OnUpdateUser;
        //panel_realtime
        int cnt = DataContext.StringNonQuery("@BarcodeApi.Panel.HoldYn", RefineExpando(obj, true));
        //panel_interlock
        int cnt2 = DataContext.StringNonQuery("@BarcodeApi.Panel.HoldInsert", RefineExpando(obj, true));

        return cnt;
    }
    [ManualMap]
    public static int InsertOff([FromBody] HoldPanelEntity entity)
    {
        dynamic obj = new ExpandoObject();
        obj.panelId = entity.PanelId;
        obj.holdYn = 'N';
        obj.offRemark = entity.OffRemark;
        obj.offUpdateUser = entity.OffUpdateUser;
        //panel_realtime
        int cnt = DataContext.StringNonQuery("@BarcodeApi.Panel.HoldYn", RefineExpando(obj, true));
        //panel_interlock
        int cnt2 = DataContext.StringNonQuery("@BarcodeApi.Panel.HoldCancelInsert", RefineExpando(obj, true));

        return cnt;
    }
    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }

    public static Map GetMap(string? category = null)
    {
        throw new NotImplementedException();

    }

    public static void RefreshMap()
    {
        RemoveCache();
    }
}
