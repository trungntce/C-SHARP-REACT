namespace WebApp;

using System;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Mvc;
using static Unity.Storage.RegistrationSet;

public class MenuAuthService : MinimalApiService, IMinimalApi, Map.IMap
{
    public MenuAuthService(ILogger<MenuAuthService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }

    public static MenuAuthList ListAll()
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;

		return new MenuAuthList(DataContext.StringEntityList<MenuAuthEntity>("@MenuAuth.List", RefineExpando(obj)));
    }
    
    public static MenuAuthList List(string? menuId, string? targetId, char? targetType)
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;
        obj.MenuId = menuId;
        obj.TargetId = targetId;
        obj.TargetType = targetType;

        return new MenuAuthList(DataContext.StringEntityList<MenuAuthEntity>("@MenuAuth.List", RefineExpando(obj, true)));
    }

    [ManualMap]
    public static int CountSelect(string menuId, string targetId, char targetType)
    {
        dynamic obj = new ExpandoObject();
        obj.MenuId = menuId;
        obj.TargetId = targetId;
        obj.TargetType = targetType;

        return DataContext.StringValue<int>("@MenuAuth.CountSelect", RefineExpando(obj, true));
    }

    public static int Insert([FromBody] MenuAuthEntity entity)
    {
        if (CountSelect(entity.MenuId, entity.TargetId, entity.TargetType) > 0)
            return -1;

        RemoveCache();

        return DataContext.StringNonQuery("@MenuAuth.Insert", RefineEntity(entity));
    }

    public static int Update([FromBody] MenuAuthEntity entity)
    {
        RemoveCache();

        return DataContext.StringNonQuery("@MenuAuth.Update", RefineEntity(entity));
    }

    public static int Delete(string menuId, string targetId, char targetType)
    {
        dynamic obj = new ExpandoObject();
        obj.MenuId = menuId;
        obj.TargetId = targetId;
        obj.TargetType = targetType;

        RemoveCache();

        return DataContext.StringNonQuery("@MenuAuth.Delete", RefineExpando(obj));
    }

    public static MenuAuthList ListAllCache()
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
        throw new NotImplementedException();
    }
}
