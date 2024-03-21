namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Org.BouncyCastle.Asn1.Ocsp;

public class ApiHistoryService : MinimalApiService, IMinimalApi
{
    public ApiHistoryService(ILogger<ApiHistoryService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }
    
    public static IEnumerable<IDictionary> List(int pageNo, int pageSize, DateTime fromDt, DateTime toDt, string? path, string? method, string? query, string? request, string? response, string? token, string? host, string? client)
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = pageNo;
        obj.PageSize = pageSize;
        obj.FromDt = fromDt;
        obj.ToDt = toDt;
        obj.Path = path;
        obj.Method = method;
        obj.Query = query;
        obj.Request = request;
        obj.Response = response;
        obj.Token = token;
        obj.Host = host;
        obj.Client = client;

        DataTable dt = DataContext.StringDataSet("@ApiHistory.List", RefineExpando(obj, true)).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static int ApiHistoryInsert(ILogger<AuthMiddleware> logger, string path, string method, string? query, string? request, string? token, string host, string? client)
    {
        int historyNo = 0;

        dynamic obj = new ExpandoObject();

        try
        {
            obj.Path = path ?? string.Empty;
            obj.Method = method;
            obj.Query = query ?? string.Empty;
            obj.Request = request ?? string.Empty;
            obj.Token = token ?? string.Empty;
            obj.Host = host;
            obj.Client = client ?? string.Empty;

            var db = DataContext.Create(null);
            db.IgnoreParameterSame = true;
            db.ExcludeLog = true;

            historyNo = db.ExecuteStringScalar<int>("@ApiHistory.Insert", obj);

            return historyNo;

        }
        catch (Exception ex)
        {
            try
            {
                logger.LogError(ex, $"ApiHistoryInsert Error {path ?? string.Empty}, {query ?? string.Empty}, {request ?? string.Empty}, {token ?? string.Empty}, {client ?? string.Empty}");
            }
            catch (Exception)
            {
            }
        }

        return historyNo;
    }

    [ManualMap]
    public static void ApiResultUpdate(ILogger<AuthMiddleware> logger, int historyNo, string response)
    {
        if (response.Length > 80000)
            response = "Too Long Response";

        dynamic obj = new ExpandoObject();

        try
        {
            obj.HistoryNo = historyNo;
            obj.Response = response;

            var db = DataContext.Create(null);
            db.IgnoreParameterSame = true;
            db.ExcludeLog = true;

            db.ExecuteStringNonQuery("@ApiHistory.Update", obj);
        }
        catch (Exception ex)
        {
            try
            {
                logger.LogError(ex, $"ApiHistoryUpdate Error {historyNo}, {response ?? string.Empty}");
            }
            catch (Exception)
            {
            }
        }
    }

    [ManualMap]
    public static int ApiHistoryMerge(ILogger<AuthMiddleware> logger, string historyKey, string path, string method, string? query, string? request, string? response, string? token, string host, string? client)
    {
        dynamic obj = new ExpandoObject();

        try
        {
            obj.HistoryKey = historyKey;
            obj.Path = path ?? string.Empty;
            obj.Method = method;
            obj.Query = query ?? string.Empty;
            obj.Request = request ?? string.Empty;
            obj.Response = (object?)response ?? DBNull.Value;
            obj.Token = token ?? string.Empty;
            obj.Host = host;
            obj.Client = client ?? string.Empty;

            var db = DataContext.Create(null);
            db.IgnoreParameterSame = true;
            db.ExcludeLog = true;

            return db.ExecuteStringNonQuery("@ApiHistory.Merge", obj);
        }
        catch (Exception ex)
        {
            try
            {
                logger.LogError(ex, $"ApiHistoryMerge Error {historyKey} {path ?? string.Empty}, {query ?? string.Empty}, {request ?? string.Empty}, {token ?? string.Empty}, {client ?? string.Empty}");
            }
            catch (Exception)
            {
            }
        }

        return 0;
    }
}
