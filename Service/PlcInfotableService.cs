namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Dynamic;
using System.Linq;
using System.Text;
using Framework;
using Microsoft.AspNetCore.Mvc;

public class PlcInfotableService : MinimalApiService, IMinimalApi, Map.IMap
{
    public PlcInfotableService(ILogger<PlcInfotableService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapPost("", nameof(List));

        return RouteAllEndpoint(group);
    }

    [ManualMap]
    public static IResult List(ILogger<PlcInfotableService> logger,
        DateTime fromDt, DateTime toDt, string eqpCode, int pageNo, int pageSize, char? endtimeYn, bool isExcel = false,
        [FromBody] Dictionary<string, string>? dic = null)
    {
        var colDt = ColumnList(eqpCode, null, null);
        var cols = dic?.SafeTypeKey("cols", string.Empty) ?? null;
        if (!string.IsNullOrWhiteSpace(cols))
        {
            var spts = cols.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
            colDt = colDt.Select($"col_name in ({string.Join(',', spts.Select(x => $"'{x}'"))})").CopyToDataTable();
        }

        if (colDt.Rows.Count == 0)
            return Results.Problem($"선택된 컬럼이 없습니다.");
        else if(colDt.Rows.Count > 100)
            return Results.Problem($"컬럼이 100개를 초과합니다. 컬럼을 지정해 조회해 주세요.");

        StringBuilder sb = new();
        foreach (DataRow row in colDt.Rows)
        {
            var colName = row.TypeCol<string>("col_name");

            if (colName.Contains("."))
            {
                var spts = colName.Split('.');

                sb.AppendLine($",\t{ToSelectName(colName)} as [{colName}]");
            }
            else
                sb.AppendLine($",\t[{colName}]");
        }

        var format = DataContext.SqlCache.GetSingleSql("PlcInfotable.RawList");
        var sql = string.Format(format, TableName(eqpCode), sb.ToString());

        dynamic obj = new ExpandoObject();
        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);
        obj.PageNo = pageNo;
        obj.PageSize = pageSize;
        obj.EndtimeYn = endtimeYn;

        DataTable rawDt;
        try
        {
            rawDt = DataContext.StringDataSet(sql, RefineExpando(obj)).Tables[0];
        }
        catch (SqlException ex)
        {
            logger.LogError(ex, "raw쿼리 오류");
            return Results.Problem($"오류가 발생했습니다.<br /> {ex.Message}");
        }

        var rawCount = ListCount(eqpCode, RefineExpando(obj));

        if(!isExcel)
            return Results.Ok(new Tuple<IEnumerable<IDictionary>, IEnumerable<IDictionary>, int>(ToDic(colDt), ToDic(rawDt, ToCamelRaw), rawCount));

