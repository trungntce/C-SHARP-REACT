using System.Diagnostics.CodeAnalysis;

namespace WebApp;

public interface IMinimalApi
{
    static abstract IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group);
}

[AttributeUsage(AttributeTargets.Method)]
public class ManualMapAttribute : Attribute
{
}

public class MinimalApiMapperFunc
{
    public Func<string, string, IEndpointRouteBuilder> MapGet { get; init; } = default!;
    public Func<string, string, IEndpointRouteBuilder> MapPut { get; init; } = default!;
    public Func<string, string, IEndpointRouteBuilder> MapPost { get; init; } = default!;
    public Func<string, string, IEndpointRouteBuilder> MapDelete { get; init; } = default!;
    public Func<IEndpointRouteBuilder> GetGroup { get; init; } = default!;
}