namespace WebApp;

using System;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

public class DefectRollService : MinimalApiService, IMinimalApi, Map.IMap
{
    public DefectRollService(ILogger<DefectRollService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapPut("/set", nameof(InsertSet));
        group.MapPut("/off", nameof(InsertOff));

        return RouteAllEndpoint(group);
    }
    
    public static DefectRollList ListAll()
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;

		return new DefectRollList(DataContext.StringEntityList<DefectRollEntity>("@DefectRoll.List", RefineExpando(obj)));
    }
    
    public static DefectRollList List(string? rollId, string? defectCode)
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;
        obj.RollId = rollId;
        obj.DefectCode = defectCode;

        return new DefectRollList(DataContext.StringEntityList<DefectRollEntity>("@DefectRoll.List", RefineExpando(obj, true)));
    }

    public static DefectRollList ListAllCache()
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

        return DataContext.StringNonQuery("@DefectRoll.Delete", RefineExpando(obj));
    }
    public static DefectRollEntity? Select(string rollId)
    {
        dynamic obj = new ExpandoObject();
        obj.RollId = rollId;

        return DataContext.StringEntity<DefectRollEntity>("@DefectRoll.Select", RefineExpando(obj, true));
    }

    public static int Insert([FromBody] DefectRollEntity entity)
    {
        //if (Select(panelId) != null)
        //    return -1;

        RemoveCache();

        //return DataContext.StringNonQuery("@BarcodeApi.Panel.InterlockInsert", new { entity.panelId, interlockCode, onRemark, onUpdateUser });
        return DataContext.StringNonQuery("@BarcodeApi.Roll.DefectRollInsert", new {});
    }

    [ManualMap]
    public static int InsertSet([FromBody] DefectRollEntity entity)
    {
        dynamic obj = new ExpandoObject();
        obj.rollId = entity.RollId;
        obj.defectYn = 'Y';
        if (entity.AutoYn != 'Y') obj.autoYn = 'N';
        obj.defectCode = entity.DefectCode;
        obj.onRemark = entity.OnRemark;
        obj.onUpdateUser = entity.OnUpdateUser;
        DataTable onlyRollCheck = DataContext.StringDataSet("@DefectPanel.OnlyRollCheck", RefineExpando(obj, true)).Tables[0];
        int rollCheckCnt = onlyRollCheck.Rows.Count;
        if (rollCheckCnt > 0) //roll_panel_map에서 분리 여부
        {
            DataTable nullCheck = DataContext.StringDataSet("@DefectPanel.RollNullCheck", RefineExpando(obj, true)).Tables[0];
            int rowCnt = nullCheck.Rows.Count;
            if (rowCnt > 0)
            {
                return -2;
            }
            else
            {
                //panel_realtime
                int cnt = DataContext.StringNonQuery("@DefectRoll.DefectYn", RefineExpando(obj, true));
                //panel_interlock
                int cnt2 = DataContext.StringNonQuery("@DefectRoll.DefectInsert", RefineExpando(obj, true));
                return cnt2;
            }
        }
        else
        {
            DataTable nullCheck = DataContext.StringDataSet("@DefectPanel.RollNullCheck", RefineExpando(obj, true)).Tables[0];
            int rowCnt = nullCheck.Rows.Count;
            if (rowCnt > 0)
            {
                return -2;
            }
            else
            {
                //판넬 아이디 없이 롤만 들어올때
                int cnt2 = DataContext.StringNonQuery("@DefectRoll.DefectInsertOnlyRoll", RefineExpando(obj, true));
                return cnt2;
            }
        }
        
    }
    [ManualMap]
    public static int InsertOff([FromBody] DefectRollEntity entity)
    {
        dynamic obj = new ExpandoObject();
        obj.rollId = entity.RollId;
        obj.defectYn = 'N';
        obj.offRemark = entity.OffRemark;
        obj.offUpdateUser = entity.OffUpdateUser;
        //panel_realtime
        int cnt = DataContext.StringNonQuery("@DefectRoll.DefectYn", RefineExpando(obj, true));
        //panel_interlock
        int cnt2 = DataContext.StringNonQuery("@DefectRoll.DefectCancelInsert", RefineExpando(obj, true));

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
