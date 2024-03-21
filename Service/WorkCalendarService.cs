namespace WebApp;

using System;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Mvc;

public class WorkCalendarService : MinimalApiService, IMinimalApi
{
    public WorkCalendarService(ILogger<WorkCalendarService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }
    
    public static WorkCalendarList ListAll()
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;

		return new WorkCalendarList(DataContext.StringEntityList<WorkCalendarEntity>("@WorkCalendar.List", RefineExpando(obj)));
    }

    public static WorkCalendarList List(DateTime fromDt, DateTime toDt, string? workerId)
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;
        obj.FromDt = fromDt;
		obj.ToDt = toDt;
        obj.WorkerId = workerId;

		return new WorkCalendarList(DataContext.StringEntityList<WorkCalendarEntity>("@WorkCalendar.List", RefineExpando(obj, true)));
    }

    public static WorkCalendarEntity? Select(DateTime? workDate, string workerId)
    {
        dynamic obj = new ExpandoObject();
        obj.WorkDate = workDate;
        obj.WorkerId = workerId;

        return DataContext.StringEntity<WorkCalendarEntity>("@WorkCalendar.Select", RefineExpando(obj, true));
    }

    public static int Insert([FromBody] WorkCalendarEntity entity)
    {
        if (Select(entity.WorkDate, entity.WorkerId) != null)
            return -1;

        RemoveCache();

        return DataContext.StringNonQuery("@WorkCalendar.Insert", RefineEntity(entity));
    }

    public static int Update([FromBody] WorkCalendarEntity entity)
    {
        return DataContext.StringNonQuery("@WorkCalendar.Update", RefineEntity(entity));
    }

    public static int Delete(DateTime workDate)
    {
        dynamic obj = new ExpandoObject();
        obj.WorkDate = workDate;

        RemoveCache();

        return DataContext.StringNonQuery("@WorkCalendar.Delete", RefineExpando(obj));
    }

    public static WorkCalendarList ListAllCache()
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
}
