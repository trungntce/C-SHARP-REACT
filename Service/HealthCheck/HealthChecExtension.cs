namespace WebApp;

using System;
using System.Diagnostics;
using Microsoft.Extensions.Diagnostics.HealthChecks;

public static class HealthChecExtension
{
    static public IHealthChecksBuilder AddHealCheckAll(this IHealthChecksBuilder builder)
    {
        try
        {
            var list = HealthCheckService.ListAll(useYn: 'Y');

            foreach (var item in list)
            {
                builder.AddCheck($"[{item.HcCode}] {item.HcName} ({item.HcType})", _ =>
                {
                    var dt = HealthCheckService.GetHeartbeat(item.HcCode, item.HcType);
                    if (dt == null)
                        return HealthCheckResult.Degraded($"[/api/healthcheck/ping/{item.HcCode}/{item.HcType}] No Heartbeat");

                    if (dt.Value < DateTime.Now.AddMinutes(-2))
                        return HealthCheckResult.Unhealthy($"[/api/healthcheck/ping/{item.HcCode}/{item.HcType}] Heartbeat is too old, {dt.Value:yyyy-MM-dd HH:mm:ss}");

                    return HealthCheckResult.Healthy($"[/api/healthcheck/ping/{item.HcCode}/{item.HcType}] Heartbeat is OK, {dt.Value:yyyy-MM-dd HH:mm:ss}");

                }, item.TagList);
            }
        }
        catch (Exception ex)
        {
            Debug.WriteLine(ex);
        }

        return builder;
    }
}