namespace WebApp;

using Framework;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Dynamic;

public class ChecksheetCleanService : MinimalApiService, IMinimalApi, Map.IMap
{

    public ChecksheetCleanService(ILogger<MinimalApiService> logger) : base(logger)
    {
    }


    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/item", nameof(CheckSheetCleanItemList));
        group.MapPost("/iteminsert", nameof(ItemInsert));
        group.MapDelete("/itemdel", nameof(DeleteItem));
        return RouteAllEndpoint(group);
    }

    public static ChecksheetGroupProdList ListAll()
    {
        return new ChecksheetGroupProdList(DataContext.StringEntityList<CheckSheetGroupCleanEntity>("@CheckSheetClean.List", RefineExpando(new ExpandoObject())));
    }

    public static ChecksheetGroupProdList List(string? checksheetGroupCode, string? checksheetGroupName, string? workcenterCode, char? useYn)
    {
        dynamic obj = new ExpandoObject();
        obj.ChecksheetGroupCode = checksheetGroupCode;
        obj.ChecksheetGroupName = checksheetGroupName;
        obj.WorkcenterCode = workcenterCode;
        obj.UseYn = useYn;

        var rtn = new ChecksheetGroupProdList(DataContext.StringEntityList<CheckSheetGroupCleanEntity>("@CheckSheetClean.List", RefineExpando(obj, true)));

        return rtn;
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }

    [ManualMap]
    public static int CountSelect(string ChecksheetGroupCode, string WorkcenterCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ChecksheetGroupCode = ChecksheetGroupCode;
        obj.WorkcenterCode = WorkcenterCode;

        return DataContext.StringValue<int>("@CheckSheetClean.CountSelect", RefineExpando(obj, true));
    }

    [ManualMap]
    public static int CountItemSelect(string ItemCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ItemCode = ItemCode;

        return DataContext.StringValue<int>("@CheckSheetClean.CountItemSelect", RefineExpando(obj, true));
    }

    public static int Insert([FromBody] CheckSheetGroupCleanEntity entity)
    {
        if (CountSelect(entity.ChecksheetGroupCode, entity.WorkcenterCode) > 0)
            return -1;

        RemoveCache();

        return DataContext.StringNonQuery("@CheckSheetClean.Insert", RefineEntity(entity));
    }

    public static int Update([FromBody] CheckSheetGroupCleanEntity entity)
    {
        RemoveCache();

        return DataContext.StringNonQuery("@CheckSheetClean.Update", RefineEntity(entity));
    }

    public static int Delete(string ChecksheetGroupCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ChecksheetGroupCode = ChecksheetGroupCode;

        RemoveCache();

        return DataContext.StringNonQuery("@CheckSheetClean.Delete", RefineExpando(obj));
    }

    [ManualMap]
    public static IResult CheckSheetCleanItemList(string ChecksheetGroupCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ChecksheetGroupCode = ChecksheetGroupCode;

        DataTable dt = DataContext.StringDataSet("@CheckSheetClean.ListItem", RefineExpando(obj, true)).Tables[0];
        return Results.Json(ToDic(dt));
    }

    [ManualMap]
    public static int ItemInsert([FromBody] ChecksheetGroupCleanItemEntity entity)
    {
        if (CountItemSelect(entity.ItemCode) > 0)
            return -1;

        RemoveCache();

        return DataContext.StringNonQuery("@CheckSheetClean.InsertItem", RefineEntity(entity));
    }

    [ManualMap]
    public static int DeleteItem(string checksheetGroupCode, string itemCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ChecksheetGroupCode = checksheetGroupCode;
        obj.ItemCode = itemCode;
        return DataContext.StringNonQuery("@CheckSheetClean.DeleteItem", RefineExpando(obj));
    }

    [ManualMap]
    public static Map GetMap(string? category = null)
    {
        return ListAll()
        .Where(x => string.IsNullOrWhiteSpace(category) || x.ChecksheetGroupCode == category)
        .Select(y => {
            return new MapEntity(y.ChecksheetGroupCode, y.ChecksheetGroupName, string.Empty, 'Y');
        }).ToMap();
    }

    public static void RefreshMap()
    {
        throw new NotImplementedException();
    }
}
