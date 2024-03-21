namespace WebApp;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Threading.Tasks;
using System.Data;
using System.Transactions;
using Framework;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Mvc;
using System.Dynamic;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Math;
using static Unity.Storage.RegistrationSet;

public class UserService : MinimalApiService, IMinimalApi, Map.IMap
{
    public UserService(ILogger<UserService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("login", nameof(Login));
        group.MapPost("profile", nameof(ProfileUpdate));
        group.MapPost("group", nameof(UsergroupUpdate));

        return RouteAllEndpoint(group);
    }

    public static UserList ListAll()
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;

        return new UserList(DataContext.StringEntityList<UserEntity>("@User.List", RefineExpando(obj)));
    }

    public static UserList List(int pageNo, int pageSize, string? userId, string? userName, string? nationCode, string? email, char? useYn, string? remark)
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = pageNo;
        obj.PageSize = pageSize;
        obj.UserId = userId;
        obj.UserName = userName;
        obj.NationCode = nationCode;
        obj.Email = email;
        obj.UseYn = useYn;
        obj.Remark = remark;

        return new UserList(DataContext.StringEntityList<UserEntity>("@User.List", RefineExpando(obj, true)));
    }

    public static UserEntity? SelectCache(string userId)
    {
        return ListAllCache().FirstOrDefault(x => x.UserId == userId);
    }

    [ManualMap]
    public static string UserName(string? userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
            return userId;

        return SelectCache(userId)?.UserName ?? userId;
    }

    [ManualMap]
    public static UserEntity? LoginSelect(string userId, string password)
    {
        dynamic obj = new ExpandoObject();
        obj.UserId = userId;
        obj.Password = password;

        return DataContext.StringEntity<UserEntity?>("@User.LoginSelect", obj);
    }
    
    [ManualMap]
    public static IResult Login(IAuthService auth, string userId, string password)
    {
        var user = auth.Authenticate(userId, password);
        if (user == null)
            return Results.Problem("ID 또는 패스워드가 잘못되었습니다.");

        LoginDtUpdate(userId);

        return Results.Ok(user);
    }

    [ManualMap]
    public static Dictionary<string, int> MenuAuthDic(string userId, string? usergroupJson)
    {
        Dictionary<string, int> rtn = new();

        dynamic obj = new ExpandoObject();
        obj.UserId = userId;
        obj.UsergroupJson = usergroupJson;

        DataTable dt = DataContext.StringDataSet("@User.MenuAuthList", RefineExpando(obj, true)).Tables[0];

        foreach (DataRow row in dt.Rows)
            rtn.Add(row.TypeCol<string>("menu_id"), row.TypeCol<int>("auth"));

        return rtn;
    }

    [ManualMap]
    public static int CountSelect(string userId)
    {
        dynamic obj = new ExpandoObject();
        obj.UserId = userId;

        return DataContext.StringValue<int>("@User.CountSelect", RefineExpando(obj, true));
    }

    public static int Insert([FromBody] UserEntity entity)
    {
        if (CountSelect(entity.UserId) > 0)
            return -1;

        RemoveCache();

        return DataContext.StringNonQuery("@User.Insert", RefineEntity(entity));
    }

    public static int Update([FromBody] UserEntity entity)
    {
        RemoveCache();

        return DataContext.StringNonQuery("@User.Update", RefineEntity(entity));
    }

    [ManualMap]
    public static int UsergroupUpdate([FromBody] UserEntity entity)
    {
        var list = entity.UsergroupList;
        list.RemoveAll(x => x == Setting.LoginUserGroup);
        entity.UsergroupList = list;

        return DataContext.StringNonQuery("@User.UsergroupUpdate", RefineEntity(entity));
    }

    [ManualMap]
    public static int ProfileUpdate(ILogger<UserService> logger, [FromBody] UserEntity entity)
    {
        // 부정 접근
        if(!string.IsNullOrWhiteSpace(entity.UserId))
            logger.LogCritical($"타인 아이디 업데이트 시도, LoginID: {UserId}, TryID: {entity.UserId}");

        entity.UserId = UserId;
        
        return Update(entity);
    }

    [ManualMap]
    public static int LoginDtUpdate(string userId)
    {
        dynamic obj = new ExpandoObject();
        obj.UserId = userId;

        return DataContext.StringNonQuery("@User.LoginDtUpdate", RefineExpando(obj));
    }

    public static UserList ListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(),
            DateTime.Now.AddMinutes(GetCacheMin()),
            ListAll);

        return list;
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }

    public static void RefreshMap()
    {
        RemoveCache();
    }

    public static Map GetMap(string? category = null)
    {
        return ListAllCache()
            .Select(y => {
                return new MapEntity(y.UserId, y.UserName, y.NationCode, 'Y');
            }).ToMap();
    }
}
