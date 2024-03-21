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
using System.ComponentModel;
using IdentityModel;
using Newtonsoft.Json.Linq;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Text;
using System.Text.Json;
using Newtonsoft.Json;
using System.Threading;

public class MessengerService : MinimalApiService, IMinimalApi, Map.IMap
{
    public MessengerService(ILogger<MessengerService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("getusergroup", nameof(GetUserGroup));
        group.MapGet("getuserbygroup", nameof(GetUserByGroup));
        group.MapGet("getinterlock", nameof(GetInterlock));
        group.MapGet("getopertype", nameof(GetOperType));
        group.MapGet("getgroupbyoper", nameof(GetGroupByOper));

        group.MapPut("insertmessenger", nameof(InsertMessenger));
        group.MapPost("deletemessenger", nameof(DeleteMessenger));

        return RouteAllEndpoint(group);
    }

    [ManualMap]
    public static IResult GetUserGroup()
    {
        dynamic obj = new ExpandoObject();

        DataTable dt = DataContext.StringDataSet("@Messenger.UserGroup", RefineExpando(obj)).Tables[0];

        return Results.Json(ToDic(dt));
    }

    [ManualMap]
    public static IResult GetUserByGroup(string pushTypeId)
    {
        dynamic obj = new ExpandoObject();
        obj.PushTypeId = pushTypeId;

        DataTable dt = DataContext.StringDataSet("@Messenger.UserByGroup", RefineExpando(obj)).Tables[0];

        return Results.Json(ToDic(dt));
    }

    [ManualMap]
    public static IResult GetInterlock()
    {
        dynamic obj = new ExpandoObject();
        obj.CorpId = "SIFLEX"; // 추후 수정 필요
        obj.FacId = "SIFLEX"; // 추후 수정 필요

        DataTable dt = DataContext.StringDataSet("@Messenger.Interlock", RefineExpando(obj)).Tables[0];

        return Results.Json(ToDic(dt));
    }

    [ManualMap]
    public static IResult GetOperType(string? operType)
    {
        dynamic obj = new ExpandoObject();
        obj.OperType = operType;

        DataTable dt = DataContext.StringDataSet("@Messenger.OperType", RefineExpando(obj)).Tables[0];

        return Results.Json(ToDic(dt));
    }

    [ManualMap]
    public static IResult GetGroupByOper(string operClassCode, string operType, string interlockCode)
    {
        dynamic obj = new ExpandoObject();
        obj.CorpId = "SIFLEX"; // 추후 수정 필요
        obj.FacId = "SIFLEX"; // 추후 수정 필요
        obj.OperType = operType;
        obj.OperClassCode = operClassCode;
        obj.InterlockCode = interlockCode;

        DataTable dt = DataContext.StringDataSet("@Messenger.GroupByOper", RefineExpando(obj)).Tables[0];

        var test = Results.Json(ToDic(dt));

        return Results.Json(ToDic(dt));
    }

    [ManualMap]
    public static int InsertMessenger([FromBody] Dictionary<string, object> value)
    {
        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        var param = value.ToCleanDic().ToDictionary(x => x.Key, y => y.Value!);

        dynamic obj = new ExpandoObject();

        var interlock = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(value.TypeKey<string>("interlock"));
        JObject operType = JObject.Parse(param.TypeKey<string>("operType"));
        JObject userIdJson = JObject.Parse(param.TypeKey<string>("userIdDesc"));
        JObject messengerCaseJson = JObject.Parse(param.TypeKey<string>("messengerCase"));

        obj.CorpId = "SIFLEX"; // 추후 수정 필요
        obj.FacId = "SIFLEX"; // 추후 수정 필요
        obj.Interlock = JsonConvert.SerializeObject(interlock).ToString();
        obj.OperClassCode = operType["opClassCode"].ToString();
        obj.OperClassName = operType["opClassDescription"].ToString();
        obj.OperTypeCode = operType["opTypeCode"].ToString();
        obj.OperTypeName = operType["opTypeDescription"].ToString();
        obj.IdCode = userIdJson["value"].ToString();
        obj.IdDesc = userIdJson["label"].ToString();
        obj.MessengerCaseCode = messengerCaseJson["value"].ToString();
        obj.MessengerCaseDesc = messengerCaseJson["label"].ToString();
        obj.UserTypeCode = param.TypeKey<string>("userType");
        

        int result = db.ExecuteStringNonQuery("@Messenger.InsertMessenger", RefineExpando(obj));

        return result;
    }

    [ManualMap]
    public static int DeleteMessenger([FromBody] Dictionary<string, object?> value)
    {
        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        var param = value.ToCleanDic().ToDictionary(x => x.Key, y => y.Value!);
        var json = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(value.TypeKey<string>("json"));

        dynamic obj = new ExpandoObject();
        obj.CorpId = "SIFLEX"; // 추후 수정 필요
        obj.FacId = "SIFLEX"; // 추후 수정 필요
        obj.Json = JsonConvert.SerializeObject(json).ToString();

        int result = db.ExecuteStringNonQuery("@Messenger.DeleteMessenger", RefineEntity(obj));

        return result;
    }

    public static Map GetMap(string? category = null)
    {
        return ListAllCache()
            .Where(x => category == null || x.TypeKey<string>("opTypeCode").StartsWith(category, StringComparison.OrdinalIgnoreCase))
            .Select(y => {
                return new MapEntity(
                    y.TypeKey<string>("opTypeCode"),
                    y.TypeKey<string>("opTypeDescription"),
                    string.Empty,
                    'Y');
            }).ToMap();
    }

    public static IEnumerable<IDictionary> ListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(),
            DateTime.Now.AddMinutes(GetCacheMin()),
            ListAll);

        return list;
    }

    public static IEnumerable<IDictionary> ListAll()
    {
        dynamic obj = new ExpandoObject();
        obj.OperType = "";

        return ToDic(DataContext.StringDataSet("@Messenger.OperType", obj).Tables[0]);
    }

    [ManualMap]
    public static Map GetUserGroupMap(string? category = null)
    {
        return ListGroupAllCache()
            .Select(y => {
                return new MapEntity(
                    y.TypeKey<string>("pushType"),
                    y.TypeKey<string>("pushDescription"),
                    string.Empty,
                    'Y');
            }).ToMap();
    }

    [ManualMap]
    public static IEnumerable<IDictionary> ListGroupAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(),
            DateTime.Now.AddMinutes(GetCacheMin()),
            ListGroupAll
            );

        return list;
    }

    [ManualMap]
    public static IEnumerable<IDictionary> ListGroupAll()
    {
        dynamic obj = new ExpandoObject();

        return ToDic(DataContext.StringDataSet("@Messenger.UserGroup", obj).Tables[0]);
    }

    [ManualMap]
    public static Map GetUserMap(string? category = null)
    {
        return ListUserAllCache()
            .Select(y => {
                return new MapEntity(
                    y.TypeKey<string>("userNo"),
                    y.TypeKey<string>("description"),
                    string.Empty,
                    'Y');
            }).ToMap();
    }

    [ManualMap]
    public static IEnumerable<IDictionary> ListUserAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(),
            DateTime.Now.AddMinutes(GetCacheMin()),
            ListUserAll
            );

        return list;
    }

    [ManualMap]
    public static IEnumerable<IDictionary> ListUserAll()
    {
        dynamic obj = new ExpandoObject();

        return ToDic(DataContext.StringDataSet("@Messenger.UserList", obj).Tables[0]);
    }

    public static void RefreshMap()
    {
        RemoveCache();
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }
}
