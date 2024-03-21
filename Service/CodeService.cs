namespace WebApp;

using System;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Mvc;

public class CodeService : MinimalApiService, IMinimalApi, Map.IMap
{
    public CodeService(ILogger<CodeService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }
    
    public static CodeList ListAll()
    {
		return new CodeList(DataContext.StringEntityList<CodeEntity>("@Code.List", RefineExpando(new ExpandoObject())));
    }
    
    public static CodeList List(string? codegroupId, string? codeId, string? codeName, string? remark, char? useYn)
    {
        dynamic obj = new ExpandoObject();
        obj.CodegroupId = codegroupId;
        obj.CodeId = codeId;
        obj.CodeName = codeName;
        obj.Remark = remark;
        obj.UseYn = useYn;

        var rtn = new CodeList(DataContext.StringEntityList<CodeEntity>("@Code.List", RefineExpando(obj, true)));
        rtn.ForEach(x => x.CodegroupName = CodegroupService.SelectCacheName(x.CodegroupId));

        return rtn;
    }

    public static CodeEntity? Select(string codegroupId, string codeId)
    {
        dynamic obj = new ExpandoObject();
        obj.CodegroupId = codegroupId;
        obj.CodeId = codeId;

        return DataContext.StringEntity<CodeEntity>("@Code.Select", RefineExpando(obj, true));
    }

    public static CodeEntity? SelectCache(string codegroupId, string codeId)
    {
        return ListAllCache().FirstOrDefault(x => x.CodegroupId == codegroupId && x.CodeId == codeId);
    }

    [ManualMap]
    public static string CodeName(string codegroupId, string codeId)
    {
        var codeName = SelectCache(codegroupId, codeId)?.CodeName ?? codeId;
        if (string.IsNullOrWhiteSpace(codeName))
            return codeId;

        if (codeName.StartsWith('@'))
            return LanguageService.LangText(codeName, UserNationCode);

        if(codeName.Contains("::"))
            return LanguageService.GetLang(codeName, UserNationCode);

        return codeName;
    }

    public static int Insert([FromBody] CodeEntity entity)
    {
        if (Select(entity.CodegroupId, entity.CodeId) != null)
            return -1;

        RemoveCache();
        RemoveCache(entity.CodegroupId);

        return DataContext.StringNonQuery("@Code.Insert", RefineEntity(entity));
    }

    public static int Update([FromBody] CodeEntity entity)
    {
        RemoveCache();
        RemoveCache(entity.CodegroupId);

        return DataContext.StringNonQuery("@Code.Update", RefineEntity(entity));
    }

    public static int Delete(string codeGroupId, string codeId)
    {
        dynamic obj = new ExpandoObject();
        obj.CodegroupId = codeGroupId;
        obj.CodeId = codeId;

		RemoveCache();
        RemoveCache(codeGroupId);

        return DataContext.StringNonQuery("@Code.Delete", RefineExpando(obj));
    }

    public static CodeList ListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(),
            DateTime.Now.AddMinutes(GetCacheMin()),
            ListAll);

        return list;
    }

    public static CodeList ListCache(string codegroupId)
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(codegroupId),
            DateTime.Now.AddMinutes(GetCacheMin()),
            () => { return ListAll().Where(x => x.CodegroupId == codegroupId).ToList(); });

        return new(list);
    }

    [ManualMap]
    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }

    public static void RemoveCache(string codegroupId)
    {
        UtilEx.RemoveCache(BuildCacheKey(codegroupId));
    }

    public static Map GetMap(string? category = null)
    {
        return ListAllCache()
        .Where(x => string.IsNullOrWhiteSpace(category) || x.CodegroupId == category)
        .OrderBy(x => x.Sort)
        .Select(y => {
            return new MapEntity(y.CodeId, y.CodeName, y.CodegroupId, y.UseYn);
        }).ToMap();
    }

    public static void RefreshMap()
    {
        RemoveCache();
    }
}
