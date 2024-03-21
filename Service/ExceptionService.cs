namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Drawing.Printing;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using Org.BouncyCastle.Asn1.Ocsp;

public class ExceptionService : MinimalApiService, IMinimalApi
{
    public ExceptionService(ILogger<ExceptionService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }

    public static IEnumerable<IDictionary> List(int pageNo, int pageSize, DateTime fromDt, DateTime toDt, int? eventId, string? path, string? method, string? query, string? body, string? host, string? client)
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = pageNo;
        obj.PageSize = pageSize;
        obj.FromDt = fromDt;
        obj.ToDt = toDt;
        obj.Path = path;
        obj.Method = method;
        obj.Query = query;
        obj.Body = body;
        obj.Host = host;
        obj.Client = client;

        DataTable dt = DataContext.StringDataSet("@Exception.List", RefineExpando(obj, true)).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
    public static async void ExceptionInsert(ILogger<ExceptionMiddleware> logger, int eventId, string? path, string? method, string? query, string? body, string? host, string? client, string? exMessage, string? exSource, string? exStacktrace)
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
    {
        dynamic obj = new ExpandoObject();

        try
        {
            obj.eventId = eventId;
            obj.Path = path ?? string.Empty;
            obj.Method = method;
            obj.Query = query ?? string.Empty;
            obj.Body = body ?? string.Empty;
            obj.Host = host;
            obj.Client = client ?? string.Empty;
            obj.ExMessage = exMessage ?? string.Empty;
            obj.ExSource = exSource ?? string.Empty;
            obj.ExStacktrace = exStacktrace ?? string.Empty;

            var db = DataContext.Create(null);
            db.IgnoreParameterSame = true;
            db.ExcludeLog = true;

            db.ExecuteStringNonQuery("@Exception.Insert", obj);

        }
        catch (Exception ex)
        {
            try
            {
                logger.LogError(ex, $"ApiHistoryInsert Error {eventId}, {query ?? string.Empty}, {query ?? string.Empty}, {body ?? string.Empty}, {exMessage ?? string.Empty}, {exSource ?? string.Empty}, {exStacktrace ?? string.Empty}");
            }
            catch (Exception)
            {
            }
        }
    }
}
