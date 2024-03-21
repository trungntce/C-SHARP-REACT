namespace WebApp;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;
using System;
using System.Collections;

public class FileService : MinimalApiService, IMinimalApi
{
    public FileService(ILogger<FileService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapPut(string.Empty, nameof(Upload));
        group.MapGet(string.Empty, nameof(Download));

        return RouteAllEndpoint(group);
    }

    [ManualMap]
    public static IResult Upload(IOptions<Setting>? setting, ILogger<FileService> logger, 
        string folder, string ymd, IFormFileCollection files)
    {
        SetSetting(setting);

        var rtn = 0;

        string path = $"{GetUploadPath(folder)}{Path.DirectorySeparatorChar}{ymd}";

        foreach (var file in files)
        {
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);

            string key = file.Name;
            string ext = Path.GetExtension(file.FileName);
            string fileName = $"{key}{ext}";
            string fullPath = $"{path}{Path.DirectorySeparatorChar}{fileName}";

            if (!string.IsNullOrWhiteSpace(ext) && BlockExtList.Contains(ext.ToLower()))
            {
                logger.LogCritical("업로드 금지 파일 업로드: {fielName}, {UserId}", fileName, UserId);
                return Results.Problem($"금지된 확장자가 업로드 되었습니다. [{ext}] 요청 내역이 기록되었습니다.");
            }

            using (var stream = File.Create(fullPath))
            {
                file.CopyTo(stream);
            }

            rtn++;
        }

        return Results.Json(rtn);
    }

    [ManualMap]
    public static IResult Download(IOptions<Setting>? setting, ILogger<FileService> logger,
        string key, string folder, string ymd, string name)
    {
        SetSetting(setting);

        string path = $"{GetUploadPath(folder)}{Path.DirectorySeparatorChar}{ymd}";
        string ext = Path.GetExtension(name);
        string fileName = $"{key}{ext}";
        string fullPath = $"{path}{Path.DirectorySeparatorChar}{fileName}";

        if (!File.Exists(fullPath))
        {
            logger.LogCritical("비정상 파일 다운로드 요청: {fielName}, {UserId}", fileName, UserId);
            return Results.Problem("비정상적인 파일 다운로드가 확인되었습니다. 요청 내역이 기록되었습니다.");
        }

        return Results.File(fullPath, $"application/octet-stream");
    }
}
