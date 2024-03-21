namespace WebApp;

using System;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Mvc;

public class ErrorService : MinimalApiService, IMinimalApi, Map.IMap
{
    public ErrorService(ILogger<ErrorService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }
    
    public static ErrorList ListAll()
    {
        dynamic obj = new ExpandoObject();

		return new ErrorList(DataContext.StringEntityList<ErrorEntity>("@Error.List", RefineExpando(new ExpandoObject())));
    }

    public static ErrorList List(string? errorgroupCode, string? errorCode, string? errorMessage, string? eqpCode, string? remark, char? useYn)
    {
        dynamic obj = new ExpandoObject();
        obj.ErrorgroupCode = errorgroupCode;
        obj.ErrorCode = errorCode;
        obj.ErrorMessage = errorMessage;
        obj.EqpCode = eqpCode;
        obj.Remark = remark;
        obj.UseYn = useYn;

        return new ErrorList(DataContext.StringEntityList<ErrorEntity>("@Error.List", RefineExpando(obj, true)));
    }

    public static ErrorEntity? Select(string? errorCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ErrorCode = errorCode;

       return DataContext.StringEntity<ErrorEntity>("@Error.Select", RefineExpando(obj, true));
    }

    public static int Insert([FromBody] ErrorEntity entity)
    {
        if (Select(entity.ErrorCode) != null)
            return -1;

        return DataContext.StringNonQuery("@Error.Insert", RefineEntity(entity));
    }

    public static int Update([FromBody] ErrorEntity entity)
    {
        return DataContext.StringNonQuery("@Error.Update", RefineEntity(entity));
    }

    public static int Delete(string errorCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ErrorCode = errorCode;

        RemoveCache();

        return DataContext.StringNonQuery("@Error.Delete", RefineExpando(obj));
    }

    public static ErrorList ListAllCache()
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
        return ListAllCache()
        .Where(x => category == null || x.ErrorgroupCode == category)
        .Select(y => {
            return new MapEntity(y.ErrorCode, y.ErrorMessage, y.ErrorgroupCode, y.UseYn);
        }).ToMap();
    }

    public static void RefreshMap()
    {
        RemoveCache();
    }
}
