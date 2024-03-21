namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Dynamic;
using System.Linq;
using System.Text;

using Framework;
using Google.Protobuf.WellKnownTypes;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Text;
using Org.BouncyCastle.Asn1.X500;
using static System.Net.Mime.MediaTypeNames;

public class ENIGService : MinimalApiService, IMinimalApi, Map.IMap
{
    public ENIGService(ILogger<ENIGService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        /*group.MapPost("/exportexcel", nameof(ExportExcel));*/
        group.MapGet("/exportexcel", nameof(ExportExcel2));
        group.MapGet("/getlist", nameof(GetList));
        group.MapGet("/getngcountlist", nameof(GetNgCountList));
        group.MapPost("/getnglist", nameof(GetNgList));
        group.MapPost("/ttt", nameof(Test));

        return RouteAllEndpoint(group);
    }

    [ManualMap]
    public static DataTable GetTable()
    {
        DataTable dt = new DataTable();
        dt.Columns.Add("line_no", typeof(string));
        dt.Columns.Add("eqp_name", typeof(string));
        dt.Columns.Add("voltage_col", typeof(string));
        dt.Columns.Add("voltage_table", typeof(string));
        dt.Columns.Add("current_col", typeof(string));
        dt.Columns.Add("current_table", typeof(string));

        dt.Rows.Add("ENIG_A_tank", "ENIG Ni A Tank", "d001", "raw_surface_11016", "d002", "raw_surface_11016");
        dt.Rows.Add("ENIG_B_tank", "ENIG Ni B Tank", "d003", "raw_surface_11016", "d004", "raw_surface_11016");

        return dt;
    }

    /*[ManualMap]
    public static IResult ExportExcel([FromBody] IDictionary datalist)
    {
        DataTable dt = new DataTable();
        string rawJson = datalist.TypeKey<string>("datalist");
        var rawList = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(rawJson);

        foreach (var item in rawList)
        {
            List<DataRow> search = GetTable().AsEnumerable().Where(x => x.TypeCol<string>("line_no").Equals(item.TypeKey<string>("eqpCode"))).ToList();
            var format = DataContext.SqlCache.GetSingleSql("ENIG.GetList");

            string sql = string.Format(format
                , search[0].TypeCol<string>("voltage_col")
                , search[0].TypeCol<string>("voltage_table")
                , search[0].TypeCol<string>("current_col")
                , search[0].TypeCol<string>("current_table"));

            dynamic obj = new ExpandoObject();
            obj.FromDt = item.TypeKey<int>("fromDt");
            obj.ToDt = item.TypeKey<string>("lastDt");
            obj.EqpName = search[0].TypeCol<string>("eqp_name");
 
            var db = DataContext.Create(null);
            db.IgnoreParameterSame = true;

            dt.Merge(db.ExecuteStringDataSet(sql, obj).Tables[0]);
        }

        List<Tuple<string, string, double, System.Type, Func<DataRow, object>?>> mapList = new() 
        { 
            new("eqp_name", "설비명", 25, typeof(string),null),
            new("converttime", "Voltage_일시", 25, typeof(string),null),
            new("value", "Voltage_값", 25, typeof(double),null),
            new("converttime1", "Current_일시", 25, typeof(string),null),
            new("value1", "Current_값", 25, typeof(double),null),
        };

        using var excel = ExcelEx.ToExcel(dt, mapList);

        return Results.File(excel.GetAsByteArray(), "application/force-download", $"test-{DateTime.Now:yyyyMMdd}.xlsx");
    }*/

    [ManualMap]
    public static IResult ExportExcel2(string eqpCode, DateTime fromDt, DateTime toDt)
    {
        List<DataRow> search = GetTable().AsEnumerable().Where(x => x.TypeCol<string>("line_no").Equals(eqpCode)).ToList();
        var format = DataContext.SqlCache.GetSingleSql("ENIG.ExcelData");

        string sql = string.Format(format
               , search[0].TypeCol<string>("voltage_col")
               , search[0].TypeCol<string>("voltage_table")
               , search[0].TypeCol<string>("current_col")
               , search[0].TypeCol<string>("current_table"));

        dynamic obj = new ExpandoObject();

        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);
        obj.EqpName = search[0].TypeCol<string>("eqp_name");

        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        var dt = db.ExecuteStringDataSet(sql, obj).Tables[0];

        List<Tuple<string, string, double, System.Type, Func<DataRow, object>?>> mapList = new()
        {
            new("eqp_name", "설비명", 25, typeof(string),null),
            new("converttime", "Voltage_일시", 25, typeof(string),null),
            new("value", "Voltage_값", 25, typeof(double),null),
            new("converttime1", "Current_일시", 25, typeof(string),null),
            new("value1", "Current_값", 25, typeof(double),null),
        };

