namespace WebApp;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data;
using System.Dynamic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;
using System.Xml.Linq;

using Framework;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using ProtoBuf;
using shortid;
using ShortIdOption = shortid.Configuration.GenerationOptions;

public partial class BaseServiceEx : BaseService
{
    public static HttpContext HttpContext => new HttpContextAccessor().HttpContext!;

    public static ILogger _logger = default!;

    static readonly string _corpIdKey = "corpId";
    static readonly string _facIdKey = "facId";
    static readonly string _createUserIdKey = "createUser";
    static readonly string _updateUserIdKey = "updateUser";
    static readonly Func<string, string> _keyNameFunc = x => x;

    static IOptions<Setting>? _setting;

    public readonly static List<string> BlockExtList = new List<string>() 
    {
        ".com",
        ".exe",
        ".dll",
        ".ocx",
        ".ps1",
        ".ps1xml",
        ".ps2",
        ".ps2xml",
        ".psc1",
        ".psc2",
        ".msh",
        ".msh1",
        ".msh2",
        ".mshxml",
        ".msh1xml",
        ".msh2xml",
        ".js",
        ".jse",
        ".vbs",
        ".vb",
        ".vbe",
        ".cmd",
        ".bat",
        ".hta",
        ".inf",
        ".reg",
        ".pif",
        ".scr",
        ".cpl",
        ".scf",
        ".msc",
        ".pol",
        ".hlp",
        ".chm",
        ".ws",
        ".wsf",
        ".wsc",
        ".wsh",
        ".jar",
        ".rar",
        ".z",
        ".bz2",
        ".cab",
        ".gz",
        ".tar",
        ".ace",
        ".msi",
        ".msp",
        ".mst",
        ".msu",
        ".ppkg",
        ".bak",
        ".tmp",
        ".ost",
        ".pst",
        ".pkg",
        ".iso",
        ".img",
        ".vhd",
        ".vhdx",
        ".application",
        ".lock",
        ".lck",
        ".sln",
        ".cs",
        ".csproj",
        ".resx",
        ".config",
        ".resources",
        ".pdb",
        ".manifest",
        ".mp3",
        ".wma",
        ".doc",
        ".dot",
        ".wbk",
        ".xls",
        ".xlt",
        ".xlm",
        ".xla",
        ".ppt",
        ".pot",
        ".pps",
        ".ade",
        ".adp",
        ".mdb",
        ".cdb",
        ".mda",
        ".mdn",
        ".mdt",
        ".mdf",
        ".mde",
        ".ldb",
        ".wps",
        ".xlsb",
        ".xlam",
        ".xll",
        ".xlw",
        ".ppam"
    };

    public static void SetSetting(IOptions<Setting>? setting)
    {
        _setting = setting;
    }

    static IWebHostEnvironment? _environment;

    public static string UserCorpId => HttpContext.Items.SafeTypeKey("CorpId", "SIFLEX"); //TODO: 추후 기본값 삭제

    public static string UserFacId => HttpContext.Items.SafeTypeKey("FacId", "SIFLEX"); //TODO: 추후 기본값 삭제

    public static string UserId => HttpContext.Items.SafeTypeKey("UserId", "guest");

    public static string IsAdmin => HttpContext.Items.SafeTypeKey("IsAdmin", "N");

    public static Dictionary<string, int>? MenuAuth => HttpContext.Items.SafeTypeKey<object, object?, Dictionary<string, int>?>("MenuAuth");

    public static string UserNationCode => HttpContext.Items.SafeTypeKey("UserNationCode", "ko-KR");

    public static string UploadRootPath
    {
        get
        {
            var path = _setting!.Value.UploadFilePath;
            if (path.StartsWith("./"))
                path = Path.Combine(_environment!.ContentRootPath, path.Replace('/', Path.DirectorySeparatorChar));

            return path;
        }
    }

    protected static string GetUploadPath(string folder)
    {
        return Path.Combine($"{UploadRootPath}{Path.DirectorySeparatorChar}{folder}");
    }

    public BaseServiceEx(
        ILogger logger)
    {
        _logger = logger;
    }

    public BaseServiceEx(
        ILogger logger,
        IOptions<Setting> appSettings,
        IWebHostEnvironment webHostEnvironment)
    {
        _logger = logger;
        _setting = appSettings;
        _environment = webHostEnvironment;
    }

    public static IEnumerable<IDictionary<string, object>> RefineParam(IEnumerable<IDictionary<string, object>> list)
    {
        foreach (var dic in list)
        {
            RefineParam(dic);
        }

        return list;
    }

