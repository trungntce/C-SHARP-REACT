using Microsoft.AspNetCore.Http.Json;

using Serilog;
using Serilog.Sinks.SystemConsole.Themes;
using ILogger = Serilog.ILogger;
using HashidsNet;

using Framework;
using WebApp;
using HealthChecks.UI.Client;

var builder = WebApplication.CreateBuilder(args);

var appSettings = builder.Configuration.GetSection("AppSettings");

builder.Services.AddControllersWithViews().AddNewtonsoftJson();

builder.Services.AddHttpContextAccessor();

builder.Services.Configure<Setting>(appSettings);

builder.Services.AddSingleton<IHashids>(_ => new Hashids(appSettings.GetSection("AuthKey").Value!));

builder.Services.AddSingleton(
    new DataContext(
        builder.Configuration,
        new FileSqlCache(appSettings.GetSection("SqlFilePath").Value)));

builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddControllersWithViews();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();

builder.Services.Configure<IISServerOptions>(options =>
{
	options.AutomaticAuthentication = false;
});

builder.Services.Configure<JsonOptions>(options =>
{
    options.SerializerOptions.Converters.Add(new DataTableConverter());
});

ILogger logger = new LoggerConfiguration()
    .WriteTo.Async(config => config.Console(theme: AnsiConsoleTheme.Sixteen))
    .WriteTo.Async(config => config.File(appSettings.GetSection("LogFilePath").Value!, rollingInterval: RollingInterval.Hour)).CreateLogger();

builder.Logging.ClearProviders();
//builder.Logging.AddSerilog(logger);
//builder.Services.AddSingleton(logger);
builder.Host.UseSerilog(
    (hostingContext, services, loggerConfiguration) => 
    {
        loggerConfiguration
            .Filter.ByExcluding(ev => {
                return ev.Properties.Any(p =>
                {
                    var str = p.Value.ToString();
                    return
                        str.Contains("healthcheck", StringComparison.InvariantCultureIgnoreCase) ||
                        str.Contains("/hc/") ||
                        str.Contains("EntityFrameworkCore");
                });
            })
            .WriteTo.Async(config => config.Console(theme: AnsiConsoleTheme.Sixteen))
            .WriteTo.Async(config => config.File(appSettings.GetSection("LogFilePath").Value!, rollingInterval: RollingInterval.Hour));
    },
    writeToProviders: true);

DataContext.SetLogger(logger);

builder.Services
    .AddHealthChecks()
    .AddHealCheckAll();

var basePath = appSettings.GetSection("HealthCheckBasePath").Value!;

builder.Services.AddHealthChecksUI(options => {
    options.AddHealthCheckEndpoint("SIFLEX - SERVICE", $"{basePath}/hc/service");
    options.AddWebhookNotification("WEBHOOK - SERVICE", uri: $"{basePath}/api/healthcheck/payload",
        payload: "{ \"message\": \"Webhook report for [[LIVENESS]]: [[FAILURE]] - Description: [[DESCRIPTIONS]]\"}",
        restorePayload: "{ \"message\": \"[[LIVENESS]] is back to life\"}");

    options.AddHealthCheckEndpoint("SIFLEX - EQUIPMENT(PC)", $"{basePath}/hc/eqp");
    options.AddHealthCheckEndpoint("SIFLEX - SCANNER", $"{basePath}/hc/scn");
    options.AddHealthCheckEndpoint("SIFLEX - EP APP", $"{basePath}/hc/ep");
}).AddInMemoryStorage();


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHsts();
}

app.MapHealthChecks($"/hc/service", new() {
    Predicate = hc => hc.Tags.Contains("SERVICE", StringComparer.InvariantCultureIgnoreCase),
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});
app.MapHealthChecks($"/hc/eqp", new()
{
    Predicate = hc => hc.Tags.Contains("EQP", StringComparer.InvariantCultureIgnoreCase),
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});
app.MapHealthChecks($"/hc/scn", new()
{
    Predicate = hc => hc.Tags.Contains("SCN", StringComparer.InvariantCultureIgnoreCase),
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});

app.MapHealthChecks($"/hc/ep", new()
{
    Predicate = hc => hc.Tags.Contains("EP", StringComparer.InvariantCultureIgnoreCase),
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});

app.MapHealthChecksUI(options => {
    options.UIPath = "/hcdashboard";
    options.ApiPath = "/hc/api";
    options.WebhookPath = "/hc/webhook";
    options.ResourcesPath = "/hc/resource";
    options.AddCustomStylesheet("Files/healthcheck.css");
});

//app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseMiddleware<AuthMiddleware>(); // JWT 토큰 처리
if (app.Environment.IsProduction()) // 배포했을때만 자동으로 전역 예외처리
    app.UseMiddleware<ExceptionMiddleware>();

app.MapFallbackToFile("index.html");
app.MapHub<MainHub>("/mainHub");

app.MapMinimalApiAll();
app.Run();