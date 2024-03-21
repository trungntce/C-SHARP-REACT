using Framework;
using Microsoft.AspNetCore.Authentication.OAuth.Claims;
using Microsoft.Extensions.FileSystemGlobbing.Internal;
using System.Diagnostics;
using System.Linq.Expressions;
using System.Reflection;
using Unity.Interception.Utilities;

namespace WebApp;

public class MinimalApiService : BaseServiceEx
{
    public MinimalApiService(ILogger<MinimalApiService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteAllEndpoint(MinimalApiMapperFunc group)
    {
        var classType = new StackTrace().GetFrame(1)?.GetMethod()?.ReflectedType;

        if (classType == null)
            throw new ApplicationException("RouteAllEndpoint must called from MinimalApiService, IMinimalApi");
       
        return MapAll(group.GetGroup(), classType);
    }

    public static IEndpointRouteBuilder MapAll(IEndpointRouteBuilder group, Type type)
    {
        var methods = ExtractApiMethods(type);
        methods.ForEach(method => GetDelegateByName(method.Name).DynamicInvoke(group, method));

        return group;
    }

    public static Delegate GetDelegateByName(string methodName) => methodName.ToLower() switch
    {
        "listall" => MapListAll,
        "list" => MapList,
        "select" or "get" => MapGet,
        "update" or "post" => MapPost,
        "insert" or "put" => MapPut,
        "delete" => MapDelete,
        "refresh" => MapRefresh,

        "listcache" => MapListCache,
        "listallcache" => MapListAllCache,
        "selectcache" => MapSelectCache,
        "removecache" => MapRemoveCache,
        _ => throw new ArgumentException($"Unknown method name: {methodName}")
    };

    public static void MapListAll(IEndpointRouteBuilder group, MethodInfo method)
    {
        var parameters = method.GetParameters();

        //var pattern = string.Join(string.Empty, parameters.Select(x => $"/{{{x.Name}}}"));
        var handler = CreateStaticDelegate(method);

        group.MapGet($"/all", handler);
    }

    public static void MapListAllCache(IEndpointRouteBuilder group, MethodInfo method)
    {
        var handler = CreateStaticDelegate(method);

        group.MapGet($"/allcache", handler);
    }

    public static void MapListCache(IEndpointRouteBuilder group, MethodInfo method)
    {
        var handler = CreateStaticDelegate(method);

        group.MapGet($"/cache", handler);
    }

    public static void MapList(IEndpointRouteBuilder group, MethodInfo method)
    {
        var handler = CreateStaticDelegate(method);

        group.MapGet("/", handler);
    }

    public static void MapGet(IEndpointRouteBuilder group, MethodInfo method)
    {
        var handler = CreateStaticDelegate(method);

        group.MapGet($"/select", handler);
    }

    public static void MapPost(IEndpointRouteBuilder group, MethodInfo method)
    {
        var handler = CreateStaticDelegate(method);

        group.MapPost(string.Empty, handler);
    }

    public static void MapPut(IEndpointRouteBuilder group, MethodInfo method)
    {
        var handler = CreateStaticDelegate(method);

        group.MapPut(string.Empty, handler);
    }

    public static void MapDelete(IEndpointRouteBuilder group, MethodInfo method)
    {
        var handler = CreateStaticDelegate(method);

        group.MapDelete(string.Empty, handler);
    }

    public static void MapSelectCache(IEndpointRouteBuilder group, MethodInfo method)
    {
        var handler = CreateStaticDelegate(method);

        group.MapGet("selectcache", handler);
    }

    public static void MapRemoveCache(IEndpointRouteBuilder group, MethodInfo method)
    {
        var handler = CreateStaticDelegate(method);

        group.MapGet("removecache", handler);
    }

    public static void MapRefresh(IEndpointRouteBuilder group, MethodInfo method)
    {
        var handler = CreateStaticDelegate(method);

        group.MapGet($"/refresh", handler);
    }

    public static IEnumerable<MethodInfo> ExtractApiMethods<T>()
        where T : class
    {
        return ExtractApiMethods(typeof(T));
    }

    public static IEnumerable<MethodInfo> ExtractApiMethods(Type type)
    {
        var methods = type.GetMethods(BindingFlags.Public | BindingFlags.Static | BindingFlags.DeclaredOnly);
        var map = type.GetInterfaceMap(typeof(IMinimalApi));

        var filtered = methods
            .Where(x => x.GetCustomAttribute(typeof(ManualMapAttribute), true) == null)
            .Where(x => !map.TargetMethods.Contains(x));

        if (typeof(Map.IMap).IsAssignableFrom(type))
        {
            var imap = type.GetInterfaceMap(typeof(Map.IMap));
            filtered = filtered.Where(x => !imap.TargetMethods.Contains(x));
        }

        return filtered;
    }

    public static Delegate CreateStaticDelegate(string methodName)
    {
        var classType = new StackTrace().GetFrame(2)?.GetMethod()?.ReflectedType;
        return CreateStaticDelegate(classType!.GetMethod(methodName)!);
    }

    public static Delegate CreateStaticDelegate(MethodInfo methodInfo)
    {
        var parmTypes = methodInfo.GetParameters().Select(parm => parm.ParameterType);
        var parmAndReturnTypes = parmTypes.Append(methodInfo.ReturnType).ToArray();
        var delegateType = Expression.GetDelegateType(parmAndReturnTypes);

        return methodInfo.CreateDelegate(delegateType);
    }
}