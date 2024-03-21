namespace WebApp;

using System;
using System.Data;
using System.Dynamic;
using System.Linq;
using System.Security.Claims;
using System.Transactions;

using Framework;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Information;

public class MenuService : MinimalApiService, IMinimalApi, Map.IMap
{
    public MenuService(ILogger<MenuService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/name", nameof(MenuName));
        group.MapGet("/list", nameof(ListCache));

        return RouteAllEndpoint(group);
    }

    public static MenuList List(bool filterByAuth = false)
    {
        dynamic obj = new ExpandoObject();
        obj.NationCode = UserNationCode;

        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        var list = new MenuList(db.EntityList<dynamic, MenuEntity>(CommandType.Text, "@Menu.List", RefineExpando(obj)));

        foreach (var menu in list)
            menu.MenuTypeName = CodeService.CodeName("MENU_TYPE", menu.MenuType.ToString());

        if (!filterByAuth)
            return list;

        var filtered = list.Where(x => {
            if(IsAdmin == "Y")
                return true;

            if (x.AnonymousYn == 'Y')
                return true;

            var menuAuth = MenuAuth;
            if (menuAuth.IsEmpty())
                return false;

            if (!menuAuth!.ContainsKey(x.MenuId))
                return false;

            var userPerm = menuAuth.TypeKey(x.MenuId, 0);

            if (PermissionFilter.CheckPerm(userPerm, PermMethod.Admin)) // 관리자
                return true;

            if (PermissionFilter.CheckPerm(userPerm, PermMethod.Read)) // 읽기
                return true;

            return false;
        });

        return new(filtered.ToList());
    }

    public static MenuList ListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(),
            DateTime.Now.AddMinutes(GetCacheMin()),
            List,
            false);

        return list;
    }

    [ManualMap]
    public static MenuList ListCache(string parentId)
    {
        return new MenuList(ListAllCache().Where(x => x.ParentId == parentId));
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }

    public static MenuEntity? SelectCache(string menuId)
    {
        return ListAllCache().FirstOrDefault(x => x.MenuId == menuId);
    }

    [ManualMap]
    public static string MenuName(string menuId)
    {
        return SelectCache(menuId)?.MenuName ?? menuId;
    }

    [ManualMap]
    public static char MenuType(string menuId)
    {
        return SelectCache(menuId)?.MenuType ?? default(char);
    }

    [ManualMap]
    public static string MenuBody(string menuId)
    {
        return SelectCache(menuId)?.MenuBody ?? string.Empty;
    }

    [ManualMap]
    public static string Icon(string menuId)
    {
        return SelectCache(menuId)?.Icon ?? string.Empty;
    }

    [ManualMap]
    public static int CountByParent(string menuId)
    {
        dynamic obj = new ExpandoObject();
        obj.MenuId = menuId;

        return DataContext.StringValue<int>("@Menu.CountByParent", RefineExpando(obj));
    }

    public static int Insert([FromBody] MenuEntity entity)
    {
        entity.MenuId = NewShortId();
        if (string.IsNullOrWhiteSpace(entity.ParentId))
            entity.ParentId = null;

        var rtn = DataContext.StringNonQuery("@Menu.Insert", RefineEntity(entity));

        RemoveCache();

        return rtn;
    }

    public static int Update([FromBody] MenuEntity entity)
    {
        if (string.IsNullOrWhiteSpace(entity.ParentId))
            entity.ParentId = null;

        var rtn = DataContext.StringNonQuery("@Menu.Update", RefineEntity(entity));

        RemoveCache();

        return rtn;
    }

    public static int Delete(string menuId)
    {
        if(CountByParent(menuId) > 0)
            return -1;

        dynamic obj = new ExpandoObject();
        obj.MenuId = menuId;

        RemoveCache();

        return DataContext.StringNonQuery("@Menu.Delete", RefineExpando(obj));
    }

    [ManualMap]
    public static DataSet AuthList(string userId)
    {
        return DataContext.StringDataSet("@Menu.AuthList", userId);
    }

    [ManualMap]
    public static int AuthUpdate(IDictionary<string, object> param)
    {
        var rtn = 0;

        using (TransactionScope scope = new TransactionScope())
        {
            rtn = DataContext.StringNonQuery("@Menu.AuthUpdateXml", param);

            scope.Complete();
        }

        return rtn;
    }

    public static Map GetMap(string? category = null)
    {
        if(category == "depth2")
        {
            return ListAllCache()
            .Where(x => x.Depth < 2)
            .OrderBy(x => x.Sort)
            .Select(y => {
                string tabs = string.Concat(Enumerable.Repeat("\xa0\xa0\xa0\xa0", y.Depth));
                return new MapEntity(y.MenuId, $"{tabs}{y.MenuName}", y.ParentId, y.UseYn);
            }).ToMap();
        }

        return ListAllCache()
        .Where(x => string.IsNullOrWhiteSpace(category) || x.ParentId == category)
        .OrderBy(x => x.Sort)
        .Select(y => {
            string tabs = string.Concat(Enumerable.Repeat("\xa0\xa0\xa0\xa0", y.Depth));
            return new MapEntity(y.MenuId, $"{tabs}{y.MenuName}", y.ParentId, y.UseYn);
        }).ToMap();
    }

    public static void RefreshMap()
    {
        RemoveCache();
    }

    [ManualMap]
    public static Map GetMapForSearch(string? category = null)
    {
        return List(true)
            .Where(x => x.UseYn == 'Y' && (x.MenuType == 'L' || x.MenuType == 'P'))
            .Select(x => {
                var menuPathNameLang = x.MenuPathNameLang.Replace(",", " > ");
            
            return new MapEntity(x.MenuId, $"{menuPathNameLang}", x.MenuBody, x.UseYn);
        }).ToMap();
    }
}