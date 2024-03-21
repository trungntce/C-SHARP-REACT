namespace WebApp;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;

using Framework;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Unity.Interception.Utilities;


//MADE BY SIFLEX
public class RecipeCopyService : MinimalApiService, IMinimalApi
{
    public RecipeCopyService(ILogger<RecipeCopyService> logger) : base(logger)
    {

    }
    //MADE BY SIFLEX
    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/fromCode", nameof(List));
        group.MapGet("/toCode", nameof(ToModelCodeList));
        group.MapGet("/copy", nameof(DoCopy));

        return RouteAllEndpoint(group);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> List(string? modelCode)
    {
        if (modelCode.IsNullOrEmpty())
        {
            return ToDic(new DataTable());
        }
        dynamic obj = new ExpandoObject();
        obj.ModelCode = modelCode;

        //  RemoveCache();

        DataTable dt = DataContext.StringDataSet("@RecipeCopy.List", RefineExpando(obj, true)).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> ToModelCodeList(string? modelCode)
    {
        if (modelCode.IsNullOrEmpty())
        {
            return ToDic(new DataTable());
        }
        dynamic obj = new ExpandoObject();
        obj.ModelCode = modelCode;

        //  RemoveCache();

        DataTable dt = DataContext.StringDataSet("@RecipeCopy.RecipeList", RefineExpando(obj, true)).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static int DoCopy(string fromModelCode, string toModelCode)
    {
        if (fromModelCode.IsNullOrEmpty() || toModelCode.IsNullOrEmpty())
        {
            return -1;
        }

        dynamic obj = new ExpandoObject();
        obj.ModelCode = fromModelCode;
        IEnumerable<IDictionary> fromModelOperExtList = ToDic(DataContext.StringDataSet("@RecipeCopy.ModelOperExtList", RefineExpando(obj, true)).Tables[0]);
        if (fromModelOperExtList.IsNullOrEmpty())
        {
            return -2;
        }

        obj = new ExpandoObject();
        obj.ModelCode = toModelCode;
        DataTable dt = DataContext.StringDataSet("@RecipeCopy.CountOper", RefineExpando(obj, true)).Tables[0];
        if (dt.Rows.Count <= 0 || (int)dt.Rows[0]["CNT"] == 0)
        {
            return -3;
        }

        obj = new ExpandoObject();
        obj.FromModelCode = fromModelCode;
        obj.ToModelCode = toModelCode;
        // Query list in from code
        IEnumerable<IDictionary> fromOperList = ToDic(DataContext.StringDataSet("@RecipeCopy.OperExtList", RefineExpando(obj, true)).Tables[0]);

        obj = new ExpandoObject();
        obj.ModelCode = toModelCode;
        IEnumerable<IDictionary> toOperList = ToDic(DataContext.StringDataSet("@RecipeCopy.List", RefineExpando(obj, true)).Tables[0]);

        fromModelOperExtList.ForEach(x => {
            ModelOperExtEntity modelOperExt = new ModelOperExtEntity();
            modelOperExt.CorpId = x.TypeKey<string>("corpId");
            modelOperExt.FacId = x.TypeKey<string>("facId");
            modelOperExt.FromModelCode = fromModelCode;
            modelOperExt.ToModelCode = toModelCode;
            modelOperExt.OperationSeqNo = x.TypeKey<int>("operationSeqNo");
            modelOperExt.OperationCode = x.TypeKey<string>("operationCode");
            modelOperExt.OperYn = x.TypeKey<char>("operYn");
            modelOperExt.ScanEqpYn = x.TypeKey<char>("scanEqpYn");
            modelOperExt.ScanWorkerYn = x.TypeKey<char>("scanWorkerYn");
            modelOperExt.ScanMaterialYn = x.TypeKey<char>("scanMaterialYn");
            modelOperExt.ScanToolYn = x.TypeKey<char>("scanToolYn");
            modelOperExt.ScanPanelYn = x.TypeKey<char>("scanPanelYn");
            modelOperExt.ScanType = x.TypeKey<char>("scanType");
            modelOperExt.StartYn = x.TypeKey<char>("startYn");
            modelOperExt.EndYn = x.TypeKey<char>("endYn");
            modelOperExt.ReworkYn = x.TypeKey<char>("reworkYn");
            modelOperExt.SplitYn = x.TypeKey<char>("slitYn");
            modelOperExt.MergeYn = x.TypeKey<char>("mergeYn");
            modelOperExt.Remark = x.TypeKey<string>("remark");
            modelOperExt.CreateUser = x.TypeKey<string>("createUser");
            var listFirst = fromOperList.Where((a) => a.TypeKey<string>("operationCode").Equals(modelOperExt.OperationCode) && a.TypeKey<int>("operationSeqNo") == modelOperExt.OperationSeqNo);
            var listSecond = toOperList.Where((a) => a.TypeKey<string>("operationCode").Equals(modelOperExt.OperationCode) && a.TypeKey<int>("operationSeqNo") == modelOperExt.OperationSeqNo);
            var eqpJson = listFirst.Union(listSecond);
            modelOperExt.EqpJson = JsonConvert.SerializeObject(eqpJson);
            DataContext.StringNonQuery("@RecipeCopy.Insert", RefineEntity(modelOperExt));
            foreach (var item in listFirst)
            {
                dynamic objRecipe = new ExpandoObject();
                objRecipe.CorpId = modelOperExt.CorpId;
                objRecipe.FacId = modelOperExt.FacId;
                objRecipe.FromModelCode = modelOperExt.FromModelCode;
                objRecipe.ToModelCode = modelOperExt.ToModelCode;
                objRecipe.OperationSeqNo = item.TypeKey<int>("operationSeqNo");
                objRecipe.EqpCode = item.TypeKey<string>("eqpCode");
                DataContext.StringNonQuery("@RecipeCopy.InsertRecipeParam", RefineEntity(objRecipe));
            }
        });

        return 1;
    }
}
