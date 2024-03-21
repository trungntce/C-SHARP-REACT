namespace WebApp;

using System;
using System.Net;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

public class ExceptionMiddleware
{
    static int lastEventId = 500000001;
    readonly RequestDelegate _next;
    readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var body = await ReadBody(context.Request);

        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            context.Response.ContentType = "application/json";

            switch (ex)
            {
                case ApplicationException appEx:
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    break;
                default:
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    break;
            }

            if (lastEventId >= int.MaxValue)
                lastEventId = 500000001;

            string path = context.Request.Path;
            string method = context.Request.Method;
            string host = context.Request.Host.Value;
            string? query = context.Request.QueryString.Value;
            string? client = context.Connection.RemoteIpAddress?.ToString();

            _logger.LogError(new EventId(++lastEventId), ex, "query: {query}, body: {body}", query, body);

            ExceptionService.ExceptionInsert(_logger, lastEventId, path, method, query, body, host, client, ex.Message, ex.Source, ex.StackTrace);

            var result = JsonConvert.SerializeObject(new { 
                title = $"[{lastEventId}] 작업중 오류가 발생했습니다.", 
                detail = $"time: {DateTime.Now:yyyy-MM-dd HH:mm:ss}, message: {ex?.Message}" 
            });

            await context.Response.WriteAsync(result);
        }
    }

    public async Task<string> ReadBody(HttpRequest request)
    {
        if (request.ContentLength == null || request.ContentLength <= 0)
            return string.Empty;

        string rtn;

        request.EnableBuffering();

        var buffer = new byte[Convert.ToInt32(request.ContentLength)];
        await request.Body.ReadAsync(buffer, 0, buffer.Length);
        rtn = Encoding.UTF8.GetString(buffer);

        request.Body.Position = 0;

        return rtn;
    }
}