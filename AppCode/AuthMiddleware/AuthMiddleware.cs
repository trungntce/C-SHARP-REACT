namespace WebApp;

using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Framework;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.IO;
using Newtonsoft.Json;

public class AuthMiddleware
{
    readonly RequestDelegate _next;
    readonly string _authKey;
    readonly ILogger<AuthMiddleware> _logger;
    readonly RecyclableMemoryStreamManager _recyclableMemoryStreamManager;

    public AuthMiddleware(RequestDelegate next, IOptions<Setting> appSettings, ILogger<AuthMiddleware> logger)
    {
        _next = next;
        _authKey = appSettings.Value.AuthKey;
        _logger = logger;
        _recyclableMemoryStreamManager = new RecyclableMemoryStreamManager();
    }

    public async Task Invoke(HttpContext context, IAuthService _)
    {
        if (context.Request.Path.StartsWithSegments("/hc") ||
            context.Request.Path.StartsWithSegments("/api/healthcheck"))
        {
            await _next(context);
            return;
        }

        if (!context.Request.Path.StartsWithSegments("/api"))
        {
            await _next(context);
            return;
        }

        if (context.Request.Path.StartsWithSegments("/api/MonitoringDetail"))
        {
            await _next(context);
            return;
        }

        var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

        context?.Request.EnableBuffering();

        await using var requestStream = _recyclableMemoryStreamManager.GetStream();
        await context!.Request.Body.CopyToAsync(requestStream);
        string? request = ReadStreamInChunks(requestStream);
        context.Request.Body.Position = 0;

        string path = context.Request.Path;
        string method = context.Request.Method;
        string host = context.Request.Host.Value;
        string? query = context.Request.QueryString.Value;
        string? client = context.Connection.RemoteIpAddress?.ToString();

        if (!string.IsNullOrWhiteSpace(token) && token != "null")
        {
            if (!AuthenticateContext(context, token))
            {
                context.Response.StatusCode = StatusCodes.Status400BadRequest;
                context.Response.ContentType = "text/plain";
                await context.Response.WriteAsync("TokenExpired");
                return;
            }
        }

        if (context.Request.Path.StartsWithSegments("/api/menu") ||
            context.Request.Path.StartsWithSegments("/api/map") ||
            context.Request.Path.StartsWithSegments("/api/bbt") ||
            context.Request.Path.StartsWithSegments("/api/vrs") ||
            context.Request.Path.StartsWithSegments("/api/plcinfo") ||
            context.Request.Path.StartsWithSegments("/api/pcinfo") ||
            context.Request.Path.StartsWithSegments("/api/apihistory") ||
            context.Request.Path.StartsWithSegments("/api/exception"))
        {
            await _next(context);
            return;
        }

        int historyNo = ApiHistoryService.ApiHistoryInsert(_logger, path, method, query, request, token, host, client);

        var originalBodyStream = context.Response.Body;
        await using var responseBody = _recyclableMemoryStreamManager.GetStream();
        context.Response.Body = responseBody;

        await _next(context);

        context.Response.Body.Seek(0, SeekOrigin.Begin);
        var response = await new StreamReader(context.Response.Body).ReadToEndAsync();
        context.Response.Body.Seek(0, SeekOrigin.Begin);

        await responseBody.CopyToAsync(originalBodyStream);

        var __ = Task.Run(() =>
        {
            ApiHistoryService.ApiResultUpdate(_logger, historyNo, response);
        });
    }

    private static string ReadStreamInChunks(Stream stream)
    {
        const int readChunkBufferLength = 4096;
        stream.Seek(0, SeekOrigin.Begin);
        using var textWriter = new StringWriter();
        using var reader = new StreamReader(stream);
        var readChunk = new char[readChunkBufferLength];
        int readChunkLength;
        do
        {
            readChunkLength = reader.ReadBlock(readChunk, 0, readChunkBufferLength);
            textWriter.Write(readChunk, 0, readChunkLength);
        } while (readChunkLength > 0);
        return textWriter.ToString();
    }

    private bool AuthenticateContext(HttpContext context, string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_authKey)),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;

            context.Items["CorpId"] = jwtToken.Claims.FirstOrDefault(x => x.Type == "CorpId")?.Value;
            context.Items["FacId"] = jwtToken.Claims.FirstOrDefault(x => x.Type == "FacId")?.Value;
            context.Items["UserId"] = jwtToken.Claims.FirstOrDefault(x => x.Type == "UserId")?.Value;
            context.Items["IsAdmin"] = jwtToken.Claims.FirstOrDefault(x => x.Type == "IsAdmin")?.Value;
            context.Items["UserNationCode"] = jwtToken.Claims.FirstOrDefault(x => x.Type == "NationCode")?.Value;

            var menuAuth = jwtToken.Claims.FirstOrDefault(x => x.Type == "MenuAuth");
            if (menuAuth != null)
                context.Items["MenuAuth"] = JsonConvert.DeserializeObject<Dictionary<string, int>>(menuAuth.Value);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "AuthenticateContext Error: {0}", token);
            return false;
        }
    }
}