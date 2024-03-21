namespace WebApp;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Threading.Tasks;
using System.Data;
using System.Transactions;
using Framework;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Mvc;
using System.Dynamic;

public class UsergroupService : MinimalApiService, IMinimalApi, Map.IMap
{
    public UsergroupService(ILogger<UsergroupService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }

    public static UsergroupList ListAll()
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;

        return new UsergroupList(DataContext.StringEntityList<UsergroupEntity>("@Usergroup.List", RefineExpando(obj)));
    }

    public static UsergroupList List(string? UsergroupId, string? UsergroupName, string? nationCode, string? email, char? useYn, string? remark, string? usergroupJson)
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;
        obj.UsergroupId = UsergroupId;
        obj.UsergroupName = UsergroupName;
        obj.Remark = remark;
        obj.usergroupJson = usergroupJson;

        return new UsergroupList(DataContext.StringEntityList<UsergroupEntity>("@Usergroup.List", RefineExpando(obj, true)));
    }

    [ManualMap]
    public static int CountSelect(string UsergroupId)
    {
        dynamic obj = new ExpandoObject();
        obj.UsergroupId = UsergroupId;

        return DataContext.StringValue<int>("@Usergroup.CountSelect", RefineExpando(obj, true));
    }

    public static int Insert([FromBody] UsergroupEntity entity)
    {
        if (CountSelect(entity.UsergroupId) > 0)
            return -1;

        RemoveCache();

        return DataContext.StringNonQuery("@Usergroup.Insert", RefineEntity(entity));
    }

    public static int Update([FromBody] UsergroupEntity entity)
    {
        RemoveCache();

        return DataContext.StringNonQuery("@Usergroup.Update", RefineEntity(entity));
    }

    public static int Delete(string usergroupId)
    {
        dynamic obj = new ExpandoObject();
        obj.UsergroupId = usergroupId;

        RemoveCache();

        return DataContext.StringNonQuery("@Usergroup.Delete", RefineExpando(obj));
    }

    public static UsergroupList ListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(),
            DateTime.Now.AddMinutes(GetCacheMin()),
            ListAll);

        return list;
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }

    public static void RefreshMap()
    {
        RemoveCache();
    }

    public static Map GetMap(string? category = null)
    {
        return ListAllCache()
            .Select(y => {
                return new MapEntity(y.UsergroupId, y.UsergroupName, string.Empty, 'Y');
            }).ToMap();
    }
}