        using var excel = ExcelEx.ToExcel(dt, mapList);

        return Results.File(excel.GetAsByteArray(), "application/force-download", $"test-{DateTime.Now:yyyyMMdd}.xlsx");
    }

    [ManualMap]
    public static IEnumerable<IDictionary> GetList(int fromDt,string eqpCode)
    {
        List<DataRow> search = GetTable().AsEnumerable().Where(x => x.TypeCol<string>("line_no").Equals(eqpCode)).ToList();
        var format = DataContext.SqlCache.GetSingleSql("ENIG.GetList");

        string sql = string.Format(format
        , search[0].TypeCol<string>("voltage_col")
        , search[0].TypeCol<string>("voltage_table")
        , search[0].TypeCol<string>("current_col")
        , search[0].TypeCol<string>("current_table"));

        dynamic obj = new ExpandoObject();
        obj.FromDt = fromDt;
        obj.ToDt = "1";
        obj.EqpName = search[0].TypeCol<string>("eqp_name");

        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        DataTable dt = db.ExecuteStringDataSet(sql, RefineExpando(obj,true)).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> GetNgCountList(int fromDt, string eqpCode)
    {
        List<DataRow> search = GetTable().AsEnumerable().Where(x => x.TypeCol<string>("line_no").Equals(eqpCode)).ToList();

        var _sql = DataContext.SqlCache.GetSingleSql("ENIG.GetNgCountList");
        string sql = string.Format(_sql, search[0].TypeCol<string>("voltage_col")
            , search[0].TypeCol<string>("voltage_table")
            , search[0].TypeCol<string>("current_col")
            , search[0].TypeCol<string>("current_table"));

        dynamic obj = new ExpandoObject();
        obj.EqpName = search[0].TypeCol<string>("eqp_name");

        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        DataTable dt = db.ExecuteStringDataSet(sql, RefineExpando(obj)).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> GetNgList([FromBody] IDictionary dic)
    {
        string rawJson = dic.TypeKey<string>("list");
        DataTable dt = new DataTable();

        var rawList = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(rawJson);

        foreach (var item in rawList)
        {

            List<DataRow> search = GetTable().AsEnumerable().Where(x => x.TypeCol<string>("line_no").Equals(item.TypeKey<string>("eqpCode"))).ToList();

            var format = DataContext.SqlCache.GetSingleSql("ENIG.GetNgList");
            string sql = string.Format(format, search[0].TypeCol<string>("voltage_col")
            , search[0].TypeCol<string>("voltage_table")
            , search[0].TypeCol<string>("current_col")
            , search[0].TypeCol<string>("current_table"));

            dynamic obj = new ExpandoObject();
            obj.FromDt = item.TypeKey<int>("fromDt");
            obj.EqpName = search[0].TypeCol<string>("eqp_name");

            var db = DataContext.Create(null);
            db.IgnoreParameterSame = true;

            dt.Merge(db.ExecuteStringDataSet(sql, RefineExpando(obj)).Tables[0]);
        }

        var distinctRows = dt.AsEnumerable()
            .GroupBy(g => new { eqcode = g?.TypeCol<string>("eqcode"), min_dt = g?.TypeCol<DateTime>("min_dt"), max_dt = g?.TypeCol<DateTime>("max_dt") })
            .Select(g => g.First());

        return ToDic(distinctRows.CopyToDataTable());
    }

    [ManualMap]
    public static int Test([FromBody] IDictionary dic)
    {
        string rawJson = dic.TypeKey<string>("rawJson");

        int result = 0;

        var rawlist = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(rawJson);

        foreach (Dictionary<string, string> item in rawlist)
        {
            dynamic obj = new ExpandoObject();
            obj.Eqcode = item.TypeKey<string>("eqcode");
            obj.MaxDt = item.TypeKey<DateTime>("maxDt");
            obj.MinDt = item.TypeKey<DateTime>("minDt");
            obj.Remark = String.IsNullOrEmpty(item.TypeKey<string?>("remark")) ? "" : item.TypeKey<string?>("remark");

            result += DataContext.StringNonQuery("@ENIG.ActionInsert", RefineExpando(obj));
        }
        return result;
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }

    public static Map GetMap(string? category = null)
    {
        return GetTable().AsEnumerable()
       .OrderBy(x => x.TypeCol<string>("line_no"))
       .Select(y =>
       {
           return new MapEntity(
               y.TypeCol<string>("line_no"),
               y.TypeCol<string>("eqp_name"),
               string.Empty,
               'Y');
       }).ToMap();
    }

    public static void RefreshMap()
    {
        throw new NotImplementedException();
    }
}