        return ExcelDown(colDt, rawDt, $"{eqpCode}_{EqpName(eqpCode)}");
    }

    [ManualMap]
    static public string ToCamelRaw(string s)
    {
        if (string.IsNullOrWhiteSpace(s))
            return s;

        if (s.Contains('.'))
            return s;

        string t = UtilEx.ToPascal(s);
        return $"{char.ToLowerInvariant(t[0])}{t[1..]}";
    }

    [ManualMap]
    static public string ToSelectName(string colName)
    {
        if (string.IsNullOrWhiteSpace(colName))
            return colName;

        if (colName.Contains('.'))
        {
            var spts = colName.Split('.');

            return $"json_value([{spts[0]}],'$.{spts[1]}')";
        }
        else
            return $"[{colName}]";
    }

    [ManualMap]
    public static IResult ExcelDown(DataTable colDt, DataTable rawDt, string fileName)
    {
        /*Dictionary<string, string> colDic = new()
        {
            { "time", "일시" },
            { "count", "생산량" },
            { "starttime", "시작시간" },
            { "prev_endtime", "이전종료시간" },
            { "endtime", "종료시간" },
            { "endtime_diff", "생산시간(초)" },
            { "eqstatus", "장비상태" },
        };*/
        Dictionary<string, string> colDic = new()
         {
             { "inserttime", "일시(서버시간)" }, 
             { "count", "생산량" },
             { "starttime", "시작시간" },
             { "endtime", "종료시간" },
             { "eqstatus", "장비상태" },
         };

        foreach (DataRow row in colDt.Rows)
        {
            colDic.Add(row.TypeCol<string>("col_name"), row.TypeCol<string>("col_desc"));
        }

        return Results.File(ExcelEx.ToExcelSimple(rawDt, colDic), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }

    [ManualMap]
    public static int ListCount(string eqpCode, dynamic obj)
    {
        var format = DataContext.SqlCache.GetSingleSql("PlcInfotable.RawListCount");
        var sql = string.Format(format, TableName(eqpCode));

        return DataContext.StringValue<int>(sql, obj);
    }

    [ManualMap]
    public static DataTable EqpListAll()
    {
        return DataContext.StringDataSet("@PlcInfotable.EqpList", new { }).Tables[0];
    }

    [ManualMap]
    public static DataTable EqpListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(),
            DateTime.Now.AddMinutes(GetCacheMin()),
            EqpListAll);

        return list;
    }

    [ManualMap]
    public static DataRow? EqpSelectCache(string eqpCode)
    {
        return EqpListAllCache().AsEnumerable().FirstOrDefault(x => x.TypeCol<string>("eqp_code") == eqpCode);
    }

    [ManualMap]
    public static string EqpName(string eqpCode)
    {
        return EqpSelectCache(eqpCode)?.TypeCol<string>("eqp_description") ?? eqpCode;
    }

    [ManualMap]
    public static string? TableName(string eqpCode)
    {
        return EqpSelectCache(eqpCode)?.TypeCol<string>("table_name");
    }


    #region Room Combo

    [ManualMap]
    public static DataTable RoomListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey("room_list"),
            DateTime.Now.AddMinutes(GetCacheMin()),
            () => {
                return DataContext.StringDataSet("@PlcInfotable.RoomList", new { }).Tables[0];
            });

        return list;
    }

    [ManualMap]
    public static Map RoomGetMap(string? category = null)
    {
        return RoomListAllCache().AsEnumerable()
        .OrderBy(x => x.TypeCol<string>("room_name"))
        .Select(y =>
        {
            return new MapEntity(
                y.TypeCol<string>("room_name"),
                y.TypeCol<string>("cnt"),
                string.Empty,
                'Y');
        }).ToMap();
    }

    [ManualMap]
    public static void RoomRefreshMap()
    {
        UtilEx.RemoveCache(BuildCacheKey("room_list"));
    }

    #endregion


    #region Eqp Combo

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }

    public static Map GetMap(string? category = null)
    {
        return EqpListAllCache().AsEnumerable()
        .Where(x => string.IsNullOrWhiteSpace(category) || x.TypeCol<string>("room_name") == category)
        .OrderBy(x => x.TypeCol<string>("eqp_code"))
        .Select(y => {
            return new MapEntity(
                y.TypeCol<string>("eqp_code"),
                y.TypeCol<string>("eqp_description"),
                y.TypeCol<string>("room_name"),
                'Y');
        }).ToMap();
    }

    public static void RefreshMap()
    {
        RemoveCache();
    }

    #endregion


    #region Table Combo

    [ManualMap]
    public static Map TableGetMap(string? category = null)
    {
        return EqpListAllCache().AsEnumerable()
        .Where(x => string.IsNullOrWhiteSpace(category) || x.TypeCol<string>("room_name") == category)
        .OrderBy(x => x.TypeCol<string>("eqp_code"))
        .Select(y => {
            return new MapEntity(
                y.TypeCol<string>("table_name"),
                $"[{y.TypeCol<string>("eqp_code")}] {y.TypeCol<string>("eqp_description")}",
                y.TypeCol<string>("room_name"),
                'Y');
        }).ToMap();
    }

    #endregion


    #region Column Combo

    [ManualMap]
    public static DataTable ColumnList(string? eqpCode, string? tableName, char? pick)
    {
        dynamic obj = new ExpandoObject();
        obj.EqpCode = eqpCode;
        obj.TableName = tableName;
        obj.Pick = pick;

        return DataContext.StringDataSet("@PlcInfotable.ColumnList", RefineExpando(obj)).Tables[0];
    }

    [ManualMap]
    public static Map ColumnGetMap(string? category = null)
    {
        if (category == null)
            return new(new());

        return ColumnList(category, null, null).AsEnumerable()
        .OrderBy(x => x.TypeCol<int>("col_index"))
        .Select(y =>
        {
            return new MapEntity(
                y.TypeCol<string>("col_name"),
                y.TypeCol<string>("col_desc"),
                y.TypeCol<string>("table_name"),
                'Y');
        }).ToMap();
    }

    [ManualMap]
    public static void ColumnRefreshMap()
    {
        UtilEx.RemoveCache(BuildCacheKey("column_list"));
    }

    #endregion


    #region Column Combo by Table

    [ManualMap]
    public static Map ColumnGetMapByTable(string? category = null)
    {
        if (category == null)
            return new(new());

        return ColumnList(null, category, null).AsEnumerable()
        .OrderBy(x => x.TypeCol<int>("col_index"))
        .Select(y =>
        {
            return new MapEntity(
                y.TypeCol<string>("col_name"),
                y.TypeCol<string>("col_desc"),
                y.TypeCol<string>("table_name"),
                'Y');
        }).ToMap();
    }

    [ManualMap]
    public static Map ColumnGetMapByTableNoJson(string? category = null)
    {
        if (category == null)
            return new(new());

        return ColumnList(null, category, null).AsEnumerable()
        .Where(x => !x.TypeCol<string>("col_name").Contains('.'))
        .OrderBy(x => x.TypeCol<int>("col_index"))
        .Select(y =>
        {
            return new MapEntity(
                y.TypeCol<string>("col_name"),
                y.TypeCol<string>("col_desc"),
                y.TypeCol<string>("table_name"),
                'Y');
        }).ToMap();
    }

    #endregion
}
