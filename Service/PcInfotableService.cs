namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Data.SqlClient;
using System.Dynamic;
using System.Linq;
using System.Text;
using Framework;

public class PcInfotableService : MinimalApiService, IMinimalApi, Map.IMap
{
    public PcInfotableService(ILogger<PcInfotableService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }

    public static IResult List(ILogger<PcInfotableService> logger,
        DateTime fromDt, DateTime toDt, string eqpTableCode, int pageNo, int pageSize, char? endtimeYn, string? cols, bool isExcel = false)
    {
        if (string.IsNullOrWhiteSpace(eqpTableCode) || !eqpTableCode.Contains(':'))
            return Results.Empty;

        var eqpTable = eqpTableCode.Split(':', StringSplitOptions.TrimEntries);
        string eqpCode = eqpTable[0];
        string tableName = eqpTable[1];

        var colDt = ColumnList(tableName, eqpCode, null);
        if (!string.IsNullOrWhiteSpace(cols))
        {
            var spts = cols.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
            colDt = colDt.Select($"col_name in ({string.Join(',', spts.Select(x => $"'{x}'"))})").CopyToDataTable();
        }

        StringBuilder sb = new();
        foreach (DataRow row in colDt.Rows)
            sb.AppendLine($",\t[{row.TypeCol<string>("col_name")}]");

        var format = DataContext.SqlCache.GetSingleSql("PcInfotable.RawList");
        var sql = string.Format(format, tableName, sb.ToString());

        dynamic obj = new ExpandoObject();
        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);
        obj.PageNo = pageNo;
        obj.PageSize = pageSize;
        obj.EqpCode = eqpCode;
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

        var rawCount = ListCount(tableName, RefineExpando(obj));

        if (!isExcel)
            return Results.Ok(new Tuple<IEnumerable<IDictionary>, IEnumerable<IDictionary>, int>(ToDic(colDt), ToDic(rawDt, (s) => s), rawCount));

        return ExcelDown(colDt, rawDt, $"{eqpCode}_{EqpName(eqpCode)}");
    }

    [ManualMap]
    public static IResult ExcelDown(DataTable colDt, DataTable rawDt, string fileName)
    {
        Dictionary<string, string> colDic = new()
        {
            { "dasinserttime", "일시" },
        };

        foreach (DataRow row in colDt.Rows)
        {
            colDic.Add(row.TypeCol<string>("col_name"), row.TypeCol<string>("col_desc"));
        }

        return Results.File(ExcelEx.ToExcelSimple(rawDt, colDic), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }

    [ManualMap]
    public static int ListCount(string tableName, dynamic obj)
    {
        var format = DataContext.SqlCache.GetSingleSql("PcInfotable.RawListCount");
        var sql = string.Format(format, tableName);

        return DataContext.StringValue<int>(sql, obj);
    }

    [ManualMap]
    public static DataTable EqpList(string? roomName)
    {
        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        DataSet ds = db.ExecuteStringDataSet("@PcInfotable.EqpList", new { roomName = roomName });
        if(ds.Tables.Count <= 0)
            return new DataTable();

        return ds.Tables[0];
    }

    [ManualMap]
    public static DataTable EqpListAll()
    {
        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        return db.ExecuteStringDataSet("@PcInfotable.EqpList", new { room_name = DBNull.Value }).Tables[0];
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
    public static string TableName(string eqpCode)
    {
        return EqpSelectCache(eqpCode)?.TypeCol<string>("eqp_description") ?? eqpCode;
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }

    #region Room Combo

    [ManualMap]
    public static DataTable RoomListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey("room_list"),
            DateTime.Now.AddMinutes(GetCacheMin()),
            () => {
                return DataContext.StringDataSet("@PcInfotable.RoomList", new { }).Tables[0];
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

    [ManualMap]
    public static Map EqpGetMap(string? category = null)
    {
        return EqpList(category).AsEnumerable()
        .Select(y => {
            return new MapEntity(
                $"{y.TypeCol<string>("eqp_code")}:{y.TypeCol<string>("table_name")}",
                $"{y.TypeCol<string>("eqp_description")}",
                y.TypeCol<string>("table_name"),
                'Y');
        }).ToMap();
    }

	[ManualMap]
	public static Map EqppcGetMap(string? category = null)
	{
		return EqpList(category).AsEnumerable()
		.Select(y => {
			return new MapEntity(
				$"{y.TypeCol<string>("eqp_code")}",
				$"{y.TypeCol<string>("eqp_description")}",
				y.TypeCol<string>("table_name"),
				'Y');
		}).ToMap();
	}

	[ManualMap]
    public static void EqpRefreshMap()
    {
        //
    }

    #endregion


    #region Table Combo

    public static Map GetMap(string? category = null)
    {
        return EqpListAllCache().AsEnumerable()
        .OrderBy(x => x.TypeCol<string>("eqp_code"))
        .Select(y => {
            return new MapEntity(
                y.TypeCol<string>("table_name"),
                $"[{y.TypeCol<string>("eqp_code")}] {y.TypeCol<string>("eqp_description")}",
                y.TypeCol<string>("eqp_code"),
                'Y');
        }).ToMap();
    }

    public static void RefreshMap()
    {
        RemoveCache();
    }

    #endregion


    #region Column Combo by Table

    [ManualMap]
    public static DataTable ColumnList(string? tableName, string? eqpCode, char? pick)
    {
        dynamic obj = new ExpandoObject();
        obj.EqpCode = eqpCode;
        obj.TableName = tableName;
        obj.Pick = pick;

        return DataContext.StringDataSet("@PcInfotable.ColumnList", RefineExpando(obj)).Tables[0];
    }

    [ManualMap]
    public static void ColumnRefreshMap()
    {
        UtilEx.RemoveCache(BuildCacheKey("column_list"));
    }

    [ManualMap]
    public static Map ColumnGetMapByTable(string? category = null)
    {
        if (category == null)
            return new(new());

        string? tableName = null;
        string? eqpCode = null;
        if(category.IndexOf(':') > 0)
        {
            var spts = category.Split(':');
            tableName = spts[1];
            eqpCode = spts[0];
        }
        else
            tableName = category;

        return ColumnList(tableName, eqpCode, null).AsEnumerable()
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
