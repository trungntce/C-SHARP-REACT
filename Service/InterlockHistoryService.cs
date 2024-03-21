namespace WebApp;

using System;
using System.Data;
using System.Diagnostics.Eventing.Reader;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

public class InterlockHistoryService : MinimalApiService, IMinimalApi, Map.IMap
{
    public InterlockHistoryService(ILogger<InterlockHistoryService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapPut("/set", nameof(InsertSet));
        group.MapPut("/off", nameof(InsertOff));
		group.MapPut("/rollset", nameof(RollUpdate));
		group.MapPut("/offchecker", nameof(InsertOffChecker));        
        group.MapGet("/rollpanelmaplist", nameof(RollPanelMapList));
        group.MapPost("/deletelist", nameof(DeleteList));

        return RouteAllEndpoint(group);
    }
    
    public static InterlockHistoryList ListAll()
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;

		return new InterlockHistoryList(DataContext.StringEntityList<InterlockHistoryEntity>("@InterlockHistory.List", RefineExpando(obj,true)));
    }
    
    public static InterlockHistoryList List(DateTime fromDt, DateTime toDt, string? panelId, string? rollId, char? autoYn, char? offYn, string? interlockCode, string? interlockName)
    {
        dynamic obj = new ExpandoObject();
        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);
        obj.PanelId = panelId;
        obj.RollId = rollId;
        obj.AutoYn = autoYn;
        obj.OffYn = offYn;
        obj.InterlockCode = interlockCode;
        obj.InterlockName = interlockName;

        return new InterlockHistoryList(DataContext.StringEntityList<InterlockHistoryEntity>("@InterlockHistory.List", RefineExpando(obj, true)));
    }

    public static InterlockHistoryList ListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(),
            DateTime.Now.AddMinutes(GetCacheMin()),
            ListAll);

        return list;
    }
    [ManualMap]
    public static int DeleteList([FromBody]List<InterlockHistoryEntity> list)
    {
        dynamic obj = new ExpandoObject();
        obj.Json = JsonConvert.SerializeObject(list);
        RemoveCache();

        int cnt = DataContext.StringNonQuery("@InterlockHistory.DeleteList", RefineExpando(obj));
        return cnt;
    }
    public static int Delete(string panelId, string onDt)
    {
        dynamic obj = new ExpandoObject();
        obj.PanelId = panelId;
        obj.OnDt = onDt;

        RemoveCache();

        return DataContext.StringNonQuery("@InterlockHistory.Delete", RefineExpando(obj));
    }
    public static InterlockHistoryEntity? Select(string panelId)
    {
        dynamic obj = new ExpandoObject();
        obj.panelId = panelId;

        return DataContext.StringEntity<InterlockHistoryEntity>("@Interlock.Select", RefineExpando(obj, true));
    }

    public static int Insert([FromBody] InterlockHistoryEntity entity)
    {
        //if (Select(panelId) != null)
        //    return -1;

        RemoveCache();

        //return DataContext.StringNonQuery("@BarcodeApi.Panel.InterlockInsert", new { entity.panelId, interlockCode, onRemark, onUpdateUser });
        return DataContext.StringNonQuery("@BarcodeApi.Panel.InterlockInsert", new {});
    }
    public static int Update([FromBody] InterlockHistoryEntity entity)
    {
        dynamic obj = new ExpandoObject();
        //obj.panelId = entity.PanelId;
        obj.interlockYn = 'Y';
        obj.panelInterlockId = entity.PanelInterlockId;
        obj.onDt = entity.OnDt;
        if (entity.AutoYn != 'Y') obj.autoYn = 'N';
        obj.interlockCode = entity.InterlockCode;
        obj.onRemark = entity.OnRemark;
        obj.onUpdateUser = entity.OnUpdateUser;
        //panel_interlock
        int cnt2 = DataContext.StringNonQuery("@InterlockHistory.Update", RefineExpando(obj, true));

        return cnt2;
    }

    [ManualMap]
    public static int RollUpdate([FromBody] List<InterlockHistoryEntity> list)
    {
		dynamic obj = new ExpandoObject();
		obj.Json = JsonConvert.SerializeObject(list);
		RemoveCache();

        int result = DataContext.StringNonQuery("@InterlockHistory.RollUpdate", RefineExpando(obj));

		return result;
    }

	[ManualMap]
    public static int InsertSet([FromBody] InterlockHistoryEntity entity)
    {
        dynamic obj = new ExpandoObject();
        obj.panelId = entity.PanelId;
        obj.interlockYn = 'Y';
        if(entity.AutoYn != 'Y') obj.autoYn = 'N';
        obj.interlockCode = entity.InterlockCode;
        obj.onRemark = entity.OnRemark;
        obj.onUpdateUser = entity.OnUpdateUser;
        //obj.itemKey = entity.ItemKey;
        DataTable nullCheck = DataContext.StringDataSet("@InterlockHistory.PanelNullCheck", RefineExpando(obj, true)).Tables[0];
        int rowCnt = nullCheck.Rows.Count;
        if(rowCnt > 0)
        {
            return -2; // 중복시 -2 리턴
        }
        else
        {
            //realtime
            int cnt = DataContext.StringNonQuery("@InterlockHistory.InterlockYn", RefineExpando(obj, true));
            //interlock
            int cnt2 = DataContext.StringNonQuery("@InterlockHistory.InterlockInsert", RefineExpando(obj, true));
            return cnt2;
        }
    }
    [ManualMap]
    public static int InsertOffChecker (List<InterlockHistoryEntity> list)
    {
        dynamic obj = new ExpandoObject();
        obj.Json = JsonConvert.SerializeObject(list);
        obj.interlockYn = 'N';
        //panel_realtime
        int offCheck = DataContext.StringNonQuery("@InterlockHistory.InterlockOffChecker", RefineExpando(obj, true));
        //int rowCnt = offCheck.Rows.Count;
        int rowCnt = offCheck;
        if (rowCnt > 0) // 중복되는 group_key 있음
        {
            return -3; // 확인창 띄우기
        }
        else // 중복되는 group_key 없음
        {
            InsertOff(list);
            return -100; 
        }
        
    }
    [ManualMap]
    public static int InsertOff(List<InterlockHistoryEntity> list)
    {
        dynamic obj = new ExpandoObject();
        obj.Json = JsonConvert.SerializeObject(list);
        obj.interlockYn = 'N';
        //panel_realtime
        int cnt = DataContext.StringNonQuery("@InterlockHistory.InterlockYnList", RefineExpando(obj, true));
        //panel_interlock
        int cnt2 = DataContext.StringNonQuery("@InterlockHistory.InterlockCancelInsertList", RefineExpando(obj, true));

        return cnt2;
    }
    //[ManualMap] 1개씩 들어오던 버전
    //public static int InsertOff([FromBody] InterlockHistoryEntity entity)
    //{
    //    dynamic obj = new ExpandoObject();
    //    obj.panelId = entity.PanelId;
    //    obj.interlockYn = 'N';
    //    obj.panelInterlockId = entity.PanelInterlockId;
    //    obj.offRemark = entity.OffRemark;
    //    obj.offUpdateUser = entity.OffUpdateUser;
    //    //panel_realtime
    //    int cnt = DataContext.StringNonQuery("@InterlockHistory.InterlockYn", RefineExpando(obj, true));
    //    //panel_interlock
    //    int cnt2 = DataContext.StringNonQuery("@InterlockHistory.InterlockCancelInsert", RefineExpando(obj, true));

    //    return cnt;
    //}

    [ManualMap]
    public static IResult RollPanelMapList()
    {
        //dynamic obj = new ExpandoObject();
        //obj.Tcard = tcard;

        DataTable rollPanelMapList= DataContext.StringDataSet("@InterlockHistory.RollPanelMapList").Tables[0];
        //var list = ToDic(rollPanelMapList).ToList();
        //var dt = DataContext.StringDataSet("@BarcodeApi.Panel.BeforeChange").Tables[0];
        return Results.Json(ToDic(rollPanelMapList));
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
