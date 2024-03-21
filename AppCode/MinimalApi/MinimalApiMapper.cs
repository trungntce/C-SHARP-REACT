using Framework;

namespace WebApp;

static public class MinimalApiMapper
{
    public static IEndpointRouteBuilder MapMinimalApiAll(this IEndpointRouteBuilder app)
    {
        var type = typeof(IMinimalApi);
        var types = AppDomain.CurrentDomain.GetAssemblies()
            .SelectMany(s => s.GetTypes())
            .Where(p => type.IsAssignableFrom(p) && !p.IsInterface);

        foreach (var t in types)
            MapMinimalApi(app, t);

        return app;
    }

    public static IEndpointRouteBuilder MapMinimalApi(IEndpointRouteBuilder app, Type type)
    {
        if (type.GetInterface(nameof(IMinimalApi)) == null)
            throw new ArgumentException("Type argument must be a IMinimalApi.");

        var name = RefineServiceName(type);
        var group = MapGroup(app, name);

        var mapperFunc = new MinimalApiMapperFunc()
        {
            MapGet = (string pattern, string methodName) =>
            {
                group.MapGet(pattern, MinimalApiService.CreateStaticDelegate(methodName));
                return group;
            },
            MapPut = (string pattern, string methodName) =>
            {
                group.MapPut(pattern, MinimalApiService.CreateStaticDelegate(methodName));
                return group;
            },
            MapPost = (string pattern, string methodName) =>
            {
                group.MapPost(pattern, MinimalApiService.CreateStaticDelegate(methodName));
                return group;
            },
            MapDelete = (string pattern, string methodName) =>
            {
                group.MapDelete(pattern, MinimalApiService.CreateStaticDelegate(methodName));
                return group;
            },
            GetGroup = () => group,
        };

        type.GetMethod(nameof(IMinimalApi.RouteEndpoint))!
            .Invoke(null, new object[] { mapperFunc });

        return app;
    }

    private static IEndpointRouteBuilder MapGroup(IEndpointRouteBuilder app, string name)
    {
        return app.MapGroup($"/api/{name}").WithTags(name);
    }

    public static string RefineServiceName(Type type)
    {
        var suffix = "Service";
        var name = TrimEnd(type.Name, suffix);

        return name.ToLower();
    }

    public static string TrimEnd(string s, string suffix)
    {
        if (s.EndsWith(suffix, StringComparison.InvariantCultureIgnoreCase))
            return s[..^suffix.Length];

        return s;
    }
}
