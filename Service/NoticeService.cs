namespace WebApp;

using System;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Mvc;
using static Unity.Storage.RegistrationSet;

public class NoticeService : MinimalApiService, IMinimalApi, Map.IMap
{
    public NoticeService(ILogger<LanguageService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }

    public static NoticeList ListAll()
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;


        return new NoticeList(DataContext.StringEntityList<NoticeEntity>("@Notice.List", RefineExpando(obj)));
    }

    public static NoticeList List(int? noticeno, string? title, char? useYn)
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;
        obj.NoticeNo = noticeno;
        obj.Title = title;
        obj.UseYn = useYn;

        return new NoticeList(DataContext.StringEntityList<NoticeEntity>("@Notice.List", RefineExpando(obj, true)));
    }

    public static NoticeEntity? Select(int noticeno)
    {
        dynamic obj = new ExpandoObject();
        obj.NoticeNo = noticeno;

        return DataContext.StringEntity<NoticeEntity>("@Notice.Select", RefineExpando(obj, true));
    }

    public static int Insert([FromBody] NoticeEntity entity)
    {
        if (Select(entity.NoticeNo) != null)
            return -1;

        RemoveCache();

        return DataContext.StringNonQuery("@Notice.Insert", RefineEntity(entity));
    }

    public static int Update([FromBody] NoticeEntity entity)
    {
        RemoveCache();

        return DataContext.StringNonQuery("@Notice.Update", RefineEntity(entity));
    }

    public static int Delete(int noticeno)
    {
        dynamic obj = new ExpandoObject();
        obj.NoticeNo = noticeno;

        RemoveCache();

        return DataContext.StringNonQuery("@Notice.Delete", RefineExpando(obj));
    }

    public static NoticeList ListAllCache()
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

    public static Map GetMap(string? category = null)
    {
        throw new NotImplementedException();
    }

    public static void RefreshMap()
    {
        throw new NotImplementedException();
    }

}
