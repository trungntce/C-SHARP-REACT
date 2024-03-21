namespace WebApp;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Drawing.Printing;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.WebSockets;
using System.Text;
using System.Xml.Linq;
using Framework;
using k8s.KubeConfigModels;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OfficeOpenXml;
using Unity.Interception.Utilities;
using YamlDotNet.Core.Tokens;

public class DownLoadService : MinimalApiService, IMinimalApi
{
    public DownLoadService(ILogger<DownLoadService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/aoirawdata", nameof(AoiRawData));        //aoi raw data excel

		group.MapGet("/panelparam", nameof(PanelParam));        

		return RouteAllEndpoint(group);
    }

    [ManualMap]
    public static IResult AoiRawData(DateTime fromDt)
    {
        dynamic obj = new ExpandoObject();
        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(fromDt);

        var dt = DataContext.StringDataSet("@DownLoad.AoiRawData", RefineExpando(obj, true)).Tables[0];


        Dictionary<string, string> colDic = new()
                {
                    {"mesdate","mesdate" },
                    {"eqp_code","eqp_code"},
                    {"workorder","workorder"},
                    {"model_code","model_code"},
                    {"model_description","model_description"},
                    {"pnlno","pnlno"},
                    {"layer","layer"},
                    {"ngcode","ngcode"},
                    {"create_dt","create_dt"},
                    {"piece_no","piece_no"},
                    {"oper_seq_no","oper_seq_no"},
                    {"panel_qty","panel_qty"},
                    {"grade","grade"},
                    {"pcs_per_pnl_qty","pcs_per_pnl_qty"},
                    {"ng_code","ng_code"},
                    {"ng_name","ng_name"},
                    {"filelocation","filelocation"},
                    {"barcode","barcode"}
                };
        return Results.File(ExcelEx.ToExcelSimple(dt),"application/force-download",$"test-{DateTime.Now:yyyyMMdd}.xlsx");

        /* List<Tuple<string, string, double, System.Type, Func<DataRow, object>?>> mapList = new()
                 {
                     new("mesdate","mesdate",25, typeof(DateTime), (row)=>{ return row.TypeCol<DateTime?>("mesdate")?.ToString("yyyy-MM-dd") ?? string.Empty; }),
                     new("eqp_code","eqp_code",30, typeof(string) ,null),
                     new("workorder","workorder",30, typeof(string) ,null),
                     new("model_code","model_code",30, typeof(string) ,null),
                     new("model_description","model_description",30, typeof(string) ,null),
                     new("pnlno","pnlno",30, typeof(int) ,null),
                     new("layer","layer",30, typeof(int) ,null),
                     new("ngcode","ngcode",30, typeof(int) ,null),
                     new("create_dt","create_dt",30, typeof(DateTime), (row)=>{ return row.TypeCol<DateTime?>("create_dt")?.ToString("yyyy-MM-dd HH:mm") ?? string.Empty; }),
                     new("piece_no","piece_no",20, typeof(int) ,null),
                     new("oper_seq_no","oper_seq_no",30, typeof(int) ,null),
                     new("panel_qty","panel_qty",30, typeof(int) ,null),
                     new("grade","grade",30, typeof(string) ,null),
                     new("pcs_per_pnl_qty","pcs_per_pnl_qty",30, typeof(int) ,null),
                     new("ng_code","ng_code",10, typeof(int) ,null),
                     new("ng_name","ng_name",30, typeof(string) ,null),
                     new("filelocation","filelocation",50, typeof(string) ,null),
                     new("barcode","barcode",30, typeof(string) ,null),
                 };

         using var excel = ExcelEx.ToExcel(dt, mapList);

         return Results.File(excel.GetAsByteArray(), "application/force-download", $"AoiRawData-{DateTime.Now:yyyyMMdd}.xlsx");
 */
    }

    [ManualMap]
    public static IResult PanelParam(DateTime fromDt)
    {
        dynamic obj = new ExpandoObject();
		obj.FromDt = SearchFromDt(fromDt);
		obj.ToDt = SearchToDt(fromDt);

		var dt = DataContext.StringDataSet("@DownLoad.PanelParam", RefineExpando(obj, true)).Tables[0];


        Dictionary<string, string> colDic = new()
                {
				   {"eqp_code" , "eqp_code"},
				   {"param_id" , "param_id"},
				   {"item_key" , "item_key"},
				   {"panel_id" , "panel_id"},
				   {"param_name" , "param_name"},
				   {"std" , "std"},
				   {"lcl" , "lcl"},
				   {"ucl" , "ucl"},
				   {"lsl" , "lsl"},
				   {"usl" , "usl"},
				   {"eqp_min_val" , "eqp_min_val"},
				   {"eqp_max_val" , "eqp_max_val"},
				   {"eqp_avg_val" , "eqp_avg_val"},
				   {"eqp_start_dt" , "eqp_start_dt"},
				   {"eqp_end_dt" , "eqp_end_dt"},
				   {"judge" , "judge"},
				   {"raw_type" , "raw_type"},
				   {"table_name" , "table_name"},
				   {"column_name" , "column_name"},
				   {"create_dt" , "create_dt" }
				};
        return Results.File(ExcelEx.ToExcelSimple(dt), "application/force-download", $"test-{DateTime.Now:yyyyMMdd}.xlsx");
    }
}

