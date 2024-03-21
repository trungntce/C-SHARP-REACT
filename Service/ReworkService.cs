namespace WebApp;

using System;
using System.Data;
using System.Dynamic;
using System.Linq;
using System.Text.RegularExpressions;
using Framework;
using Microsoft.AspNetCore.Mvc;

public class ReworkService : MinimalApiService, IMinimalApi, Map.IMap
{
    public ReworkService(ILogger<ReworkService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/getpanelopers", nameof(GetPanelOpers));
        group.MapGet("/getrollopers", nameof(GetRollOpers));
        group.MapGet("/getmotherrollopers", nameof(GetMotherRollOpers));
        return RouteAllEndpoint(group);
    }
    
    [ManualMap]
    public static IResult GetPanelOpers(string? panelId)
    {
        dynamic obj = new ExpandoObject();
        obj.PanelId = panelId;

        var dt = DataContext.StringDataSet("@Rework.GetPanelOpers", RefineExpando(obj, true)).Tables[0];
        return Results.Json(ToDic(dt));
    }

    [ManualMap]
    public static IResult GetRollOpers(string? rollId)
    {
        dynamic obj = new ExpandoObject();
        obj.RollId = rollId;

        var dt = DataContext.StringDataSet("@Rework.GetRollOpers", RefineExpando(obj, true)).Tables[0];
        return Results.Json(ToDic(dt));
    }

    [ManualMap]
    public static IResult GetMotherRollOpers(string? rollId)
    {
        dynamic obj = new ExpandoObject();
        obj.RollId = rollId;

        var dt = DataContext.StringDataSet("@Rework.GetMotherRollOpers", RefineExpando(obj, true)).Tables[0];
        return Results.Json(ToDic(dt));
    }
    public static ReworkList ListAll()
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;
        var abcd = new ReworkList(DataContext.StringEntityList<ReworkEntity>("@Rework.List", RefineExpando(obj)));
        return abcd;
    }
    
    public static ReworkList List(string? codeId, string? codeName)
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;
        obj.CodeId = codeId;
        obj.CodeName = codeName;

        return new ReworkList(DataContext.StringEntityList<ReworkEntity>("@Rework.List", RefineExpando(obj, true)));

    }

    public static ReworkEntity? Select(string codeId)
    {
        dynamic obj = new ExpandoObject();
        obj.CodeId = codeId;

        return DataContext.StringEntity<ReworkEntity>("@Rework.Select", RefineExpando(obj, true));
    }

    public static int Insert([FromBody] ReworkEntity entity)
    {
        //if (Select(entity.CodeId) != null)
        //    return -1;
        RemoveCache();
        dynamic obj = new ExpandoObject();
        obj.codeId = entity.CodeId;
        obj.codeName = entity.CodeName;
        obj.remark = entity.Remark;
        obj.use_yn = entity.UseYn;
        //obj.create_user = entity.CreateUser;
        return DataContext.StringNonQuery("@Rework.Insert", RefineExpando(obj,true));
    }

    public static int Update([FromBody] ReworkEntity entity)
    {
        RemoveCache();
        dynamic obj = new ExpandoObject();
        obj.codeId = entity.CodeId;
        obj.codeName = entity.CodeName;
        obj.remark = entity.Remark;
        obj.use_yn = entity.UseYn;
        return DataContext.StringNonQuery("@Rework.Update", RefineExpando(obj,true));
    }

    public static int Delete(string CodeId)
    {
        dynamic obj = new ExpandoObject();
        obj.codeId = CodeId;

		RemoveCache();

        return DataContext.StringNonQuery("@Rework.Delete", RefineExpando(obj));
    }

    public static ReworkList ListAllCache()
    {
        var list = UtilEx.FromCache(
           BuildCacheKey(UserCorpId, UserFacId),
           DateTime.Now.AddMinutes(GetCacheMin()),
           ListAll);

        return list;
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }
    
    public static Map GetMap(string? category = null)
    {
        return ListAllCache()
            .Where(x => string.IsNullOrWhiteSpace(category) || x.CodeId == category)
            .Select(y => {
                return new MapEntity(y.CodeId, y.CodeName, null, 'Y');
            }).ToMap();
    }

    public static void RefreshMap()
    {
        RemoveCache();
    }
}
