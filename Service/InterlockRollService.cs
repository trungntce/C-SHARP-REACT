namespace WebApp;

using System;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

public class InterlockRollService : MinimalApiService, IMinimalApi, Map.IMap
{
    public InterlockRollService(ILogger<InterlockRollService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapPut("/set", nameof(InsertSet));
        group.MapPut("/off", nameof(InsertOff));

        return RouteAllEndpoint(group);
    }
    
    public static InterlockRollList ListAll()
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;

		return new InterlockRollList(DataContext.StringEntityList<InterlockRollEntity>("@InterlockRoll.List", RefineExpando(obj)));
    }
    
    public static InterlockRollList List(string? rollId, string? interlockCode)
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;
        obj.RollId = rollId;
        obj.InterlockCode = interlockCode;

        return new InterlockRollList(DataContext.StringEntityList<InterlockRollEntity>("@InterlockRoll.List", RefineExpando(obj, true)));
    }

    public static InterlockRollList ListAllCache()
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

        return DataContext.StringNonQuery("@InterlockRoll.Delete", RefineExpando(obj));
    }
    public static InterlockRollEntity? Select(string rollId)
    {
        dynamic obj = new ExpandoObject();
        obj.RollId = rollId;

        return DataContext.StringEntity<InterlockRollEntity>("@InterlockRoll.Select", RefineExpando(obj, true));
    }

    public static int Insert([FromBody] InterlockRollEntity entity)
    {
        //if (Select(panelId) != null)
        //    return -1;

        RemoveCache();

        //return DataContext.StringNonQuery("@BarcodeApi.Panel.InterlockInsert", new { entity.panelId, interlockCode, onRemark, onUpdateUser });
        return DataContext.StringNonQuery("@BarcodeApi.Roll.InterlockInsert", new {});
    }
    public static int Update([FromBody] InterlockRollEntity entity)
    {
        dynamic obj = new ExpandoObject();
        obj.rollId = entity.RollId;
        obj.interlockYn = 'Y';
        if (entity.AutoYn != 'Y') obj.autoYn = 'N';
        obj.interlockCode = entity.InterlockCode;
        obj.onRemark = entity.OnRemark;
        obj.onUpdateUser = entity.OnUpdateUser;
        //panel_interlock
        int cnt2 = DataContext.StringNonQuery("@BarcodeApi.Roll.InterlockInsert", RefineExpando(obj, true));

        return cnt2;
    }

    [ManualMap]
    public static int InsertSet([FromBody] InterlockRollEntity entity)
    {
        dynamic obj = new ExpandoObject();
        obj.rollId = entity.RollId;
        obj.interlockYn = 'Y';
        if (entity.AutoYn != 'Y') obj.autoYn = 'N';
        obj.interlockCode = entity.InterlockCode;
        obj.onRemark = entity.OnRemark;
        obj.onUpdateUser = entity.OnUpdateUser;
        //obj.itemKey = entity.ItemKey;
        DataTable onlyRollCheck = DataContext.StringDataSet("@InterlockHistory.OnlyRollCheck", RefineExpando(obj, true)).Tables[0];
        int rollCheckCnt = onlyRollCheck.Rows.Count;
        if (rollCheckCnt > 0) //roll_panel_map에서 분리 여부
        {
            DataTable nullCheck = DataContext.StringDataSet("@InterlockHistory.RollNullCheck", RefineExpando(obj, true)).Tables[0];
            int rowCnt = nullCheck.Rows.Count;
            if (rowCnt > 0) // offDt null인것 있는지(인터락 걸린 동일항목)
            {
                return -2; // 있으면 -2 리턴
            }
            else
            {   // 없으면 tb_panel_interlock에 추가
                //realtime
                int cnt = DataContext.StringNonQuery("@InterlockRoll.InterlockYn", RefineExpando(obj, true));
                //interlock
                int cnt2 = DataContext.StringNonQuery("@InterlockRoll.InterlockInsert", RefineExpando(obj, true));
                return cnt2;
            }
        }
        else // 분리 안됐을 경우
        {
            DataTable nullCheck = DataContext.StringDataSet("@InterlockHistory.RollNullCheck", RefineExpando(obj, true)).Tables[0];
            int rowCnt = nullCheck.Rows.Count;
            if (rowCnt > 0)
            {
                return -2;
            }
            else
            {
                //판넬 아이디 없이 롤만 들어올때
                int cnt2 = DataContext.StringNonQuery("@InterlockRoll.InterlockInsertOnlyRoll", RefineExpando(obj, true));
                return cnt2;
            }
        }
        
    }
    [ManualMap]
    public static int InsertOff([FromBody] InterlockRollEntity entity)
    {
        dynamic obj = new ExpandoObject();
        obj.rollId = entity.RollId;
        obj.interlockYn = 'N';
        obj.offRemark = entity.OffRemark;
        obj.offUpdateUser = entity.OffUpdateUser;
        //panel_realtime
        int cnt = DataContext.StringNonQuery("@InterlockRoll.InterlockYn", RefineExpando(obj, true));
        //panel_interlock
        int cnt2 = DataContext.StringNonQuery("@InterlockRoll.InterlockCancelInsert", RefineExpando(obj, true));

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
