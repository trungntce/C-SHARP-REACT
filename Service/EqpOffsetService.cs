namespace WebApp;

using System.Collections;
using System.Data;
using System.Dynamic;

using Framework;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

public class EqpOffsetService : MinimalApiService, IMinimalApi
{
    public EqpOffsetService(ILogger<EqpOffsetService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("category", nameof(EqpCategoryList));
		group.MapGet("param", nameof(EqpParamList));
		group.MapGet("registparam", nameof(EqpRegistParamList));

        group.MapPost("speedRegistparam", nameof(EqpSpeedRegistParamUpdate));

        group.MapPut("registparam", nameof(EqpRegistParamInsert));
        group.MapDelete("registparam", nameof(EqpRegistParamDelete));

        group.MapPost("barcode", nameof(EqpBarcodeChange));

		return RouteAllEndpoint(group);
    }
    
    public static IEnumerable<IDictionary> List(string? eqpCode, string? barcodeYn)
    {
        dynamic obj = new ExpandoObject();
        obj.EqpCode  = eqpCode;
        obj.BarcodeYn = barcodeYn == "Y"? "Y" : null;

		DataTable dt = DataContext.StringDataSet("@EqpOffset.List", RefineExpando(obj, true)).Tables[0];

        return ToDic(dt);

	}

    public static EqpOffsetEntity Select(string extId)
    {
        dynamic obj = new ExpandoObject();
        obj.ExtId = extId;

		return DataContext.StringEntity<EqpOffsetEntity>("@EqpOffset.Select", RefineExpando(obj, true));
    }

    public static int Insert([FromBody] EqpOffsetEntity entity)
    {
		entity.ExtId = NewShortId();

		if (Select(entity.ExtId) != null)
            return -1;

		RemoveCache();

        return DataContext.StringNonQuery("@EqpOffset.Insert", RefineEntity(entity));
    }

    public static int Update([FromBody] EqpOffsetEntity entity)
    {
        RemoveCache();

		return DataContext.StringNonQuery("@EqpOffset.Update", RefineEntity(entity));
    }

    public static int Delete(string extId)
    {
        dynamic obj = new ExpandoObject();
        obj.ExtId = extId;

		RemoveCache();

        return DataContext.StringNonQuery("@EqpOffset.Delete", RefineExpando(obj, true));
    }

    [ManualMap]
    public static IEnumerable<IDictionary> EqpCategoryList(string? eqpCode)
    {
        dynamic obj = new ExpandoObject();
        obj.EqpCode = eqpCode;

		DataTable dt = DataContext.StringDataSet("@EqpOffset.EqpCategoryList", RefineExpando(obj, true)).Tables[0];

		return ToDic(dt);
	}

	[ManualMap]
	public static IEnumerable<IDictionary> EqpParamList(string? eqpCode)
	{
		dynamic obj = new ExpandoObject();
		obj.EqpCode = eqpCode;

		DataTable dt = DataContext.StringDataSet("@EqpOffset.EqpParamList", RefineExpando(obj, true)).Tables[0];

		return ToDic(dt);
	}

	[ManualMap]
	public static IEnumerable<IDictionary> EqpRegistParamList(string? extId)
	{
		dynamic obj = new ExpandoObject();
		obj.ExtId = extId;

		DataTable dt = DataContext.StringDataSet("@EqpOffset.EqpRegistParamList", RefineExpando(obj, true)).Tables[0];

		return ToDic(dt);
	}

    [ManualMap]
    public static int EqpBarcodeChange(List<Dictionary<string,object>> barcodeData)
    {
        dynamic obj = new ExpandoObject();
		int result = 0;

		DataContext.StringNonQuery("@EqpOffset.ExtDelete", RefineExpando(obj, true));

		foreach (Dictionary<string, object> barcode in barcodeData)
        {
            obj.ExtId = NewShortId();
            obj.EqpCode = barcode.TypeKey<string>("eqpCode", string.Empty);
			obj.barcodeYn = barcode.TypeKey<string>("barcodeYn", string.Empty);

			result += DataContext.StringNonQuery("@EqpOffset.ExtInsert", RefineExpando(obj, true));
        }

		return result;
    }


	public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }

    [ManualMap]
	public static int EqpRegistParamInsert( Dictionary<string, object> param)
	{
        dynamic obj = new ExpandoObject();
        obj.ExtId = param.TypeKey<string>("extId");

        var json = param.TypeKey<string>("param");

		var paramList = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(json);
        int cnt = 0;
		foreach (var regist in paramList)
		{
            obj.MapId = NewShortId();
            obj.ParamId = regist.TypeKey<string>("paramId");

            cnt += DataContext.StringNonQuery("@EqpOffset.EqpRegistParamInsert", RefineExpando(obj, true));
		}

		return cnt;
    }

	[ManualMap]
	public static int EqpRegistParamDelete(string mapIdList)
	{
		dynamic obj = new ExpandoObject();
		obj.MapIdList = mapIdList;

		RemoveCache();

		return DataContext.StringNonQuery("@EqpOffset.EqpRegistParamDelete", RefineExpando(obj, true));
	}

    [ManualMap]
    public static int EqpSpeedRegistParamUpdate([FromBody] ParamEntity entity)
    {
		RemoveCache();

		return DataContext.StringNonQuery("@EqpOffset.SpeedParamUpdate", RefineEntity(entity));

	}

}