    public static IDictionary<string, object> RefineParam(IDictionary<string, object> dic, bool isRemoveNuill = true)
    {
        return RefineParam(dic, x => x, isRemoveNuill);
    }

    public static IDictionary<string, object> RefineParam(IDictionary<string, object> dic, Func<string, string> keyNameFunc, bool isRemoveNuill = true)
    {
        if (!dic.ContainsKey(keyNameFunc(_corpIdKey)) ||
            dic[keyNameFunc(_corpIdKey)] == null ||
            string.IsNullOrWhiteSpace(dic.TypeKey(keyNameFunc(_corpIdKey), string.Empty)))
            dic[keyNameFunc(_corpIdKey)] = UserCorpId;

        if (!dic.ContainsKey(keyNameFunc(_facIdKey)) ||
            dic[keyNameFunc(_facIdKey)] == null ||
            string.IsNullOrWhiteSpace(dic.TypeKey(keyNameFunc(_facIdKey), string.Empty)))
            dic[keyNameFunc(_facIdKey)] = UserFacId;

        dic[keyNameFunc(_createUserIdKey)] = UserId;
        dic[keyNameFunc(_updateUserIdKey)] = UserId;

        if (!isRemoveNuill)
            return dic;

        string[] keys = new string[dic.Keys.Count];

        dic.Keys.CopyTo(keys, 0);

        for (int i = dic.Keys.Count - 1; i >= 0; i--)
        {
            string key = keys[i];
            if (dic[key] == null)
                dic.Remove(key);
        }

        return dic;
    }

    public static ExpandoObject RefineExpando(ExpandoObject entity, bool isRemoveNuill = true)
    {
        return RefineExpando(entity, UtilEx.CamelToPascal, isRemoveNuill);
    }

    public static ExpandoObject RefineExpando(ExpandoObject entity, Func<string, string> keyNameFunc, bool isRemoveNuill = true)
    {
        var dic = (IDictionary<string, object?>)entity;

        if (!dic.ContainsKey(keyNameFunc(_corpIdKey)) ||
            dic[keyNameFunc(_corpIdKey)] == null ||
            string.IsNullOrWhiteSpace(dic.TypeKey(keyNameFunc(_corpIdKey), string.Empty)))
            dic[keyNameFunc(_corpIdKey)] = UserCorpId;

		if (!dic.ContainsKey(keyNameFunc(_facIdKey)) ||
	        dic[keyNameFunc(_facIdKey)] == null ||
	        string.IsNullOrWhiteSpace(dic.TypeKey(keyNameFunc(_facIdKey), string.Empty)))
			dic[keyNameFunc(_facIdKey)] = UserFacId;

		dic[keyNameFunc(_createUserIdKey)] = UserId;
        dic[keyNameFunc(_updateUserIdKey)] = UserId;

        if (!isRemoveNuill)
            return entity;

        string[] keys = new string[dic.Keys.Count];

        dic.Keys.CopyTo(keys, 0);

        for (int i = dic.Keys.Count - 1; i >= 0; i--)
        {
            string key = keys[i];
            if (dic[key] == null)
                dic.Remove(key);
        }

        return entity;
    }

    public static dynamic RefineEntity(dynamic entity)
    {
        if (string.IsNullOrWhiteSpace(UtilEx.GetPropertyValue<string>(entity, _corpIdKey)))
            UtilEx.SetPropertyValue(entity, _corpIdKey, UserCorpId);

		if (string.IsNullOrWhiteSpace(UtilEx.GetPropertyValue<string>(entity, _facIdKey)))
			UtilEx.SetPropertyValue(entity, _facIdKey, UserFacId);

		UtilEx.SetPropertyValue(entity, _createUserIdKey, UserId);
        UtilEx.SetPropertyValue(entity, _updateUserIdKey, UserId);

        return entity;
    }

    public static dynamic InlineExpando(dynamic entity)
    {
        Dictionary<string, object> dic = UtilEx.ToDic(entity);

        dynamic obj = new ExpandoObject();
        var rtn = (IDictionary<string, object?>)obj;

        rtn[_corpIdKey] = UserCorpId;
        rtn[_facIdKey] = UserFacId;
        rtn[_createUserIdKey] = UserId;
        rtn[_updateUserIdKey] = UserId;

        foreach (var key in dic.Keys)
            rtn[key] = dic[key];

        return rtn;
    }

    public static IDictionary<string, IEnumerable<IDictionary>> ToDic(DataSet ds)
    {
        var dic = new Dictionary<string, IEnumerable<IDictionary>>();

        foreach (DataTable dt in ds.Tables)
            dic.Add(dt.TableName, ToDic(dt));

        return dic;
    }

