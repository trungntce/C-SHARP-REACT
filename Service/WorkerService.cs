namespace WebApp;

using System;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Mvc;

public class WorkerService : MinimalApiService, IMinimalApi, Map.IMap
{
    public WorkerService(ILogger<WorkerService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }
    
    public static WorkerList ListAll()
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;

		return new WorkerList(DataContext.StringEntityList<WorkerEntity>("@Worker.List", RefineExpando(obj)));
    }

    public static WorkerList List(string? workerId, string? workerName, string? rowKey)
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;
        obj.WorkerId = workerId;
        obj.WorkerName = workerName;
        obj.RowKey = rowKey;

        return new WorkerList(DataContext.StringEntityList<WorkerEntity>("@Worker.List", RefineExpando(obj, true)));
    }

    public static WorkerEntity? Select(string? workerId)
    {
        dynamic obj = new ExpandoObject();
        obj.WorkerId = workerId;

        return DataContext.StringEntity<WorkerEntity>("@Worker.Select", RefineExpando(obj, true));
    }

    public static int Insert([FromBody] WorkerEntity entity)
    {
        if (Select(entity.WorkerId) != null)
            return -1;

        return DataContext.StringNonQuery("@Worker.Insert", RefineEntity(entity));
    }

    public static int Update([FromBody] WorkerEntity entity)
    {
        return DataContext.StringNonQuery("@Worker.Update", RefineEntity(entity));
    }

    public static int Delete(string workerId)
    {
        dynamic obj = new ExpandoObject();
        obj.WorkerId = workerId;

        RemoveCache();

        return DataContext.StringNonQuery("@Worker.Delete", RefineExpando(obj));
    }

    public static WorkerList ListAllCache()
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
        return ListAllCache()
        .Where(x => category == null || x.WorkerId == category)
        .Select(y => {
            return new MapEntity(y.WorkerId, y.WorkerName, y.RowKey, y.UseYn);
        }).ToMap();
    }

    public static void RefreshMap()
    {
        RemoveCache();
    }
}
