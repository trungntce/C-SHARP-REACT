namespace WebApp;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Threading.Tasks;
using System.Data;
using System.Transactions;
using Framework;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Mvc;
using System.Dynamic;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Math;
using static Unity.Storage.RegistrationSet;
using System.Net;
using Google.Protobuf;

public class NewModelCheckSheetService : MinimalApiService, IMinimalApi 
{
    public NewModelCheckSheetService(ILogger<UserService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        //group.MapGet("login", nameof(Login));
        //group.MapPost("profile", nameof(ProfileUpdate));
        group.MapPost("save", nameof(savemodelchecksheet));

        return RouteAllEndpoint(group);
    }

 

    public static IResult List()
    {
        dynamic obj = new ExpandoObject();
        DataTable dtResult = DataContext.StringDataSet("@newmodelchecksheet.List", RefineExpando(obj, true)).Tables[0];
     
        return Results.Json(dtResult); //{"sort":2,"BOM_ITEM_CODE":"B0928204822-MHB-02","BOM_ITEM_DESCRIPTION":"A34 5G 8M(LDI)","CREATION_DATE":"2023-10-10 14:10:32","Total":"NG","recipe":"OK","gbr_data":"OK"}
    }


    [ManualMap]
    public static object savemodelchecksheet([FromBody] Dictionary<string,object> entity)
    {
        var obj = new ExpandoObject();
        foreach (var item in entity)
        {
            try
            {
                string value = item.Value.ToString();
                if (string.IsNullOrEmpty(value)) value = null;
                obj.TryAdd(item.Key, value);
            }
            catch
            {
                return 0;
            }
        }
        obj.TryAdd("userid", BaseServiceEx.UserId);
        obj.TryAdd("ccount", 0);
        try
        {
            var db = DataContext.Create(null);
            db.IgnoreParameterSame = false;           
            var success = db.ExecuteStringScalar<object>("@newmodelchecksheet.Upsert", RefineExpando(obj,true));
            db.ExecuteStringScalar<object>("@newmodelchecksheet.UpHist", RefineExpando(obj, true));
            return success;
        }
        catch
        {
            return 0;
        }
    }
}
