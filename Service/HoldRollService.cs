namespace WebApp;

using System;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

public class HoldRollService : MinimalApiService, IMinimalApi, Map.IMap
{
    public HoldRollService(ILogger<HoldRollService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapPut("/set", nameof(InsertSet));
        group.MapPut("/off", nameof(InsertOff));

        return RouteAllEndpoint(group);
    }
    
    public static HoldRollList ListAll()
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;

		return new HoldRollList(DataContext.StringEntityList<HoldRollEntity>("@HoldRoll.List", RefineExpando(obj)));
    }
    
    public static HoldRollList List(string? rollId, string? holdCode)
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;
        obj.RollId = rollId;
        obj.HoldCode = holdCode;

        return new HoldRollList(DataContext.StringEntityList<HoldRollEntity>("@HoldRoll.List", RefineExpando(obj, true)));
    }

    public static HoldRollList ListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(),
            DateTime.Now.AddMinutes(GetCacheMin()),
            ListAll);

        return list;
    }
    public static int Delete(string rollId, string onDt)
    {
        dynamic obj = new ExpandoObject();
        obj.RollId = rollId;
        obj.OnDt = onDt;

        RemoveCache();

        return DataContext.StringNonQuery("@HoldRoll.Delete", RefineExpando(obj));
    }
    public static HoldRollEntity? Select(string rollId)
    {
        dynamic obj = new ExpandoObject();
        obj.rollId = rollId;

        return DataContext.StringEntity<HoldRollEntity>("@HoldRoll.Select", RefineExpando(obj, true));
    }

    public static int Insert([FromBody] HoldRollEntity entity)
    {
        //if (Select(panelId) != null)
        //    return -1;

        RemoveCache();

        //return DataContext.StringNonQuery("@BarcodeApi.Panel.InterlockInsert", new { entity.panelId, interlockCode, onRemark, onUpdateUser });
        return DataContext.StringNonQuery("@BarcodeApi.Roll.HoldRollInsert", new {});
    }

    [ManualMap]
    public static int InsertSet([FromBody] HoldRollEntity entity)
    {
        dynamic obj = new ExpandoObject();
        obj.rollId = entity.RollId;
        obj.holdYn = 'Y';
        obj.holdCode = entity.HoldCode;
        obj.onRemark = entity.OnRemark;
        obj.onUpdateUser = entity.OnUpdateUser;
        //panel_realtime
        int cnt = DataContext.StringNonQuery("@BarcodeApi.Roll.HoldYn", RefineExpando(obj, true));
        //panel_interlock
        int cnt2 = DataContext.StringNonQuery("@BarcodeApi.Roll.HoldInsert", RefineExpando(obj, true));

        return cnt;
    }
    [ManualMap]
    public static int InsertOff([FromBody] HoldRollEntity entity)
    {
        dynamic obj = new ExpandoObject();
        obj.rollId = entity.RollId;
        obj.holdYn = 'N';
        obj.offRemark = entity.OffRemark;
        obj.offUpdateUser = entity.OffUpdateUser;
        //panel_realtime
        int cnt = DataContext.StringNonQuery("@BarcodeApi.Roll.HoldYn", RefineExpando(obj, true));
        //panel_interlock
        int cnt2 = DataContext.StringNonQuery("@BarcodeApi.Roll.HoldCancelInsert", RefineExpando(obj, true));

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
