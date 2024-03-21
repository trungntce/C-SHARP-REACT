namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Drawing.Printing;
using System.Dynamic;
using System.Linq;

using Framework;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using Unity.Interception.Utilities;

public class ModelOperExtNewService : MinimalApiService, IMinimalApi
{
    public ModelOperExtNewService(ILogger<ModelOperExtNewService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("erpmodel", nameof(ErpModelList));
        group.MapGet("opereqplistbymodel", nameof(ErpOperEqpListByModel));
        group.MapGet("approvedoper", nameof(ApprovedOper));

        return RouteAllEndpoint(group);
    }
    
    public static List<ModelOperExtEntity> List(string modelCode, char? approveYn, bool flag = true)
    {        
        var erpOperListWithEqpJson = ErpOperEqpListByModel(modelCode);

        dynamic obj = new ExpandoObject();
        obj.ModelCode = modelCode;

        List<ModelOperExtEntity> modelExtList = new List<ModelOperExtEntity>();
        if (string.IsNullOrEmpty(approveYn.ToString()) || !string.IsNullOrEmpty(approveYn.ToString()) && approveYn == 'Y')
        {
            modelExtList = DataContext.StringEntityList<ModelOperExtEntity>("@ModelOperExtNew.List", RefineExpando(obj, true));
        }
        else if (!string.IsNullOrEmpty(approveYn.ToString()) && approveYn == 'N')
        {
            modelExtList = DataContext.StringEntityList<ModelOperExtEntity>("@ModelOperExtNew.ExList", RefineExpando(obj, true));
        }
        
        foreach (var oper in erpOperListWithEqpJson)
        {
            var find = modelExtList.FirstOrDefault(x => x.OperationCode == oper.OperationCode && x.OperationSeqNo == oper.OperationSeqNo);
            if(find != null)
            {
                find.Adapt(oper);
                continue;
            }

            if (flag)
            {
                find = modelExtList.FirstOrDefault(x => x.OperationCode == oper.OperationCode);
                if (find != null)
                {
                    find.Adapt(oper);
                    continue;
                }
            }
        }

        foreach (var erpOper in erpOperListWithEqpJson)
        {
            var erpEqpList = erpOper.OperEqpList; // ERP 설비 리스트
            var extEqpList = erpOper.EqpList; // ModelOperExt에 설정된 설비 리스트

            if (erpEqpList.Count <= 0)
                continue;

            if (extEqpList.Count <= 0)
            {
                erpEqpList.ForEach(x => x["useYn"] = 'Y'); // 설정 안된 경우 기본값 Y
            }
            else
            {
                erpEqpList.ForEach(x =>
                {
                    string eqpCode = x.TypeKey<string>("eqpCode");
                    x["useYn"] = extEqpList.Any(y => (y.TypeKey<string>("eqpCode") == eqpCode) && y.SafeTypeKey("useYn", 'N') == 'Y') ? 'Y' : 'N';
                });
            }

            erpOper.OperEqpJson = JsonConvert.SerializeObject(erpEqpList);
        }

        return erpOperListWithEqpJson;
    }


    [ManualMap]
    public static List<ModelOperExtEntity> ErpOperEqpListByModel(string modelCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ModelCode = modelCode;

        return DataContext.StringEntityList<ModelOperExtEntity>("@ModelOperExtNew.ErpOperEqpListByModel", RefineExpando(obj, true));
    }

    [ManualMap]
    public static IEnumerable<IDictionary> ErpModelList(string? itemCode, string? modelCode, string? modelDescription, string? itemCategoryCode, char? setupYn, char? approveYn)
    {
        var modelList = ErpModelService.List(itemCode, modelCode, modelDescription, itemCategoryCode);

        if (string.IsNullOrEmpty(approveYn.ToString()) || !string.IsNullOrEmpty(approveYn.ToString()) && approveYn == 'Y')
        {
            var distinctList = DataContext.StringEntityList<ModelOperExtEntity>("@ModelOperExtNew.ModelDistinctList", new { }).Select(x => x.ModelCode);
            modelList.ForEach(x => {
                if (distinctList.Contains(x.TypeKey<string>("modelCode")))
                {
                    //x["setupYn"] = 'Y';
                    x["approveYn"] = 'Y';
                    x["codeName"] = CodeService.CodeName("APPROVAL_TYPE", "N");
                }
            });

            //if (setupYn == 'Y')
            //    return modelList.Where(x => x.TypeKey<char>("setupYn") == 'Y');
            if (approveYn == 'Y')
                return modelList.Where(x => x.TypeKey<char>("approveYn") == 'Y');
        }
        else if (!string.IsNullOrEmpty(approveYn.ToString()) && approveYn == 'N')
        {
            var distinctList = DataContext.StringEntityList<ModelOperExtEntity>("@ModelOperExtNew.ModelDistinctExList", new { }).Select(x => x.ModelCode);
            modelList.ForEach(x => {
                if (distinctList.Contains(x.TypeKey<string>("modelCode")))
                {
                    x["approveYn"] = 'N';
                    x["codeName"] = CodeService.CodeName("APPROVAL_TYPE", "N");
                }
            });

            if (approveYn == 'N')
                return modelList.Where(x => x.TypeKey<char>("approveYn") == 'N');
        }

        return modelList;
    }

    //public static int Update([FromBody] IDictionary<string, List<ModelOperExtEntity>> dic)
    //{
    //    var modelCode = dic.Keys.First();
    //    var list = dic[modelCode];

    //    dynamic obj = new ExpandoObject();
    //    obj.ModelCode = modelCode;
    //    obj.Json = JsonConvert.SerializeObject(list);
    //    obj.DeleteAll = list.Count <= 1 ? 'N' : 'Y';

    //    return DataContext.StringNonQuery("@ModelOperExtNew.Update", RefineExpando(obj));
    //}

    public static int Update([FromBody] IDictionary<string, List<ModelOperExtEntity>> dic)
    {
        var modelCode = dic.Keys.First();
        var list = dic[modelCode];

        if(ModelApproveService.ApproveCheck(modelCode) > 0)
        {
            return -1;
        }

        dynamic obj = new ExpandoObject();
        obj.ModelCode = modelCode;

        if ((DataContext.StringValue<int>("@ModelOperExtNew.EditCheck", RefineExpando(obj, true))) > 0)
        {
            return -1;
        }

        obj.Json = JsonConvert.SerializeObject(list);
        obj.DeleteAll = list.Count <= 1 ? 'N' : 'Y';

        obj.ApproveKey = NewShortId();
        var dt = DataContext.StringNonQuery("@ModelRecipeParamMapNew.RecipeParamApproveExUpdate", RefineExpando(obj));

        return DataContext.StringNonQuery("@ModelOperExtNew.UpdateEx", RefineExpando(obj));
    }

    public static int Delete(string modelCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ModelCode = modelCode;

        return DataContext.StringNonQuery("@ModelOperExtNew.Delete", RefineExpando(obj));
    }

    [ManualMap]
    public static IEnumerable<IDictionary> ApprovedOper(string? modelCode, char? approveYn)
    {
        dynamic obj = new ExpandoObject();
        obj.ModelCode = modelCode;

        if (!string.IsNullOrEmpty(approveYn.ToString()) && approveYn == 'N')
        {
            return ToDic(DataContext.StringDataSet("@ModelOperExtNew.ApprovedOperEx", RefineExpando(obj)).Tables[0]);
        }
       
        return ToDic(DataContext.StringDataSet("@ModelOperExtNew.ApprovedOper", RefineExpando(obj)).Tables[0]);
    }
}
