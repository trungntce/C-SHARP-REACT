namespace WebApp;

using System;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Ocsp;

/*public class StManagerService : MinimalApiService, IMinimalApi, Map.IMap
{
    public StManagerService(ILogger<StManagerService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }
    
    public static StList ListAll()
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;
        
        return new StList(DataContext.StringEntityList<StManagerEntity>("@StManager.List", RefineExpando(obj)));
    }
    
    public static StList List(string? eqpId, string? modelId)
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;
        obj.EqpId = eqpId;
        obj.ModelId = modelId;

        return new StList(DataContext.StringEntityList<StManagerEntity>("@StManager.List", RefineExpando(obj, true)));
    }

    public static StManagerEntity? Select(string eqpId, string modelId)
    {
        dynamic obj = new ExpandoObject();
        obj.EqpId = eqpId;
        obj.ModelId = modelId;

        return DataContext.StringEntity<StManagerEntity>("@StManager.Select", RefineExpando(obj, true));
    }

    public static int Insert([FromBody] StManagerEntity entity)
    {
        if (Select(entity.EqpId, entity.ModelId) != null)
            return -1;

        RemoveCache();

        return DataContext.StringNonQuery("@StManager.Insert", RefineEntity(entity));
    }

    public static int Update([FromBody] StManagerEntity entity)
    {
        RemoveCache();

        return DataContext.StringNonQuery("@StManager.Update", RefineEntity(entity));
    }

    public static int Delete(string eqpId, string modelId)
    {
        dynamic obj = new ExpandoObject();
        obj.EqpId = eqpId;
        obj.ModelId = modelId;

		RemoveCache();

        return DataContext.StringNonQuery("@StManager.Delete", RefineExpando(obj));
    }

    public static StList ListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(UserCorpId, UserFacId),
            DateTime.Now.AddMinutes(GetCacheMin()),
            ListAll);

        return list;
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey(UserCorpId, UserFacId));
    }

    public static Map GetMap(string? category = null)
    {
        throw new NotImplementedException();
    }

    public static void RefreshMap()
    {
        throw new NotImplementedException();
    }

}
*/

public class StManagerService : MinimalApiService, IMinimalApi, Map.IMap
{
    public StManagerService(ILogger<StManagerService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }

    public static EquipStList ListAll()
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;

        return new EquipStList(DataContext.StringEntityList<EquipStEntity>("@StManager_V2.List", RefineExpando(obj)));
    }

    public static EquipStList List(string? eqpcode)
    {
        dynamic obj = new ExpandoObject();
        obj.EqpCode = eqpcode;


        return new EquipStList(DataContext.StringEntityList<EquipStEntity>("@StManager_V2.List", RefineExpando(obj, true)));
    }

    public static EquipStEntity? Select(string eqpId, string modelId)
    {
        dynamic obj = new ExpandoObject();
        obj.EqpId = eqpId;
        obj.ModelId = modelId;

        return DataContext.StringEntity<EquipStEntity>("@StManager_V2.Select", RefineExpando(obj, true));
    }

    public static int Update([FromBody] EquipStEntity entity)
    {
        RemoveCache();

        return DataContext.StringNonQuery("@StManager_V2.Update", RefineEntity(entity));
    }

    public static EquipStList ListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(UserCorpId, UserFacId),
            DateTime.Now.AddMinutes(GetCacheMin()),
            ListAll);

        return list;
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey(UserCorpId, UserFacId));
    }

    public static Map GetMap(string? category = null)
    {
        throw new NotImplementedException();
    }

    public static void RefreshMap()
    {
        throw new NotImplementedException();
    }

}
