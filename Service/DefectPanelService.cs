namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Drawing.Printing;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

public class DefectPanelService : MinimalApiService, IMinimalApi, Map.IMap
{
    public DefectPanelService(ILogger<DefectPanelService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapPut("/set", nameof(InsertSet));
        group.MapPut("/off", nameof(InsertOff));
        group.MapPut("onoff", nameof(OnOffUpsert));

        return RouteAllEndpoint(group);
    }
    
    public static DefectPanelList ListAll()
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;

		return new DefectPanelList(DataContext.StringEntityList<DefectPanelEntity>("@DefectPanel.List", RefineExpando(obj)));
    }
    
    public static IEnumerable<IDictionary> List(int pageNo, int pageSize, string? rollId, string? panelId, string? defectCode)
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = pageNo;
        obj.PageSize = pageSize;
        obj.RollId = rollId;
        obj.PanelId = panelId;
        obj.DefectCode = defectCode;

        DataTable dt = DataContext.StringDataSet("@DefectPanel.List", RefineExpando(obj, true)).Tables[0];

        FindLabel(dt, "defectName", "defectName", defectName => LanguageService.LangText(defectName, UserNationCode));

        return ToDic(dt);
    }

    public static DefectPanelList ListAllCache()
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

        return DataContext.StringNonQuery("@DefectPanel.Delete", RefineExpando(obj));
    }
    public static DefectPanelEntity? Select(string panelId)
    {
        dynamic obj = new ExpandoObject();
        obj.panelId = panelId;

        return DataContext.StringEntity<DefectPanelEntity>("@DefectPanel.Select", RefineExpando(obj, true));
    }

    //public static int Insert([FromBody] DefectPanelEntity entity)
    //{
    //    //if (Select(panelId) != null)
    //    //    return -1;

    //    RemoveCache();

    //    //return DataContext.StringNonQuery("@BarcodeApi.Panel.InterlockInsert", new { entity.panelId, interlockCode, onRemark, onUpdateUser });
    //    return DataContext.StringNonQuery("@BarcodeApi.Panel.DefectInsert", new {});
    //}
    public static int Update([FromBody] DefectPanelEntity entity)
    {
        dynamic obj = new ExpandoObject();
        obj.panelId = entity.PanelId;
        obj.defectYn = 'Y';
        if (entity.AutoYn != 'Y') obj.autoYn = 'N';
        obj.defectCode = entity.DefectCode;
        obj.onRemark = entity.OnRemark;
        obj.onUpdateUser = entity.OnUpdateUser;
        obj.panelDefectId = entity.PanelDefectId;
        //panel_interlock
        int cnt2 = DataContext.StringNonQuery("@DefectPanel.Update", RefineExpando(obj, true));

        return cnt2;
    }

    [ManualMap]
    public static int InsertSet([FromBody] DefectPanelEntity entity)
    {
        dynamic obj = new ExpandoObject();
        obj.panelId = entity.PanelId;
        obj.defectYn = 'Y';
        if (entity.AutoYn != 'Y') obj.autoYn = 'N';
        obj.defectCode = entity.DefectCode;
        obj.onRemark = entity.OnRemark;
        obj.onUpdateUser = entity.OnUpdateUser;
        DataTable nullCheck = DataContext.StringDataSet("@DefectPanel.PanelNullCheck", RefineExpando(obj, true)).Tables[0];
        int rowCnt = nullCheck.Rows.Count;
        if (rowCnt > 0)
        {
            return -2; // 중복시 -2 리턴
        }
        else
        {
            //panel_realtime
            int cnt = DataContext.StringNonQuery("@DefectPanel.DefectYn", RefineExpando(obj, true));
            //panel_interlock
            int cnt2 = DataContext.StringNonQuery("@DefectPanel.DefectInsert", RefineExpando(obj, true));
            return cnt2;
        }
        
    }

    [ManualMap]
    public static int InsertOff([FromBody] DefectPanelEntity entity)
    {
        dynamic obj = new ExpandoObject();
        obj.PanelId = entity.PanelId;
        obj.PanelDefectId = entity.PanelDefectId;
        obj.DefectYn = 'N';
        obj.OffRemark = entity.OffRemark;
        //panel_realtime
        int cnt = DataContext.StringNonQuery("@DefectPanel.DefectYn", RefineExpando(obj, true));
        //panel_interlock
        int cnt2 = DataContext.StringNonQuery("@DefectPanel.DefectCancelInsert", RefineExpando(obj, true));

        return cnt;
    }

    [ManualMap]
    public static int OnOffUpsert([FromBody] Dictionary<string, object?> dic)
    {

        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        var param = dic.ToCleanDic().ToDictionary(x => x.Key, y => y.Value!);

        char defectYn = param.TypeKey<char>("defectYn");

        if (defectYn == 'Y')
            return db.ExecuteStringNonQuery("@DefectPanel.OnInsert", RefineParam(param));
        else
            return db.ExecuteStringNonQuery("@DefectPanel.OffUpdate", RefineParam(param));
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

