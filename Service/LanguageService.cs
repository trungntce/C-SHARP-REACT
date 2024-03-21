namespace WebApp;

using System;
using System.Data;
using System.Dynamic;

using Framework;
using Microsoft.AspNetCore.Mvc;
using Unity.Interception.Utilities;

public class LanguageService : MinimalApiService, IMinimalApi, Map.IMap
{
    public LanguageService(ILogger<LanguageService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapPut("/set", nameof(InsertSet));
        group.MapGet("/listbynation", nameof(ListByNation));

        return RouteAllEndpoint(group);
    }

    public static LanguageList ListAll()
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;

        return new LanguageList(DataContext.StringEntityList<LanguageEntity>("@Language.List", RefineExpando(obj)));
    }
    
    public static LanguageList List(string? langCode, string? nationcode, string? langText)
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;
        obj.LangCode = langCode;
        obj.NationCode = nationcode;
        obj.LangText = langText;

        return new LanguageList(DataContext.StringEntityList<LanguageEntity>("@Language.List", RefineExpando(obj, true)));
    }

    [ManualMap]
    public static Tuple<List<LanguageEntity>, List<LanguageEntity>, List<LanguageEntity>> ListByNation()
    {
        dynamic obj = new ExpandoObject();

        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        return db.EntityList<dynamic, LanguageEntity, LanguageEntity, LanguageEntity>(CommandType.Text, "@Language.ListByNation", RefineExpando(obj));
    }

    public static LanguageEntity? Select(string langCode, string? nationCode)
    {
        dynamic obj = new ExpandoObject();
        obj.LangCode = langCode;
        obj.NationCode = nationCode;

        return DataContext.StringEntity<LanguageEntity>("@Language.Select", RefineExpando(obj, true));
    }

    public static int Insert([FromBody] LanguageEntity entity)
    {
        if (Select(entity.LangCode, entity.NationCode) != null)
            return -1;

        RemoveCache();

        return DataContext.StringNonQuery("@Language.Insert", RefineEntity(entity));
    }

    [ManualMap]
    public static int InsertSet([FromBody] LanguageSetEntity entity)
    {
        if (Select(entity.LangCode, null) != null)
            return -1;

        RemoveCache();

        int result = 0;

        foreach (var i in 0..(entity.NationCodeList.Count - 1))
        {
            entity.NationCode = entity.NationCodeList[i];
            entity.LangText = entity.LangTextList[i];

            result += DataContext.StringNonQuery("@Language.Insert", RefineEntity(entity));
        }

        return result;
    }

    public static int Update([FromBody] LanguageEntity entity)
    {
        RemoveCache();

        return DataContext.StringNonQuery("@Language.Update", RefineEntity(entity));
    }

    public static int Delete(string langcode, string nationCode)
    {
        dynamic obj = new ExpandoObject();
        obj.LangCode = langcode;
        obj.NationCode = nationCode;

        RemoveCache();

        return DataContext.StringNonQuery("@Language.Delete", RefineExpando(obj));
    }

    public static LanguageList ListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(),
            DateTime.Now.AddMinutes(GetCacheMin()),
            ListAll);

        return list;
    }

    public static LanguageEntity? SelectCache(string langCode, string nationCode)
    {
        return ListAllCache().FirstOrDefault(x => x.LangCode == langCode && x.NationCode == nationCode);
    }

    [ManualMap]
    public static string LangText(string langCode, string nationCode)
    {
        return SelectCache(langCode, nationCode)?.LangText ?? langCode;
    }

    [ManualMap]
    public static string GetLang(string str, string? langCode = null)
    {
        if (string.IsNullOrWhiteSpace(langCode))
            langCode = UserNationCode;

        if (string.IsNullOrWhiteSpace(str))
            return str;

        if (string.IsNullOrWhiteSpace(langCode))
            return str;

        if (!str.Contains("::"))
            return str;

        var list = CodeService.ListCache("LANG_CODE");

        if(!langCode.Contains(','))
        {
            var index = list.FindIndex(x => x.CodeId == langCode);
            if (index < 0)
                return str;

            return UtilEx.SafeSplit(str, "::", index);
        }

        var lanList = langCode.Split(new char[] { ',' }, StringSplitOptions.TrimEntries);

        return lanList.Select(x =>
        {
            var code = list.FirstOrDefault(y => y.CodeId == x);
            if (code == null)
                return null;

            var index = list.IndexOf(code);

            return $"{code.Remark} {UtilEx.SafeSplit(str, "::", index)}";
        }).Where(x => x != null).JoinStrings(", ");
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
        throw new NotImplementedException();
    }
}
