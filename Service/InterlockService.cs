namespace WebApp;

using System;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using YamlDotNet.Core;

public class InterlockService : MinimalApiService, IMinimalApi, Map.IMap
{
    public InterlockService(ILogger<InterlockService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("monitering", nameof(MoniteringList));
        group.MapPut("onoff", nameof(OnOffUpsert));

        return RouteAllEndpoint(group);
    }
    
    public static InterlockList ListAll()
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;
        var abcd = new InterlockList(DataContext.StringEntityList<InterlockEntity>("@Interlock.List", RefineExpando(obj)));
        return abcd;
    }
    
    public static InterlockList List(string? interlockCode, string? interlockName, string? interlockType)
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;
        obj.InterlockCode = interlockCode;
        obj.InterlockName = interlockName;
        obj.interlockType = interlockType;

        return new InterlockList(DataContext.StringEntityList<InterlockEntity>("@Interlock.List", RefineExpando(obj, true)));
    }

    public static InterlockEntity? Select(string interlockCode)
    {
        dynamic obj = new ExpandoObject();
        obj.InterlockCode = interlockCode;

        return DataContext.StringEntity<InterlockEntity>("@Interlock.Select", RefineExpando(obj, true));
    }

    //public static InterlockEntity? SelectCache(string corpId, string facId)
    //{
    //    return ListAllCache().FirstOrDefault(x => x.CorpId == corpId && x.FacId== facId);
    //}

    //[ManualMap]
    //public static string CodeName(string codegroupId, string codeId)
    //{
    //    return SelectCache(codegroupId, codeId)?.CodeName ?? codeId;
    //}

    public static int Insert([FromBody] InterlockEntity entity)
    {
        if (Select(entity.InterlockCode) != null)
            return -1;
        RemoveCache();
        dynamic obj = new ExpandoObject();

        obj.interlockCode = entity.InterlockCode;
        obj.interlockName = entity.InterlockName;
        obj.interlockType = entity.InterlockType;
        obj.remark = entity.Remark;
        obj.use_yn = entity.UseYn;
        obj.create_user = entity.CreateUser;
        return DataContext.StringNonQuery("@Interlock.Insert", RefineExpando(obj,true));
    }

    public static int Update([FromBody] InterlockEntity entity)
    {
        RemoveCache();
        dynamic obj = new ExpandoObject();
        obj.interlockCode = entity.InterlockCode;
        obj.interlockName = entity.InterlockName;
        obj.interlockType = entity.InterlockType;
        obj.remark = entity.Remark;
        obj.use_yn = entity.UseYn;
        obj.updateUser = entity.CreateUser;
        return DataContext.StringNonQuery("@Interlock.Update", RefineExpando(obj,true));
    }

    public static int Delete(string interlockCode)
    {
        dynamic obj = new ExpandoObject();
        obj.InterlockCode = interlockCode;

		RemoveCache();

        return DataContext.StringNonQuery("@Interlock.Delete", RefineExpando(obj));
    }

    [ManualMap]
	public static List<DataTable> MoniteringList()
	{
		dynamic obj = new ExpandoObject();

        DataTable dt1  = DataContext.StringDataSet("@Interlock.MoniteringList").Tables[0];
		DataTable dt2 = DataContext.StringDataSet("@Interlock.MoniteringList").Tables[1];
		DataTable dt3 = DataContext.StringDataSet("@Interlock.MoniteringList").Tables[2];

        List< DataTable > lstData = new List< DataTable >();
        lstData.Add(dt1);
		lstData.Add(dt2);
		lstData.Add(dt3);

		return lstData;
	}

    [ManualMap]
    public static int OnOffUpsert([FromBody] Dictionary<string, object?> dic)
    {
        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        var param = dic.ToCleanDic().ToDictionary(x => x.Key, y => y.Value!);

        char interlockYn = param.TypeKey<char>("interlockYn");

        if(interlockYn == 'Y')
            return db.ExecuteStringNonQuery("@Interlock.OnInsert", RefineParam(param));
        else
            return db.ExecuteStringNonQuery("@Interlock.OffUpdate",RefineParam(param));
    }

    public static InterlockList ListAllCache()
    {
        var list = UtilEx.FromCache(
           BuildCacheKey(UserCorpId, UserFacId),
           DateTime.Now.AddMinutes(GetCacheMin()),
           ListAll);

        return list;
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }

    public static Map GetMap(string? category = null)
    {
        return ListAllCache()
            .Where(x => category == null || x.InterlockCode == category)
            .Select(y => {
                return new MapEntity(y.InterlockCode, y.InterlockName, null, 'Y');
            }).ToMap();
    }

    public static void RefreshMap()
    {
        RemoveCache();
    }
}
