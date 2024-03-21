namespace WebApp;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Text;
using Org.BouncyCastle.Asn1.X500;

public class DiWaterService : MinimalApiService, IMinimalApi, Map.IMap
{
    public DiWaterService(ILogger<DiWaterService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        /*group.MapPost("/exportexcel", nameof(ExportExcel));*/
        group.MapPost("/downlist", nameof(DownListInsert)); 
        group.MapGet("/takeactionlist", nameof(TakeActionList));    

        group.MapGet("/getlist", nameof(Test));                  //DiWater 통합 모니터링
        group.MapGet("/getngcountlist", nameof(Test2));    //DiWater 통합 모니터링
        group.MapPost("/getnglist", nameof(GetNgList));             //DiWater 통합 모니터링
        group.MapGet("/exportexcel", nameof(ExportExcel));         //DiWater 통합 모니터링
        group.MapPost("/takeaction", nameof(TakeAction));           //DiWater 통합 모니터링
        group.MapPost("/addeqp", nameof(AddEqp));                   //DiWater 통합 모니터링

        return RouteAllEndpoint(group);
    }
    
    public static DiWaterList ListAll()
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;

		return new DiWaterList(DataContext.StringEntityList<DiWaterEntity>("@DiWater.List", RefineExpando(obj)));
    }

    public static List<DataTable> List(DateTime? startDt, DateTime? endDt)
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;
        obj.StartDt = startDt;
        obj.EndDt = endDt;
        var list = new List<DataTable>();
        foreach(var i in DataContext.StringDataSet("@DiWater.List", RefineExpando(obj, true)).Tables)
        {
            list.Add(i);
        }
        return list;
    }

    [ManualMap]
    public static string ConductivityExportExcel(DataRow search)
    {
        var format = DataContext.SqlCache.GetSingleSql("DiWater.ExcelDataConductivity");

        string sql = string.Format(format, search.TypeCol<string>("di_column")
            , search.TypeCol<string>("di_table")
            , search.TypeCol<string>("conductivity")
            , search.TypeCol<string>("conductivity_table"));

        return sql;
    }

    [ManualMap]
    public static IResult ExportExcel(string diwater, string eqpCode, string fromDt, string toDt)
    {
        DataRow search = DataContext.StringDataSet("@DiWater.SearchMapping", new { EqpCode = eqpCode }).Tables[0].Rows[0];

        var format = DataContext.SqlCache.GetSingleSql("DiWater.ExcelData");

        string sql = String.IsNullOrEmpty(search.TypeCol<string>("nonconductivity"))
            ? ConductivityExportExcel(search)
            : string.Format(format, search.TypeCol<string>("di_column")
            , search.TypeCol<string>("di_table")
            , search.TypeCol<string>("nonconductivity")
            , search.TypeCol<string>("nonconductivity_table")
            , search.TypeCol<string>("conductivity")
            , search.TypeCol<string>("conductivity_table"));

        dynamic obj = new ExpandoObject();
        obj.FromDt = fromDt;
        obj.ToDt = toDt;

        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        var dt = db.ExecuteStringDataSet(sql, obj).Tables[0];

        List<Tuple<string, string, double, System.Type, Func<DataRow, object>?>> mapList = new()
        {
            new("di_name","Di 설비명",25, typeof(string),null),
            new("converttime","Di_DateTime",17, typeof(DateTime), (row)=>{ return row.TypeCol<DateTime?>("converttime")?.ToString("yyyy-MM-dd HH:mm") ?? string.Empty; }),
            new("value","Di_value",25,typeof(double),null),

            new("eq_name", "INPUT 설비명(비저항)",25, typeof(string),null),
            new("converttime1","input_DateTime",17, typeof(DateTime), (row)=>{ return row.TypeCol<DateTime?>("converttime1")?.ToString("yyyy-MM-dd HH:mm") ?? string.Empty; }),
            new("value1","input_value",25,typeof(double), (row)=>{ return row.TypeCol<float?>("value1") ?? null; }),

            new("eq_name", "OUTPUT 설비명(전도도)",25, typeof(string),null),
            new("converttime2","output_DateTime",17, typeof(DateTime), (row)=>{ return row.TypeCol<DateTime?>("converttime2")?.ToString("yyyy-MM-dd HH:mm") ?? string.Empty; }),
            new("value2","output_value",25,typeof(double),null),
        };

        using var excel = ExcelEx.ToExcel(dt, mapList);

        return Results.File(excel.GetAsByteArray(), "application/force-download", $"DI_Water-{DateTime.Now:yyyyMMdd}.xlsx");
    }

    [ManualMap]
    public static int DownListInsert([FromBody] IDictionary dic)
    {
        string rawJson = dic.TypeKey<string>("rawJson");

        int result = 0;

        var rawList = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(rawJson);

        if(rawList.Count > 0)
        {
            dynamic obj = new ExpandoObject();
            obj.Json = rawJson;

            result = DataContext.StringNonQuery("@DiWater.Insert", RefineExpando(obj));
        }
        return result;
    }

    [ManualMap]
    public static IEnumerable Test(int fromDt, string eqpCode, string diwater)
    {
        dynamic obj = new ExpandoObject();
        obj.eqpCode = eqpCode;
        obj.diwater = diwater;

        DataTable mapList = DataContext.StringDataSet("@DiWater.MapSearch", obj).Tables[0];
        List<DataTable> dtList = new List<DataTable>();

        for(int i =1; i<=3; i++)
        {
            var dr = mapList.AsEnumerable().Where(row => row.Field<int>("row_no") == i);
            if (dr.Count() > 0)
            {
                DataRow item = dr.CopyToDataTable().Rows[0];
                dynamic obj2 = new ExpandoObject();
                obj2.FromDt = fromDt;
                obj2.eqpCode = item.TypeCol<string>("eqp_code");
                obj2.paramName = item.TypeCol<string>("param_name");

                var _sql = DataContext.SqlCache.GetSingleSql("DiWater.GetListB");

                string sql = string.Format(_sql, item.TypeCol<string>("column_name"), item.TypeCol<string>("table_name"));

                var db = DataContext.Create(null);
                db.IgnoreParameterSame = true;

                var dt = db.ExecuteStringDataSet(sql, obj2).Tables[0];
                dtList.Insert(i - 1, dt);
            }
            else
            {
                dtList.Insert(i-1, new DataTable());
            }
        }

        dynamic mergeobj = new ExpandoObject();
        mergeobj.dijson = JsonConvert.SerializeObject(dtList[0]);
        mergeobj.inputjson = JsonConvert.SerializeObject(dtList[1]);
        mergeobj.outputjson = JsonConvert.SerializeObject(dtList[2]);

        DataTable vvvv = DataContext.StringDataSet("@DiWater.ListMerge", mergeobj).Tables[0];

        dtList.Insert(3, vvvv);

        var vv = dtList[3].AsEnumerable();

        var ttt = (
               from times in dtList[3].AsEnumerable()
               join di in dtList[0].AsEnumerable() on times.Field<DateTime>("std_time") equals di.Field<DateTime>("std_time") into diGroup
               from di in diGroup.DefaultIfEmpty()
               join input in dtList[1].AsEnumerable() on times.Field<DateTime>("std_time") equals input.Field<DateTime>("std_time") into inputGroup
               from input in inputGroup.DefaultIfEmpty()
               join output in dtList[2].AsEnumerable() on times.Field<DateTime>("std_time") equals output.Field<DateTime>("std_time") into outputGroup
               from output in outputGroup.DefaultIfEmpty()
               select new
               {
                   std_time = times.Field<DateTime>("std_time"),
                   di = di?.Field<Decimal>("value"),
                   di_name = di?.Field<string>("eqp_name"),
                   di_param_name = di?.Field<string>("param_name"),
                   input = input?.Field<Decimal>("value"),
                   input_name = input?.Field<string>("eqp_name"),
                   input_param_name = input?.Field<string>("param_name"),
                   output = output?.Field<Decimal>("value"),
                   output_name = output?.Field<string>("eqp_name"),
                   output_param_name = output?.Field<string>("param_name"),
               }
            );

        return ttt;
    }

    [ManualMap]
    public static DataTable Test2(string eqpCode, string diwater)
    {
        dynamic obj = new ExpandoObject();
        obj.eqpCode = eqpCode;
        obj.diwater = diwater;

        DataTable mapList = DataContext.StringDataSet("@DiWater.MapSearch", obj).Tables[0];
        List<DataTable> dtList = new List<DataTable>();

        for (int i = 1; i <= 3; i++)
        {
            var dr = mapList.AsEnumerable().Where(row => row.Field<int>("row_no") == i);
            if (dr.Count() > 0)
            {
                DataRow item = dr.CopyToDataTable().Rows[0];

                var _sql = DataContext.SqlCache.GetSingleSql("DiWater.GetTotalCount2");

                string sql = string.Format(_sql, item.TypeCol<string>("eqp_code"), item.TypeCol<string>("condition"), item.TypeCol<string>("column_name"), item.TypeCol<string>("table_name"));

                var db = DataContext.Create(null);
                db.IgnoreParameterSame = true;

                dynamic obj2 = new ExpandoObject();
                obj2.eqpCode = item.TypeCol<string>("eqp_code");
                obj2.paramName = item.TypeCol<string>("param_name");

                var dt = db.ExecuteStringDataSet(sql, obj2).Tables[0];
                dtList.Insert(i - 1, dt);
            }
            else
            {
                dtList.Insert(i - 1, new DataTable());
            }
        }

        dynamic mergeobj = new ExpandoObject();
        mergeobj.dijson = JsonConvert.SerializeObject(dtList[0]);
        mergeobj.inputjson = JsonConvert.SerializeObject(dtList[1]);
        mergeobj.outputjson = JsonConvert.SerializeObject(dtList[2]);

        var res = DataContext.StringDataSet("@DiWater.NgCountMerge", mergeobj).Tables[0];

        return res;
        //return DataContext.StringDataSet("@DiWater.GetTotalCount").Tables[0];
    }

    [ManualMap]
    public static IEnumerable<IDictionary> TakeActionList(DateTime fromDt, DateTime toDt)
    {
        dynamic obj = new ExpandoObject();
        obj.FromDt = fromDt;
        obj.ToDt = toDt;


        DataTable dt = DataContext.StringDataSet("@DiWater.TakeactionList", RefineExpando(obj)).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static string GetNgListConductivity(DataRow search)
    {
        var format = DataContext.SqlCache.GetSingleSql("DiWater.GetNgListConductivity");

        string sql = string.Format(format, search.TypeCol<string>("di_column")
            , search.TypeCol<string>("di_table")
            , search.TypeCol<string>("conductivity")
            , search.TypeCol<string>("conductivity_table"));

        return sql;
    }

    [ManualMap]
    public static IEnumerable<IDictionary> GetNgList([FromBody] IDictionary dic)
    {
        string rawJson = dic.TypeKey<string>("list");
        DataTable dt = new DataTable();

        var rawList = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(rawJson);

        foreach (var item in rawList)
        {
            dynamic searchObj = new ExpandoObject();
            searchObj.eqpCode = item.TypeKey<string>("eqpCode");

            DataRow search = DataContext.StringDataSet("@DiWater.SearchMapping", RefineExpando(searchObj)).Tables[0]?.Rows[0];

            dynamic obj = new ExpandoObject();
            obj.FromDt = item.TypeKey<int>("fromDt");
            obj.DiWater = item.TypeKey<string>("diwater");

            var format = DataContext.SqlCache.GetSingleSql("DiWater.GetNgList");

            string sql = String.IsNullOrEmpty(search.TypeCol<string>("nonconductivity")) 
                ? GetNgListConductivity(search) 
                : string.Format(format, search.TypeCol<string>("di_column")
                , search.TypeCol<string>("di_table")
                , search.TypeCol<string>("nonconductivity")
                , search.TypeCol<string>("nonconductivity_table")
                , search.TypeCol<string>("conductivity")
                , search.TypeCol<string>("conductivity_table"));

            var db = DataContext.Create(null);
            db.IgnoreParameterSame = true;

            dt.Merge(db.ExecuteStringDataSet(sql, RefineExpando(obj)).Tables[0]);
        }

        var distinctRows = dt.AsEnumerable()
            .GroupBy(g => new {  eqcode = g?.TypeCol<string?>("eqcode"), min_dt = g?.TypeCol<DateTime>("min_dt"), max_dt = g?.TypeCol<DateTime>("max_dt") })
            .Select(g => g.First());

        if (dt.Rows.Count > 0)
            return ToDic(distinctRows.CopyToDataTable());

        return ToDic(dt);

    }

    [ManualMap]
    public static int TakeAction([FromBody] IDictionary dic)
    {
        string rawJson = dic.TypeKey<string>("rawJson");

        int result = 0;

        var rawlist = JsonConvert.DeserializeObject<List<Dictionary<string,string>>>(rawJson); 

        foreach (Dictionary<string, string> item in rawlist)
        {
            dynamic obj = new ExpandoObject();
            obj.Eqcode = item.TypeKey<string>("eqcode");
            obj.MaxDt = item.TypeKey<DateTime>("maxDt");
            obj.MinDt = item.TypeKey<DateTime>("minDt");
            obj.Remark = String.IsNullOrEmpty(item.TypeKey<string?>("remark")) ? "" : item.TypeKey<string?>("remark");

            result += DataContext.StringNonQuery("@DiWater.ActionInsert", RefineExpando(obj));
        }
        return result;
    }

    [ManualMap]
    public static int AddEqp([FromBody] Dictionary<string, object?> dic)
    {
        var param = dic.ToCleanDic().ToDictionary(x => x.Key, y => y.Value == "" ? "null" : y.Value);

        DataTable exist = DataContext.StringDataSet("@DiWater.ExistYn", RefineParam(param)).Tables[0];
        if(exist.Rows.Count > 0)
        {
            return -1;
        }

        dynamic obj = new ExpandoObject();
        obj.DiWater = dic.TypeKey<string>("diwater");
        obj.EqpCode = dic.TypeKey<string>("eqpCode");
        obj.EqpName = dic.TypeKey<string>("eqpName");
        obj.NonctableName = dic.TypeKey<string>("nonconductivityTable");
        obj.Nonconductivity = dic.TypeKey<string>("nonconductivity");
        obj.CtableName = dic.TypeKey<string>("conductivityTable");
        obj.Conductivity = dic.TypeKey<string>("conductivity");

        var result = DataContext.StringNonQuery("@DiWater.AddEqp", RefineParam(obj));

        return result;
    }

    public static DiWaterList ListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(),
            DateTime.Now.AddMinutes(GetCacheMin()),
            ListAll);

        return list;
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }


    #region DiWater Combo

    [ManualMap]
    public static DataTable DiWaterListCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey("diwater_list"),
            DateTime.Now.AddMinutes(GetCacheMin()),
            () =>
            {
                return DataContext.StringDataSet("@DiWater.SystemList", new { }).Tables[0];
            });
        return list;
    }

    [ManualMap]
    public static Map DiWaterLisGetMap(string? category = null)
    {
        return DiWaterListCache().AsEnumerable()
        .OrderBy(x => x.TypeCol<string>("codegroup_id"))
        .Select(y =>
        {
            return new MapEntity(
                y.TypeCol<string>("codegroup_name"),
                y.TypeCol<string>("codegroup_id"),
                string.Empty,
                'Y');
        }).ToMap();
    }

    [ManualMap]
    public static void DiWaterListRefreshMap()
    {
        UtilEx.RemoveCache(BuildCacheKey("diwater_list"));
    }

    #endregion

    #region DiWaterCol Combo

    [ManualMap]
    public static DataTable DiWaterColListCache(string table)
    {
        dynamic obj = new ExpandoObject();
        obj.table = table;

        var list = UtilEx.FromCache(
            BuildCacheKey("col_list"),
            DateTime.Now.AddMinutes(GetCacheMin()),
            () =>
            {
                return DataContext.StringDataSet("@DiWater.ColumnList", RefineExpando(obj)).Tables[0];
            });
        return list;
    }

    [ManualMap]
    public static Map DiWaterColLisGetMap(string? category = null)
    {
        if (category == null)
            return new(new());

        return DiWaterColListCache(category).AsEnumerable()
        .OrderBy(x => x.TypeCol<string>("columnname"))
        .Select(y =>
        {
            return new MapEntity(
                y.TypeCol<string>("columnname"),
                y.TypeCol<string>("symbolcomment"),
                y.TypeCol<string>("tablename"),
                'Y');
        }).ToMap();
    }

    [ManualMap]
    public static void DiWaterColListRefreshMap()
    {
        UtilEx.RemoveCache(BuildCacheKey("col_list"));
    }

    #endregion

    #region EqpList Combo

    [ManualMap]
    public static DataTable EqpListAll(string diwater)
    {
        dynamic obj = new ExpandoObject();
        obj.DiWater = diwater;

        return DataContext.StringDataSet("@DiWater.EqpList", RefineExpando(obj)).Tables[0];
    }


    public static Map GetMap(string? category = null)
    {
        if (category == null)
            return new(new());

        return EqpListAll(category).AsEnumerable()
       .OrderBy(x => x.TypeCol<string>("code_name"))
       .Select(y => {
           return new MapEntity(
               y.TypeCol<string>("code_id"),
               y.TypeCol<string>("code_name"),
               string.Empty,
               'Y');
       }).ToMap();
    }

    public static void RefreshMap()
    {
        RemoveCache();
    }

    #endregion
}
