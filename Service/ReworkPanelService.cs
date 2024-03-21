namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

public class ReworkPanelService : MinimalApiService, IMinimalApi, Map.IMap
{
    public ReworkPanelService(ILogger<ReworkPanelService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapPut("/put", nameof(InsertPut));
        group.MapPut("/putroll", nameof(InsertPutRoll));
        group.MapPut("/approve", nameof(InsertApprove));
        group.MapPut("/refuse", nameof(InsertRefuse));

        return RouteAllEndpoint(group);
    }

    public static IEnumerable<IDictionary> List(int pageNo, int pageSize, string? rollId, string? panelId, char? approveYn, char? refuseYn)
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = pageNo;
        obj.PageSize = pageSize;
        obj.PanelId = panelId;
        obj.RollId = rollId;
        obj.ApproveYn = approveYn;

        DataTable dt = DataContext.StringDataSet("@ReworkPanel.List", RefineExpando(obj, true)).Tables[0];

        FindLabel(dt, "reworkName", "reworkName", reworkName => LanguageService.LangText(reworkName, UserNationCode));

        return ToDic(dt);
    }

    public static int Delete(string panelId, string putDt)
    {
        dynamic obj = new ExpandoObject();
        obj.PanelId = panelId;
        obj.PutDt = putDt;

        RemoveCache();

        return DataContext.StringNonQuery("@ReworkPanel.Delete", RefineExpando(obj));
    }
    public static ReworkPanelEntity? Select(string panelId)
    {
        dynamic obj = new ExpandoObject();
        obj.panelId = panelId;

        return DataContext.StringEntity<ReworkPanelEntity>("@ReworkPanel.Select", RefineExpando(obj, true));
    }

    public static int Insert([FromBody] ReworkPanelEntity entity)
    {
        //if (Select(panelId) != null)
        //    return -1;

        RemoveCache();

        //return DataContext.StringNonQuery("@BarcodeApi.Panel.InterlockInsert", new { entity.panelId, interlockCode, onRemark, onUpdateUser });
        return DataContext.StringNonQuery("@BarcodeApi.Panel.ReworkInsert", new {});
    }
    public static int Update([FromBody] ReworkPanelEntity entity)
    {
        dynamic obj = new ExpandoObject();
        obj.operSeq = entity.OperSeq;
        obj.operCode = entity.OperCode;
        obj.operName = entity.OperName;
        obj.panelReworkId = entity.PanelReworkId;
        obj.reworkCode = entity.ReworkCode;
        obj.putRemark = entity.PutRemark;
        obj.putUpdateUser = entity.PutUpdateUser;
        RemoveCache();

        return DataContext.StringNonQuery("@ReworkPanel.Update", RefineEntity(entity));
    }

    [ManualMap]
    public static int InsertPut([FromBody] ReworkPanelEntity entity)
    {
        dynamic obj = new ExpandoObject();
        obj.operSeq = entity.OperSeq;
        obj.operCode = entity.OperCode;
        obj.operName = entity.OperName;
        obj.panelId = entity.PanelId;
        obj.reworkApproveYn = 'N';
        obj.reworkCode = entity.ReworkCode;
        obj.putRemark = entity.PutRemark;
        obj.putUpdateUser = entity.PutUpdateUser;
        DataTable nullCheck = DataContext.StringDataSet("@ReworkPanel.PanelNullCheck", RefineExpando(obj, true)).Tables[0];
        int rowCnt = nullCheck.Rows.Count;
        if (rowCnt > 0) {
            return -2;
        } else {
            //panel_realtime
            int cnt = DataContext.StringNonQuery("@ReworkPanel.ReworkYn", RefineExpando(obj, true));
            //panel_interlock
            int cnt2 = DataContext.StringNonQuery("@ReworkPanel.ReworkInsert", RefineExpando(obj, true));
            return cnt2;
        }
    }

    [ManualMap]
    public static int InsertPutRoll([FromBody] ReworkPanelEntity entity)
    {
        dynamic obj = new ExpandoObject();
        obj.operSeq = entity.OperSeq;
        obj.operCode = entity.OperCode;
        obj.operName = entity.OperName;
        obj.rollId = entity.RollId;
        obj.reworkApproveYn = 'N';
        obj.reworkCode = entity.ReworkCode;
        obj.putRemark = entity.PutRemark;
        obj.putUpdateUser = entity.PutUpdateUser;
        DataTable nullCheck = DataContext.StringDataSet("@ReworkPanel.RollNullCheck", RefineExpando(obj, true)).Tables[0];
        int rowCnt = nullCheck.Rows.Count;
        if (rowCnt > 0) {
            return -2;
        } else {
            //panel_realtime
            int cnt = DataContext.StringNonQuery("@ReworkPanel.ReworkRollYn", RefineExpando(obj, true));
            //panel_interlock
            int cnt2 = DataContext.StringNonQuery("@ReworkPanel.ReworkRollInsert", RefineExpando(obj, true));
            return cnt2;
        }
    }

    [ManualMap]
    public static int InsertApprove([FromBody] ReworkPanelEntity entity)
    {
        dynamic obj = new ExpandoObject();
        obj.panelId = entity.PanelId;
        obj.PanelReworkId = entity.PanelReworkId;
        obj.reworkApproveYn = 'Y';
        obj.approveRemark = entity.ApproveRemark;        
        //panel_realtime
        int cnt = DataContext.StringNonQuery("@ReworkPanel.ReworkYn", RefineExpando(obj, true));
        //panel_interlock
        int cnt2 = DataContext.StringNonQuery("@ReworkPanel.ReworkApproveInsert", RefineExpando(obj, true));

        return cnt;
    }

    [ManualMap]
    public static int InsertRefuse([FromBody] ReworkPanelEntity entity)
    {
        dynamic obj = new ExpandoObject();
        obj.panelId = entity.PanelId;
        obj.PanelReworkId = entity.PanelReworkId;
        obj.reworkApproveYn = 'N';
        obj.refuseRemark = entity.RefuseRemark;
        int cnt = DataContext.StringNonQuery("@ReworkPanel.ReworkYn", RefineExpando(obj, true));
        int cnt2 = DataContext.StringNonQuery("@ReworkPanel.ReworkRefuseInsert", RefineExpando(obj, true));

        return cnt2;
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
