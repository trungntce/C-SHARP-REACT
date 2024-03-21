namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Org.BouncyCastle.Asn1.X500;
using static Unity.Storage.RegistrationSet;

public class FavoriteService : MinimalApiService, IMinimalApi
{
    public FavoriteService(ILogger<FavoriteService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapPost("/", nameof(UpdateSort));

        return RouteAllEndpoint(group);
    }
    
    public static FavoriteList List()
    {
        dynamic obj = new ExpandoObject();

        var rtn = new FavoriteList(DataContext.StringEntityList<FavoriteEntity>("@Favorite.List", RefineExpando(obj, true)));
        rtn.ForEach(x => x.MenuName = MenuService.MenuName(x.MenuId));
        rtn.ForEach(x => x.MenuBody = MenuService.MenuBody(x.MenuId));
        rtn.ForEach(x => x.Icon = MenuService.Icon(x.MenuId));
        rtn.ForEach(x => x.MenuType = MenuService.MenuType(x.MenuId));

        return rtn;
    }

    public static int Insert([FromBody] FavoriteEntity entity)
    {
        var rtn = DataContext.StringNonQuery("@Favorite.Insert", RefineEntity(entity));

        UpdateSortAuto();
        return rtn;
    }

    [ManualMap]
    public static int UpdateSort(List<FavoriteEntity> list)
    {
        dynamic obj = new ExpandoObject();
        obj.Json = JsonConvert.SerializeObject(list);

        return DataContext.StringNonQuery("@Favorite.UpdateSort", RefineExpando(obj));
    }

    [ManualMap]
    public static int UpdateSortAuto()
    {
        dynamic obj = new ExpandoObject();

        return DataContext.StringNonQuery("@Favorite.UpdateSortAuto", RefineExpando(obj));
    }

    public static int Delete(string menuId)
    {
        dynamic obj = new ExpandoObject();
        obj.MenuId = menuId;

        var rtn = DataContext.StringNonQuery("@Favorite.Delete", RefineExpando(obj));

        UpdateSortAuto();

        return rtn;
    }
}
