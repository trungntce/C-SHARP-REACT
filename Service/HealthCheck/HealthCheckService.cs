namespace WebApp;

using System;
using System.Collections.Concurrent;
using System.Data;
using System.Dynamic;
using System.Linq;
using System.Text.RegularExpressions;
using Framework;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Serilog;
using Serilog.Core;
using Unity.Interception.Utilities;

public class HealthCheckService : MinimalApiService, IMinimalApi
{
    static ConcurrentDictionary<ValueTuple<string, char>, DateTime> _heartbeatList = new();

    public HealthCheckService(ILogger<HealthCheckService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/ping/{eqpCode}/{type}", nameof(Ping));
        group.MapGet("/getall", nameof(GetHeartbeatAll));
        group.MapGet("/listall", nameof(HeartbeatListAll));
        group.MapPost("/payload", nameof(Payload));

        return RouteAllEndpoint(group);
    }

    [ManualMap]
    public static IResult Ping(string eqpCode, char type)
    {
        var hub = HttpContext.RequestServices.GetRequiredService<IHubContext<MainHub>>();
        DateTime now = DateTime.Now;

        if (string.IsNullOrWhiteSpace(eqpCode))
            return Results.NotFound();

        _heartbeatList[new(eqpCode, type)] = now;

        Task.Run(() => HealthHistoryInsert(eqpCode, type, now));

        hub.Clients.Group("heartbeatGroup").SendAsync("heartbeat", eqpCode, _heartbeatList[new(eqpCode, type)]);

        return Results.Ok();
    }

    [ManualMap]
	public static int HealthHistoryInsert(string eqpCode, char type, DateTime currentDate) 
    {
		dynamic obj = new ExpandoObject();
        obj.EqpCode = eqpCode;
        obj.TypeCode = type;
        obj.CurrentDate = currentDate;

        return DataContext.StringNonQuery("@HealthCheck.HistoryInsert", obj);
    }

    [ManualMap]
    public static DateTime? GetHeartbeat(string eqpCode, char type)
    {
        if (!_heartbeatList.ContainsKey(new(eqpCode, type)))
            return null;

        return _heartbeatList[new(eqpCode, type)];
    }

    [ManualMap]
    public static IResult GetHeartbeatAll()
    {
        return Results.Json(JsonConvert.SerializeObject(_heartbeatList));
    }

    [ManualMap]
    public static List<Dictionary<string, object>> HeartbeatListAll()
    {
        List<Dictionary<string, object>> list = new();
        
        foreach (var item in _heartbeatList)
        {
            list.Add(new Dictionary<string, object>()
            {
                { "EqpCode", item.Key.Item1 },
                { "Type", item.Key.Item2 },
                { "Heartbeat", item.Value }
            });
        }

        return list;
    }

    static public List<HealthcheckEntity> List(string? hcCode, char? hcType, string? hcName, string? tags, char? useYn)
    {
        dynamic obj = new ExpandoObject();
        obj.HcCode = hcCode;
        obj.HcType = hcType;
        obj.HcName = hcName;
        obj.Tags = tags;
        obj.UseYn = useYn;

        return DataContext.StringEntityList<HealthcheckEntity>("@HealthCheck.List", RefineExpando(obj));
    }

    static public List<HealthcheckEntity> ListAll(char useYn)
    {
        dynamic obj = new ExpandoObject();
        obj.UseYn = useYn;

        return DataContext.StringEntityList<HealthcheckEntity>("@HealthCheck.List", obj);
    }

    public static HealthcheckEntity? Select(string hcCode)
    {
        dynamic obj = new ExpandoObject();
        obj.HcCode = hcCode;

        return DataContext.StringEntity<HealthcheckEntity>("@HealthCheck.Select", RefineExpando(obj, true));
    }

    public static int Insert([FromBody] HealthcheckEntity entity)
    {
        if (Select(entity.HcCode) != null)
            return -1;

        if (!string.IsNullOrWhiteSpace(entity.Tags))
        {
            entity.Tags = entity.Tags.Replace(" ", string.Empty);
            entity.Tags = entity.Tags.Replace("\t", string.Empty);
        }


        return DataContext.StringNonQuery("@HealthCheck.Insert", RefineEntity(entity));
    }

    public static int Update([FromBody] HealthcheckEntity entity)
    {
        if (!string.IsNullOrWhiteSpace(entity.Tags))
        {
            entity.Tags = entity.Tags.Replace(" ", string.Empty);
            entity.Tags = entity.Tags.Replace("\t", string.Empty);
        }

        return DataContext.StringNonQuery("@HealthCheck.Update", RefineEntity(entity));
    }

    public static int Delete(string hcCode)
    {
        dynamic obj = new ExpandoObject();
        obj.HcCode = hcCode;

        return DataContext.StringNonQuery("@HealthCheck.Delete", RefineExpando(obj));
    }

    [ManualMap]
    public static IResult Payload(HealthCheckPayload payload)
    {
        string? message = payload.Message;

        return Results.Ok();
    }
}