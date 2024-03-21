namespace WebApp;

using System;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Mvc;

public class EqpErrorMapService : MinimalApiService, IMinimalApi
{
    public EqpErrorMapService(ILogger<EqpErrorMapService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }

    public static EqpErrorMapList List(string? eqpCode)
    {
        dynamic obj = new ExpandoObject();
        obj.EqpCode = eqpCode;

        return new EqpErrorMapList(DataContext.StringEntityList<EqpErrorMapEntity>("@EqpErrorMap.List", RefineExpando(obj, true)));
    }

    public static EqpErrorMapEntity? Select(string? eqpErrorCode)
    {
        dynamic obj = new ExpandoObject();
        obj.EqpErrorCode = eqpErrorCode;

       return DataContext.StringEntity<EqpErrorMapEntity>("@EqpErrorMap.Select", RefineExpando(obj, true));
    }

    public static int Insert([FromBody] EqpErrorMapEntity entity)
    {
        if (Select(entity.EqpErrorCode) != null)
            return -1;

		RemoveCache();

		return DataContext.StringNonQuery("@EqpErrorMap.Insert", RefineEntity(entity));
    }

    public static int Update([FromBody] EqpErrorMapEntity entity)
    {
		RemoveCache();

		return DataContext.StringNonQuery("@EqpErrorMap.Update", RefineEntity(entity));
    }

    public static int Delete(string? eqpErrorCode)
    {
        dynamic obj = new ExpandoObject();
		obj.EqpErrorCode = eqpErrorCode;

		RemoveCache();

        return DataContext.StringNonQuery("@EqpErrorMap.Delete", RefineExpando(obj));
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }

}
