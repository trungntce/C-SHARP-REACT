namespace WebApp;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Drawing.Printing;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.WebSockets;
using System.Reflection;
using System.Text;
using Framework;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Practices.EnterpriseLibrary.Data;
using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.FormulaParsing.Excel.Functions.DateTime;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Math;

public class MonitoringParamService : MinimalApiService, IMinimalApi
{
    public MonitoringParamService(ILogger<MonitoringDetailService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/symbolcomment", nameof(SymbolComment));
        group.MapGet("/header", nameof(Header));
        group.MapGet("/susedi", nameof(SuseDi));

        return RouteAllEndpoint(group);
    }

    public static DataTable List(string? lastdt, string eqpcode, string column, string range = "hour", string? colltype = null)
    {
        string _sql = "";

        if (colltype == "pc")
        {
            switch (range)
            {
                case "hour":
                    _sql = @"select  [time], {0} 
                        from {1} 
                        where
	                        case
		                        when @last_dt = 'null' then dateadd(hh,-6,getdate())
		                        else @last_dt 
	                        end	< [time] and　[time] <= getdate()
                        order by [time] desc;";
                    break;
                case "day":
                    _sql = @"select  inserttime, {0} 
                        from {1} 
                        where
	                        case
		                        when @last_dt = 'null' then dateadd(dd,-1,getdate())
		                        else @last_dt 
	                        end	< inserttime and inserttime <= getdate() 
                        order by inserttime desc;";
                    break;
                case "week":
                    _sql = @"select  inserttime, {0} 
                        from {1} 
                        where
	                        case
		                        when @last_dt = 'null' then dateadd(dd,-7,getdate())
		                        else @last_dt 
	                        end	< inserttime and inserttime <= getdate() 
                        order by inserttime desc;";
                    break;
            }
        }
        else
        {
            switch (range)
            {
                case "hour":
                    _sql = @"select  inserttime, {0} 
                        from {1} 
                        where
	                        case
		                        when @last_dt = 'null' then dateadd(hh,-6,getdate())
		                        else @last_dt 
	                        end	< inserttime and inserttime <= getdate() 
                        order by inserttime desc;";
                    break;
                case "day":
                    _sql = @"select  inserttime, {0} 
                        from {1} 
                        where
	                        case
		                        when @last_dt = 'null' then dateadd(dd,-1,getdate())
		                        else @last_dt 
	                        end	< inserttime and inserttime <= getdate() 
                        order by inserttime desc;";
                    break;
                case "week":
                    _sql = @"select  inserttime, {0} 
                        from {1} 
                        where
	                        case
		                        when @last_dt = 'null' then dateadd(dd,-7,getdate())
		                        else @last_dt 
	                        end	< inserttime and inserttime <= getdate() 
                        order by inserttime desc;";
                    break;
            }
        }

        dynamic tbName = new ExpandoObject();
        tbName.eqpCode = eqpcode;
        string tableName = colltype == "pc" ? DataContext.StringValue<string>("@MonitoringParam.PcTableName", tbName) : DataContext.StringValue<string>("@MonitoringParam.TableName", tbName);

        var sql = string.Format(_sql, column, tableName);

        dynamic obj = new ExpandoObject();
        obj.condition = lastdt is null ? "0" : "1";
        obj.lastDt = lastdt is null ? "null" : lastdt;
        obj.eqpCode = eqpcode;
        obj.colunm = column;

        return DataContext.StringDataSet(sql, RefineExpando(obj)).Tables[0];
    }

    [ManualMap]
    public static DataTable SymbolComment(string eqpcode, string column, string? colltype = null)
    {
        dynamic obj = new ExpandoObject();
        obj.eqpcode = eqpcode;
        obj.column = column;

        var list = UtilEx.FromCache(
            BuildCacheKey($"room_list_{eqpcode}"),
            DateTime.Now.AddMinutes(GetCacheMin()),
            () => {
                return colltype == "pc" ? DataContext.StringDataSet("@MonitoringParam.PcSymbolComment", RefineExpando(obj)).Tables[0] : DataContext.StringDataSet("@MonitoringParam.SymbolComment", RefineExpando(obj)).Tables[0];
            });


        return list;
    }

    [ManualMap]
    public static string Header(string eqpcode)
    {

        dynamic obj = new ExpandoObject();
        obj.eqpCode = eqpcode;

        var header = UtilEx.FromCache(
            BuildCacheKey($"header_name_{eqpcode}"),
            DateTime.Now.AddMinutes(GetCacheMin()),
            () =>
            {
                return DataContext.StringValue<string>("@MonitoringParam.HeaderName", obj);
            }); 
        
        return header;
    }

    [ManualMap]
    public static IResult SuseDi(DateTime? lastDt, int range, bool isExcel = false)
    {

        DateTime nullDate = DateTime.Now.AddDays(-range);
        dynamic obj = new ExpandoObject();
        obj.lastDt = lastDt is null ? nullDate : lastDt;

        var dt = DataContext.StringDataSet("@MonitoringParam.SuseDi", RefineExpando(obj)).Tables[0];

        if (!isExcel)
        {
            return Results.Json(ToDic(dt));
        }

        dynamic downobj = new ExpandoObject();
        downobj.lastDt = nullDate;
        var downDt = DataContext.StringDataSet("@MonitoringParam.SuseDi", RefineExpando(downobj)).Tables[0];
        return ExcelDown(downDt, "surface_11015");
        
    }

    [ManualMap]
    public static IResult ExcelDown(DataTable dt, string fileName)
    {
        Dictionary<string, string> colDic = new()
        {
            { "update_dt", "업데이트 시간" },
            { "param_value", "파라미터 값" },
        };

        return Results.File(ExcelEx.ToExcelSimple(dt, colDic), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }
}