    public static IEnumerable<IDictionary> ToDic(DataTable dt, Func<string, string>? columnNameFunc = null)
    {
        return dt.ToDic(columnNameFunc ?? UtilEx.ToCamel);
    }

    public static IDictionary<string, Dictionary<string, object>> ToKeyDic(DataTable dt, string keyCol)
    {
        return dt.ToKeyDic(keyCol, UtilEx.ToCamel);
    }

    public static IEnumerable<IDictionary> ToList(DataTable dt)
    {
        return dt.ToDic(UtilEx.ToCamel);
    }

    public static IEnumerable<IDictionary> ToList(DataSet ds)
    {
        return ds.Tables[0].ToDic(UtilEx.ToCamel);
    }

    public static IEnumerable<dynamic> ToDynamic(DataTable dt)
    {
        return dt.ToDynamic(UtilEx.ToCamel);
    }

    public static IEnumerable<dynamic> ToDynamic(DataSet ds)
    {
        return ds.Tables[0].ToDynamic(UtilEx.ToCamel);
    }

    public static XDocument? ToXDoc<T>(IEnumerable<T> list, string rootName = "root", string itemName = "item")
    {
        IDictionary root = new HybridDictionary() {
            { rootName, new HybridDictionary() {
                { itemName, list } }
            }
        };

        string json = JsonConvert.SerializeObject(root);

        return JsonConvert.DeserializeXNode(json);
    }

    public static XDocument? ToXDoc(IDictionary dic, string rootName = "root", string itemName = "item")
    {
        IDictionary root = new HybridDictionary() {
            { rootName, new HybridDictionary() {
                { itemName, dic } }
            }
        };

        string json = JsonConvert.SerializeObject(root);

        return JsonConvert.DeserializeXNode(json);
    }

    public static void FindLabel(DataTable dt, string valueCol, string labelCol, Func<string, string> mapper)
    {
        var vCol = UtilEx.ToSnake(valueCol);
        var lCol = UtilEx.ToSnake(labelCol);

        if(!dt.Columns.Contains(lCol))
            dt.Columns.Add(lCol, typeof(string));

        foreach (DataRow row in dt.Rows)
        {
            var val = row.TypeCol<string>(vCol);
            var label = mapper.Invoke(val);

            row[lCol] = label;
        }
    }

    public static IResult HandleResult(
        int result,
        [CallerMemberName] string memberName = "",
        [CallerFilePath] string filePath = "",
        [CallerLineNumber] int lineNumber = 0)
    {
        if (result > 0)
            return Results.Ok();

        _logger.LogError("실패(result <= 0), method:{memberName}, {filePath}:{lineNumber}", memberName, filePath, lineNumber);

        return Results.Problem("작업이 실패했습니다.");
    }

    public static string NewGuid()
    {
        return GuidClean().Replace(Convert.ToBase64String(Guid.NewGuid().ToByteArray()), "");
    }

    //public static string NewShortId()
    //{
    //    return ShortId.Generate(new ShortIdOption(true, false));
    //}

    public static string NewShortId(bool useNumbers = true, int length = 15)
    {
        return ShortId.Generate(new ShortIdOption(useNumbers, false, length));
    }

    public static byte[] ToBinary(string base64)
    {
        return Convert.FromBase64String(base64);
    }

    public static string Serialize(IDictionary dic)
    {
        return JsonConvert.SerializeObject(dic);
    }
    public static string Serialize(IDictionary<string, object> dic)
    {
        return JsonConvert.SerializeObject(dic);
    }

    public static string Serialize(DataTable dt)
    {
        return JsonConvert.SerializeObject(dt);
    }

    public static string Serialize(DataSet ds)
    {
        return JsonConvert.SerializeObject(ds);
    }

    public static string Serialize(params object[] parames)
    {
        return JsonConvert.SerializeObject(parames);
    }

    public static Regex GuidClean()
    {
        return new Regex("[/+=]");
    }

    public static string BuildCacheKey(string userContext = "", [CallerFilePath] string filePath = "")
    {
        return BuildCacheKeyBase(UserCorpId, UserFacId, userContext, filePath);
    }

    public static string GetMethodName([CallerMemberName] string methodname = "")
    {
        return methodname;
    }
    public static DateTime SearchFromDt(DateTime fromDt) => fromDt.AddHours(8);         // 조회 시작 날짜 Format이 "yyyy-MM-dd" 일 경우만

    public static DateTime SearchToDt(DateTime toDt) => toDt.AddDays(1).AddHours(8);    // 조회 종료 날짜 Format이 "yyyy-MM-dd" 일 경우만
}
