namespace WebApp;

using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Options;
using System;
using Telesign;

public class SmsService : MinimalApiService, IMinimalApi
{
    public SmsService(ILogger<SmsService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet(string.Empty, nameof(SendSms));

        return RouteAllEndpoint(group);
    }

    [ManualMap]
    public static int SendSms(ILogger<SmsService> logger, IOptions<Setting>? setting, string phoneNumber, string message)
    {
        try
        {
            MessagingClient messagingClient = new MessagingClient(setting!.Value.TelesignCustomerId, setting!.Value.TelesignApiKey);
            RestClient.TelesignResponse telesignResponse = messagingClient.Message(phoneNumber, message, "ARN");

            return telesignResponse.StatusCode;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Send Sms Error");
        }

        return -1;
    }
}
