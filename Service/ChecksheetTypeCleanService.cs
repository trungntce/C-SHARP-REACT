namespace WebApp;

using Framework;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Dynamic;
public class ChecksheetTypeCleanService : MinimalApiService, IMinimalApi, Map.IMap
{
    public ChecksheetTypeCleanService(ILogger<MinimalApiService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/item", nameof(CksItemProdList));
        group.MapDelete("/itemdel", nameof(DeleteItem));
        group.MapPost("/iteminsert", nameof(ItemInsert));
        return RouteAllEndpoint(group);
    }

    public static CheckSheetList ListAll()
    {
        return new CheckSheetList(DataContext.StringEntityList<CheckSheetEntity>("@CheckSheetTypeClean.List", RefineExpando(new ExpandoObject())));
    }

    public static CheckSheetList List(string? checksheetGroupCode, string? checksheetCode, string? workcenterCode, char? useYn)
    {
        dynamic obj = new ExpandoObject();
        obj.ChecksheetGroupCode = checksheetGroupCode;
        obj.ChecksheetCode = checksheetCode;
        obj.WorkcenterCode = workcenterCode;
        obj.UseYn = useYn;

        var rtn = new CheckSheetList(DataContext.StringEntityList<CheckSheetEntity>("@CheckSheetTypeClean.List", RefineExpando(obj, true)));

        return rtn;
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }


    [ManualMap]
    public static int CountSelect(string ChecksheetCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ChecksheetCode = ChecksheetCode;

        return DataContext.StringValue<int>("@CheckSheetTypeClean.CountSelect", RefineExpando(obj, true));
    }

    public static int Insert([FromBody] CheckSheetEntity entity)
    {
        if (CountSelect(entity.ChecksheetGroupCode) > 0)
            return -1;

        RemoveCache();

        return DataContext.StringNonQuery("@CheckSheetTypeClean.Insert", RefineEntity(entity));
    }

    public static int Update([FromBody] CheckSheetEntity entity)
    {
        RemoveCache();

        return DataContext.StringNonQuery("@CheckSheetTypeClean.Update", RefineEntity(entity));
    }

    public static int Delete(string ChecksheetCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ChecksheetCode = ChecksheetCode;

        RemoveCache();

        return DataContext.StringNonQuery("@CheckSheetTypeClean.Delete", RefineExpando(obj));
    }

    [ManualMap]
    public static int ItemInsert([FromBody] ChecksheetItemCleanEntity entity)
    {
        return DataContext.StringNonQuery("@CheckSheetTypeClean.InsertItem", RefineEntity(entity));
    }

    [ManualMap]
    public static IResult CksItemProdList(string ChecksheetCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ChecksheetCode = ChecksheetCode;

        DataTable dt = DataContext.StringDataSet("@CheckSheetTypeClean.ListItem", RefineExpando(obj, true)).Tables[0];
        return Results.Json(ToDic(dt));
    }

    [ManualMap]
    public static int DeleteItem(string checksheetCode, string itemCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ItemCode = itemCode;
        obj.ChecksheetCode = checksheetCode;
        return DataContext.StringNonQuery("@CheckSheetTypeClean.DeleteItem", RefineExpando(obj, true));
    }

    public static Map GetMap(string? category = null)
    {
        throw new NotImplementedException();
    }

    public static void RefreshMap()
    {
        throw new NotImplementedException();
    }
}

