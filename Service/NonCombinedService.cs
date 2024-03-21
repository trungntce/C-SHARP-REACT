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
using Microsoft.EntityFrameworkCore;
using Microsoft.Practices.EnterpriseLibrary.Data;
using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.FormulaParsing.Excel.Functions.DateTime;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Math;

public class NonCombinedService : MinimalApiService, IMinimalApi
{
    public NonCombinedService(ILogger<NonCombinedService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/list", nameof(NonCombinedList));

        return RouteAllEndpoint(group);
    }

    [ManualMap]
    public static DataTable NonCombinedList(string fromDt, string toDt, char? typeCode, string? eqpCode, string? eqpName)
    {
        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        dynamic obj = new ExpandoObject();
        obj.FromDt = DateTime.Parse(fromDt).ToString("yyyy-MM-dd 00:00:00");
        obj.ToDt = DateTime.Parse(toDt).ToString("yyyy-MM-dd 00:00:00");
        obj.TypeCode = typeCode;
        obj.EqpCode = eqpCode;
        obj.EqpName = eqpName;

        var dt = DataContext.StringDataSet("@NonCombined.List", RefineExpando(obj, true)).Tables[0];

        DataTable resDt = new DataTable();

        resDt.Columns.Add("eqp_code", typeof(string));
        resDt.Columns.Add("eqp_desc", typeof(string));
        resDt.Columns.Add("type_code", typeof(string));
        resDt.Columns.Add("over_value_sum", typeof(int));
        resDt.Columns.Add("total_time", typeof(int));
        resDt.Columns.Add("off_time", typeof(int));


        foreach (DataRow row in dt.Rows)
        {
            obj.eqpCode = row.TypeCol<string>("eqp_code");
            DataRow off_time_value = db.ExecuteStringDataSet("@NonCombined.EqpOffTime", obj).Tables[0].Rows[0];
            int v = (int)off_time_value["non_time"];

            resDt.Rows.Add(obj.eqpCode,
              row.TypeCol<string>("eqp_desc"),
              row.TypeCol<string>("type_code"),
              row.TypeCol<int>("over_value_sum"),
              row.TypeCol<int>("total_time"),
              v
              );
        }
        return resDt;
    }
}
