namespace WebApp;

using Framework;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Dynamic;

public class ChecksheetEqpService : MinimalApiService, IMinimalApi, Map.IMap
{

    public ChecksheetEqpService(ILogger<MinimalApiService> logger) : base(logger)
    {
    }


    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/item", nameof(CheckSheetEqpItemList));
        group.MapPost("/iteminsert", nameof(ItemInsert));
        group.MapDelete("/itemdel", nameof(DeleteItem));
        return RouteAllEndpoint(group);
    }

    public static ChecksheetGroupEqpList ListAll()
    {
        return new ChecksheetGroupEqpList(DataContext.StringEntityList<CheckSheetGroupEqpEntity>("@CheckSheetEqp.List", RefineExpando(new ExpandoObject())));
    }

    public static ChecksheetGroupEqpList List(string groupType, string? checksheetGroupCode, string? checksheetGroupName, string? workcenterCode, char? useYn, string? eqpCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ChecksheetGroupCode = checksheetGroupCode;
        obj.ChecksheetGroupName = checksheetGroupName;
        obj.WorkcenterCode = workcenterCode;
        obj.UseYn = useYn;
        obj.GroupType = groupType;
        obj.EqpCode = eqpCode;

        var rtn = new ChecksheetGroupEqpList(DataContext.StringEntityList<CheckSheetGroupEqpEntity>("@CheckSheetEqp.List", RefineExpando(obj, true)));
        return rtn;
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }

    [ManualMap]
    public static int CountSelect(string ChecksheetGroupCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ChecksheetGroupCode = ChecksheetGroupCode;

        return DataContext.StringValue<int>("@CheckSheetEqp.CountSelect", RefineExpando(obj, true));
    }

    [ManualMap]
    public static int CountItemSelect(string EquipmentCode)
    {
        dynamic obj = new ExpandoObject();
        obj.EquipmentCode = EquipmentCode;

        return DataContext.StringValue<int>("@CheckSheetEqp.CountItemSelect", RefineExpando(obj, true));
    }

    public static int Insert([FromBody] CheckSheetGroupEqpEntity entity)
    {
        if (CountSelect(entity.ChecksheetGroupCode) > 0)
            return -1;

        RemoveCache();

        return DataContext.StringNonQuery("@CheckSheetEqp.Insert", RefineEntity(entity));
    }

    public static int Update([FromBody] CheckSheetGroupEqpEntity entity)
    {
        RemoveCache();

        return DataContext.StringNonQuery("@CheckSheetEqp.Update", RefineEntity(entity));
    }

    public static int Delete(string ChecksheetGroupCode, string groupType)
    {
        dynamic obj = new ExpandoObject();
        obj.ChecksheetGroupCode = ChecksheetGroupCode;
        obj.GroupType = groupType;

        RemoveCache();

        return DataContext.StringNonQuery("@CheckSheetEqp.Delete", RefineExpando(obj));
    }

    [ManualMap]
    public static IResult CheckSheetEqpItemList(string ChecksheetGroupCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ChecksheetGroupCode = ChecksheetGroupCode;

        DataTable dt = DataContext.StringDataSet("@CheckSheetEqp.ListItem", RefineExpando(obj, true)).Tables[0];
        return Results.Json(ToDic(dt));
    }

    [ManualMap]
    public static int ItemInsert([FromBody] CheckSheetGroupEqpItemEntity entity)
    {

        return DataContext.StringNonQuery("@CheckSheetEqp.InsertItem", RefineEntity(entity));
    }
    [ManualMap]
    public static int DeleteItem(string checksheetGroupCode, string eqpCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ChecksheetGroupCode = checksheetGroupCode;
        obj.EqpCode = eqpCode;

        RemoveCache();

        return DataContext.StringNonQuery("@CheckSheetEqp.DeleteItem", RefineExpando(obj, false));
    }

    [ManualMap]
    public static Map EmtGetMap(string? checksheetGroupCode = null)
    {
        return List("EMT", null, null, null, 'Y', null)
        .Where(x => string.IsNullOrWhiteSpace(checksheetGroupCode) || x.ChecksheetGroupCode == checksheetGroupCode)
        .Select(y => {
            return new MapEntity(y.ChecksheetGroupCode, y.ChecksheetGroupName, string.Empty, 'Y');
        }).ToMap();
    }
    [ManualMap]
    public static Map PmGetMap(string? checksheetGroupCode = null)
    {
        return List("PM", null, null, null, 'Y', null)
        .Where(x => string.IsNullOrWhiteSpace(checksheetGroupCode) || x.ChecksheetGroupCode == checksheetGroupCode)
        .Select(y => {
            return new MapEntity(y.ChecksheetGroupCode, y.ChecksheetGroupName, string.Empty, 'Y');
        }).ToMap();
    }
    [ManualMap]
    public static Map ProdGetMap(string? checksheetGroupCode = null)
    {
        return List("PROD", null, null, null, 'Y', null)
        .Where(x => string.IsNullOrWhiteSpace(checksheetGroupCode) || x.ChecksheetGroupCode == checksheetGroupCode)
        .Select(y => {
            return new MapEntity(y.ChecksheetGroupCode, y.ChecksheetGroupName, string.Empty, 'Y');
        }).ToMap();
    }

    public static void RefreshMap()
    {
        throw new NotImplementedException();
    }

    public static Map GetMap(string? category = null)
    {
        throw new NotImplementedException();
    }
}
