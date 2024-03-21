namespace WebApp;

using System.Text.Json.Serialization;

public class HealthCheckPayload
{
    [JsonPropertyName("message")] public string? Message { get; set; }
}
